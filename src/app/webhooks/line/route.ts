import {
  LINE_SIGNATURE_HTTP_HEADER_NAME,
  messagingApi,
  validateSignature,
} from "@line/bot-sdk";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/lib/env/server";
import { createAdminClient } from "@/lib/supabase/admin";

const line = new messagingApi.MessagingApiClient({
  channelAccessToken: env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN,
});

type LineSource = {
  userId?: string;
  groupId?: string;
  type?: string;
};

type LineMentionee = {
  index?: number;
  length?: number;
};

type LineMessage = {
  type?: string;
  text?: string;
  mention?: {
    mentionees?: Array<LineMentionee>;
  };
};

type LineEvent = {
  type?: string;
  source?: LineSource;
  replyToken?: string;
  message?: LineMessage;
  joined?: {
    members?: Array<{ type?: string; userId?: string }>;
  };
  left?: {
    members?: Array<{ type?: string; userId?: string }>;
  };
};

export async function POST(request: NextRequest) {
  const signature = request.headers.get(LINE_SIGNATURE_HTTP_HEADER_NAME);
  if (!signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const bodyText = await request.text();
  const isValid = validateSignature(
    bodyText,
    env.LINE_MESSAGING_CHANNEL_SECRET,
    signature,
  );
  if (!isValid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { events?: LineEvent[] } = {};
  if (bodyText) {
    try {
      body = JSON.parse(bodyText);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ ok: false }, { status: 400 });
    }
  }
  if (!Array.isArray(body.events)) {
    return NextResponse.json({ ok: true });
  }

  const supabaseAdmin = createAdminClient();

  const upsertLineAccount = async (userIds: string | string[]) => {
    const accountIds = Array.isArray(userIds) ? userIds : [userIds];
    if (accountIds.length > 0) {
      const accountsPayload = accountIds.map((accountId) => ({
        id: accountId,
      }));
      await supabaseAdmin
        .from("line_accounts")
        .upsert(accountsPayload, { onConflict: "id" });
    }
  };

  const stripMentions = (text: string, mentionees: Array<LineMentionee>) => {
    if (mentionees.length === 0) {
      return text.trim();
    }
    const ranges = mentionees
      .map((mentionee) => ({
        index: mentionee.index ?? 0,
        length: mentionee.length ?? 0,
      }))
      .filter((range) => range.length > 0)
      .sort((a, b) => b.index - a.index);
    let result = text;
    for (const range of ranges) {
      result =
        result.slice(0, range.index) + result.slice(range.index + range.length);
    }
    return result.trim();
  };

  const connectWorkspaceWithGroup = async (
    workspaceId: string,
    groupId: string,
  ) => {
    const { data, error } = await supabaseAdmin
      .from("workspaces")
      .update({
        line_group_id: groupId,
        line_connect_status: "connected",
      })
      .eq("id", workspaceId)
      .eq("line_connect_status", "pending")
      .is("line_group_id", null)
      .select("id")
      .maybeSingle();
    if (error) {
      console.error(error);
    }
    if (data) {
      return data;
    }
  };

  for (const event of body.events as Array<LineEvent>) {
    if (!event?.type) {
      continue;
    }

    if (event.type === "follow") {
      const userId = event.source?.userId;
      if (userId) {
        await upsertLineAccount(userId);
      }
      if (event.replyToken) {
        await line.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `Thanks for adding the bot! Please open this link to connect your LINE account:\n${env.NEXT_PUBLIC_APP_URL}/connect`,
            },
          ],
        });
      }
      continue;
    }

    if (event.type === "join") {
      const groupId = event.source?.groupId;
      if (groupId && event.replyToken) {
        await line.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "Thanks for adding the bot! To connect your workspace, please mention this bot with your workspace ID.",
            },
          ],
        });
      }
      continue;
    }

    if (event.type === "memberJoined") {
      const joinedMemberIds =
        event.joined?.members
          ?.map((member) => member.userId)
          .filter((memberId): memberId is string => Boolean(memberId)) ?? [];
      await upsertLineAccount(joinedMemberIds);
    }

    if (event.type === "message") {
      const groupId = event.source?.groupId;
      const text = event.message?.type === "text" ? event.message.text : null;
      const senderUserId = event.source?.userId;
      if (!groupId || !text || !senderUserId) {
        continue;
      }

      const rawId = stripMentions(
        text,
        event.message?.mention?.mentionees ?? [],
      );
      const { success, data: workspaceId } = z.uuid().safeParse(rawId);
      if (!success) {
        continue;
      }

      const { data: senderAccount, error: senderAccountError } =
        await supabaseAdmin
          .from("line_accounts")
          .select("profile_id")
          .eq("id", senderUserId)
          .maybeSingle();
      if (senderAccountError) {
        console.error(senderAccountError);
        continue;
      }
      if (!senderAccount?.profile_id) {
        if (event.replyToken) {
          await line.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: "text",
                text: `Please connect your LINE account first:\n${env.NEXT_PUBLIC_APP_URL}/connect`,
              },
            ],
          });
        }
        continue;
      }

      const { data: membership, error: membershipError } = await supabaseAdmin
        .from("profiles_workspaces")
        .select("role")
        .eq("profile_id", senderAccount.profile_id)
        .eq("workspace_id", workspaceId)
        .maybeSingle();
      if (membershipError) {
        console.error(membershipError);
        continue;
      }
      if (membership?.role !== "admin") {
        if (event.replyToken) {
          await line.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: "text",
                text: "Only workspace admins can connect this workspace.",
              },
            ],
          });
        }
        continue;
      }

      const workspace = await connectWorkspaceWithGroup(workspaceId, groupId);
      if (workspace && event.replyToken) {
        await line.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `Workspace connected. Continue here:\n${env.NEXT_PUBLIC_APP_URL}/workspace/${workspace.id}`,
            },
          ],
        });
        continue;
      }

      if (event.replyToken) {
        await line.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: "This workspace is not pending or is already connected.",
            },
          ],
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
