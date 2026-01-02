import {
  LINE_SIGNATURE_HTTP_HEADER_NAME,
  messagingApi,
  validateSignature,
} from "@line/bot-sdk";
import { type NextRequest, NextResponse } from "next/server";
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

type LineEvent = {
  type?: string;
  source?: LineSource;
  replyToken?: string;
  joined?: {
    members?: { type?: string; userId?: string }[];
  };
  left?: {
    members?: { type?: string; userId?: string }[];
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

  const upsertLineGroup = async (groupId: string) => {
    await supabaseAdmin
      .from("line_groups")
      .upsert({ id: groupId }, { onConflict: "id" });
  };

  const upsertLineAccount = async (
    userIds: string | string[],
    groupId?: string,
  ) => {
    const accountIds = Array.isArray(userIds) ? userIds : [userIds];
    if (accountIds.length === 0) {
      return;
    }
    const accountsPayload = accountIds.map((accountId) => ({ id: accountId }));
    await supabaseAdmin
      .from("line_accounts")
      .upsert(accountsPayload, { onConflict: "id" });

    if (!groupId) {
      return;
    }

    const accountsGroupsPayload = accountIds.map((accountId) => ({
      account_id: accountId,
      group_id: groupId,
    }));
    await supabaseAdmin
      .from("line_accounts_groups")
      .upsert(accountsGroupsPayload, { onConflict: "account_id,group_id" });
  };

  for (const event of body.events as LineEvent[]) {
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
              text: `Thanks for adding the bot! Please open this link to get started:\n${env.NEXT_PUBLIC_APP_URL}/dashboard/line`,
            },
          ],
        });
      }
      continue;
    }

    if (event.type === "join") {
      const groupId = event.source?.groupId;
      if (groupId) {
        await upsertLineGroup(groupId);
        const memberIds: string[] = [];
        let start: string | undefined;
        do {
          const response = await line.getGroupMembersIds(groupId, start);
          memberIds.push(...response.memberIds);
          start = response.next;
        } while (start);
        await upsertLineAccount(memberIds, groupId);
      }
      if (groupId && event.replyToken) {
        await line.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `Thanks for adding the bot! Please open this link to get started:\n${env.NEXT_PUBLIC_APP_URL}/dashboard/line/${groupId}`,
            },
          ],
        });
      }
      continue;
    }

    if (event.type === "reaction") {
      const userId = event.source?.userId;
      const groupId = event.source?.groupId;
      if (groupId) {
        await upsertLineGroup(groupId);
      }
      if (userId) {
        await upsertLineAccount(userId, groupId);
      }
      continue;
    }

    if (event.type === "memberJoined") {
      const groupId = event.source?.groupId;
      if (groupId) {
        await upsertLineGroup(groupId);
      }
      const joinedMemberIds =
        event.joined?.members
          ?.map((member) => member.userId)
          .filter((memberId): memberId is string => Boolean(memberId)) ?? [];
      await upsertLineAccount(joinedMemberIds, groupId);
      if (groupId && event.replyToken) {
        await line.replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: "text",
              text: `Welcome! Please open this link to get started:\n${env.NEXT_PUBLIC_APP_URL}/dashboard/line/${groupId}`,
            },
          ],
        });
      }
    }

    if (event.type === "memberLeft") {
      const leftMemberIds =
        event.left?.members
          ?.map((member) => member.userId)
          .filter((memberId): memberId is string => Boolean(memberId)) ?? [];
      const groupId = event.source?.groupId;
      if (groupId && leftMemberIds.length > 0) {
        await supabaseAdmin
          .from("line_accounts_groups")
          .delete()
          .eq("group_id", groupId)
          .in("account_id", leftMemberIds);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
