import Tutorial from "@/components/Tutorial";
import { orbitron } from "@/lib/fonts";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const tutorialCompleted = cookieStore.get("tutorial")?.value === "20240823";

  if (!tutorialCompleted) {
    return (
      <div className="pt-16 flex flex-col gap-y-4 items-center">
        <Tutorial />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className={`${orbitron.className} text-teal-300 text-5xl`}>Newche</span>
    </div>
  );
}
