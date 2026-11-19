import { useState } from "react";
import { brand } from "@/config/brand";

/** Official artwork when the file exists; the approved wordmark as text otherwise. */
export default function BrandMark({ className = "h-12" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={`inline-flex flex-col leading-none ${className}`}>
        <span className="text-xl font-extrabold text-manjoor-walnut">{brand.ar}</span>
        <span className="mt-1 text-[10px] tracking-[0.28em] text-manjoor-brass">{brand.en}</span>
      </span>
    );
  }
  return (
    <img
      src={brand.logo.horizontal}
      alt={`${brand.ar} ${brand.en}`}
      className={`${className} w-auto object-contain`}
      onError={() => setFailed(true)}
    />
  );
}
