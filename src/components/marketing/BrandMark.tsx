import { useState } from "react";
import { brand } from "@/config/brand";

type BrandMarkVariant = "horizontal" | "icon" | "responsive";

/** Official artwork when the file exists; the approved wordmark as text otherwise. */
export default function BrandMark({
  className = "h-12",
  variant = "responsive",
}: {
  className?: string;
  variant?: BrandMarkVariant;
}) {
  const [failed, setFailed] = useState(false);
  const alt = `${brand.ar} ${brand.en}`;
  if (failed) {
    return (
      <span className={`inline-flex flex-col leading-none ${className}`}>
        <span className="text-xl font-extrabold text-manjoor-walnut">{brand.ar}</span>
        <span className="mt-1 text-[10px] tracking-[0.28em] text-manjoor-brass">{brand.en}</span>
      </span>
    );
  }
  if (variant === "icon") {
    return (
      <img src={brand.logo.icon} alt={alt} className={`${className} w-auto object-contain`} onError={() => setFailed(true)} />
    );
  }
  if (variant === "horizontal") {
    return (
      <img src={brand.logo.horizontal} alt={alt} className={`${className} w-auto object-contain`} onError={() => setFailed(true)} />
    );
  }
  return (
    <>
      <img src={brand.logo.icon} alt="" className="h-10 w-10 object-contain sm:hidden" onError={() => setFailed(true)} />
      <img
        src={brand.logo.horizontal}
        alt={alt}
        className="hidden h-14 w-auto max-w-[min(100%,20rem)] object-contain sm:block md:h-[4.5rem]"
        onError={() => setFailed(true)}
      />
    </>
  );
}
