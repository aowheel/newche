import { createClient } from "@/lib/supabase/server";

export default async function WorkspaceContentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <div>Workspace Page {id}</div>;
}
