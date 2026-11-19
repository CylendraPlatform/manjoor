import { MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store";

const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${storeConfig.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 md:bottom-6 left-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle size={28} />
    </a>
  );
};


export default WhatsAppButton;
