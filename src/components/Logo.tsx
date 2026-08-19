import Image from "next/image";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <Image
          src="/logo.png"
          alt="AlBarkah Invest"
          fill
          className="object-contain"
          priority
          sizes="32px"
        />
      </div>
      <span className={`text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-[#0a2e1c]"}`}>
        AlBarkah <span className="text-[#ffd700]">Invest</span>
      </span>
    </div>
  );
}