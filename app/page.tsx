import Tutorial from "@/components/Tutorial";
import { orbitron } from "@/lib/fonts";
import { cookies } from "next/headers";

export default async function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className={`${orbitron.className} text-teal-300 text-5xl`}>Newche</span>
    </div>
  );
}
