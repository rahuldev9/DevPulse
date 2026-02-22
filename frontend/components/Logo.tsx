import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <div onClick={() => router.push("/")} className="cursor-pointer">
      <Image
        src="/DevPluse_logo.webp" // place your logo in /public folder
        alt="DevPulse Logo"
        width={40}
        height={20}
        className="object-contain"
        priority
      />
    </div>
  );
}
