export default async function LineGroupPage(props: {
  params: Promise<{ group_id: string }>;
}) {
  const { group_id } = await props.params;
  return <div>Line Group: {group_id}</div>;
}
