'use client';

import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Necesito tener un espacio techado o herramientas para el servicio?",
      answer: "No. Nuestros mecánicos llevan todas las herramientas profesionales, equipos de diagnóstico e insumos necesarios. Solo requerimos un lugar razonablemente seguro y plano donde estacionar el vehículo (estacionamiento de edificio, casa o vía pública autorizada)."
    },
    {
      question: "¿Cuáles son los métodos de pago disponibles?",
      answer: "Puedes pagar de forma segura una vez finalizado y probado el servicio mediante transferencia bancaria, efectivo o tarjetas de débito/crédito según prefieras."
    },
    {
      question: "¿Qué pasa si mi comuna no aparece en la zona de cobertura?",
      answer: "Actualmente cubrimos las principales comunas de Santiago agrupadas en nuestras zonas. Si tu comuna está en el límite o no aparece, escríbenos directamente por WhatsApp y evaluamos la factibilidad de ir a atenderte."
    },
    {
      question: "¿Los repuestos y baterías tienen garantía?",
      answer: "¡Sí! Todas las baterías, repuestos y piezas que instalamos cuentan con su respectiva garantía de fábrica, además de la garantía técnica por la mano de obra realizada por nuestros expertos."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-white mb-3">Preguntas Frecuentes</h3>
        <p className="text-slate-400">Todo lo que necesitas saber sobre nuestro servicio a domicilio.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none"
            >
              <span className="font-semibold text-white text-base md:text-lg">{faq.question}</span>
              <span className={`text-cyan-400 font-bold text-xl transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-6 text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-800/60 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}