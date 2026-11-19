import { useEffect } from "react";
import { X } from "lucide-react";

export default function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!src) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={alt}>
      <button type="button" className="absolute top-4 left-4 p-3 text-white" onClick={onClose} aria-label="إغلاق">
        <X />
      </button>
      <img src={src} alt={alt} className="max-h-[85vh] max-w-full object-contain" />
    </div>
  );
}
