import { whatsappUrl } from "../lib/config";

export default function WhatsAppBar() {
  const url = whatsappUrl("Hola, quiero cotizar un servicio para mi auto");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] bg-gradient-to-t from-white via-white/95 to-transparent">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="max-w-xl mx-auto flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-full shadow-lg hover:bg-green-600 transition"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.86-1.24-4.72-4.13-4.87-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.24.66-.15.27.1 1.71.81 2 .96.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
        </svg>
        Escríbenos ahora
      </a>
    </div>
  );
}
