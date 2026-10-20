'use client';

import React, { useState } from 'react';

const FAQS = [
  {
    question: '¿Necesito tener un espacio techado o herramientas para el servicio?',
    answer: 'No. Nuestros mecánicos llevan todas las herramientas profesionales, equipos de diagnóstico e insumos necesarios. Solo requerimos un lugar razonablemente seguro y plano donde estacionar el vehículo (estacionamiento de edificio, casa o vía pública autorizada).',
  },
  {
    question: '¿Cuáles son los métodos de pago disponibles?',
    answer: 'Puedes pagar de forma segura una vez finalizado y probado el servicio mediante transferencia bancaria, efectivo o tarjetas de débito/crédito según prefieras.',
  },
  {
    question: '¿Qué pasa si mi comuna no aparece en la zona de cobertura?',
    answer: 'Actualmente cubrimos las principales comunas de Santiago. Si tu comuna está en el límite o no aparece, escríbenos directamente por WhatsApp y evaluamos la factibilidad de ir a atenderte.',
  },
  {
    question: '¿Los repuestos y baterías tienen garantía?',
    answer: '¡Sí! Todas las baterías, repuestos y piezas que instalamos cuentan con su respectiva garantía de fábrica, además de la garantía técnica por la mano de obra realizada por nuestros expertos.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-[#080a0d] border-b border-white/[0.06] py-20 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blue-400/80 mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-sm text-white/35 mt-3 font-light">
            Todo lo que necesitas saber sobre nuestro servicio a domicilio.
          </p>
        </div>

        {/* Acordeón */}
        <div className="space-y-2">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-blue-700/50 bg-blue-950/20'
                    : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-6 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm md:text-base font-medium text-white/80 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'border-blue-500/60 bg-blue-600 text-white rotate-45'
                        : 'border-white/[0.12] text-white/40'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-white/[0.06] pt-4">
                      <p className="text-sm text-white/45 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}