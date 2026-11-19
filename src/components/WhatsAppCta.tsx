import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, type WhatsAppContext } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Props extends WhatsAppContext {
  className?: string;
  label?: string;
  variant?: "solid" | "outline";
}

/**
 * Context-aware WhatsApp call-to-action. Renders disabled guidance when no
 * approved business number is configured (never invents one). A click is an
 * intent signal, tracked as `whatsapp_click` — NOT a confirmed lead.
 */
export default function WhatsAppCta({ className, label = "تواصل عبر واتساب", variant = "solid", topic, productName, productRef, quantity }: Props) {
  const url = buildWhatsAppUrl({ topic, productName, productRef, quantity });

  if (!url) {
    return (
      <span className={cn("inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-muted-foreground border border-dashed border-border", className)} title="رقم واتساب الرسمي لم يُضف بعد">
        <MessageCircle size={18} /> واتساب (قيد التهيئة)
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("whatsapp_click", { topic: topic ?? "general" })}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold transition-transform hover:scale-[1.03]",
        variant === "solid" ? "bg-[#25D366] text-white shadow-lg" : "border border-[#25D366] text-[#128C7E]",
        className,
      )}
    >
      <MessageCircle size={18} /> {label}
    </a>
  );
}
