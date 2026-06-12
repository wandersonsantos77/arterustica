import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, generalInquiryMessage } from '../../lib/whatsapp';

export default function WhatsAppButton() {
  return (
    <a
      href={buildWhatsAppUrl(generalInquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 group"
    >
      <MessageCircle size={22} />
      <span className="text-sm hidden sm:inline">WhatsApp</span>
    </a>
  );
}
