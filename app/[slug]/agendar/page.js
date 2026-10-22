"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import BookingWizard from "../../components/BookingWizard";
import { getTallerBySlug } from "../../lib/supabase";
import { whatsappUrl } from "../../lib/config";

export default function TallerAgendarPage() {
  const params = useParams();
  const slug = params?.slug || "";
  const [taller, setTaller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTaller() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getTallerBySlug(slug);
        setTaller(data);
      } catch (err) {
        console.error("Error cargando taller:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTaller();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080a0d] text-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-white/60 text-sm tracking-wide">Cargando portal de agendamiento...</p>
      </div>
    );
  }

  const nombreTaller = taller?.nombre || "Taller Mecánico Asociado";
  const comunaTaller = taller?.comuna || "Santiago";
  const direccionTaller = taller?.direccion || "";
  const telefonoTaller = taller?.telefono || "+56982674570";

  return (
    <div className="min-h-screen bg-[#080a0d] text-white flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-24 pt-6">
        {/* Banner de Taller Personalizado */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0d121c] via-[#090d14] to-[#07090e] p-6 sm:p-8 shadow-2xl">
            {/* Glow decorativo */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center font-bold text-xl text-white shadow-lg border border-white/10 shrink-0">
                  {nombreTaller.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Taller Verificado AutoBooking
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.05] text-white/60 border border-white/[0.06]">
                      {comunaTaller}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-1">
                    {nombreTaller}
                  </h1>
                  {direccionTaller && (
                    <p className="text-white/50 text-xs sm:text-sm flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {direccionTaller}
                    </p>
                  )}
                </div>
              </div>

              {/* Botón WhatsApp directo al taller */}
              <a
                href={whatsappUrl(`Hola ${nombreTaller}, deseo hacer una consulta antes de agendar.`, telefonoTaller)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-white transition-all hover:scale-[1.02]"
              >
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                </svg>
                WhatsApp Taller
              </a>
            </div>

            {/* Micro garantías de agendamiento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/[0.06] text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Confirmación Inmediata</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Repuestos Garantizados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Historial Técnico Digital</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Mecánicos Certificados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard de Agendamiento vinculado al taller */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <BookingWizard
            preselectedTallerId={taller?.id}
            tallerPhone={telefonoTaller}
            tallerNombre={nombreTaller}
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
