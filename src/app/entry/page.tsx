import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import NewcheLogo from "@/ui/newche-logo"; 
import SelectMember from "@/components/select-member";
import { members } from "@/lib/data";
import { revalidatePath } from "next/cache";

export default async function Entry() {
  const cookieStore = cookies();
  if (cookieStore.has("id")) {
    revalidatePath(`/${cookieStore.get("id")?.value}`);
    redirect(`/${cookieStore.get("id")?.value}`);
  } else {
    const names = await members();
    return (
      <main>
        <NewcheLogo />
        <SelectMember names={ names } />
        <p className="text-gray-400 text-center text-sm">
          名前がない場合は
          <Link href="/registration" className="underline text-teal-500">こちら</Link>
          から登録
        </p>
      </main>
    );
  }
}
