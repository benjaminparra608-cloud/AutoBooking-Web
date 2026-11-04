'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const QUICK_PROMPTS = [
  {
    id: 'p-bateria',
    label: '🔋 No enciende / suena "clic-clic"',
    text: 'Doy contacto y el auto no enciende, solo suena un clic repetitivo y parpadean las luces del tablero.',
  },
  {
    id: 'p-temperatura',
    label: '🌡️ Subió la temperatura / sale vapor',
    text: 'La aguja de temperatura subió al máximo y sale vapor blanco desde el capó.',
  },
  {
    id: 'p-subterraneo',
    label: '🅿️ Atrapado en subterráneo / caja trabada',
    text: 'Mi auto quedó detenido en el estacionamiento subterráneo -2 y la caja automática no sale de Parking.',
  },
  {
    id: 'p-frenos',
    label: '🛑 Chillido metálico al frenar',
    text: 'Al pisar el freno escucho un chillido metálico agudo y el pedal se siente más largo.',
  },
  {
    id: 'p-check',
    label: '⚠️ Luz Check Engine encendida',
    text: 'Se encendió el testigo amarillo de Check Engine en el tablero y el motor tironea en ralentí.',
  },
  {
    id: 'p-neumatico',
    label: '🛞 Neumático pinchado en ruta',
    text: 'Pinché un neumático en ruta y no tengo gata o los pernos de seguridad están muy apretados.',
  },
];

function analyzeUserMessage(rawText) {
  const t = (rawText || '').toLowerCase();

  if (
    t.includes('temperatura') ||
    t.includes('humo') ||
    t.includes('vapor') ||
    t.includes('calent') ||
    t.includes('radiador') ||
    t.includes('refrigerante')
  ) {
    return {
      urgency: 'CRÍTICA · DETENER MOTOR DE INMEDIATO',
      urgencyColor: 'rose',
      diagnosis:
        'Sobrecalentamiento térmico del motor (posible falla de termostato, electroventilador, bomba de agua o rotura de manguera).',
      safetyTip:
        'Apaga el motor inmediatamente. NO abras la tapa del radiador ni del depósito de expansión: el circuito está presurizado a más de 100°C y puede causar quemaduras severas.',
      recommendedTitle: 'Grúa Hidráulica Cama Plana 24/7',
      price: 'Desde $54.990',
      eta: '45–60 min',
      ctaLabel: 'Pedir Grúa Hidráulica Ahora',
      ctaHref: '/emergencia?service=grua-hidraulica',
    };
  }

  if (
    t.includes('subterraneo') ||
    t.includes('subterráneo') ||
    t.includes('parking') ||
    t.includes('trabada') ||
    t.includes('bloquead') ||
    t.includes('4x4') ||
    t.includes('awd')
  ) {
    return {
      urgency: 'RESCATE TÉCNICO ESPECIALIZADO',
      urgencyColor: 'rose',
      diagnosis:
        'Vehículo inmovilizado en espacio confinado de baja altura o con transmisión automática/AWD bloqueada.',
      safetyTip:
        'No intentes remolcar con eslinga un vehículo automático o AWD con las ruedas apoyadas en el suelo, ya que dañarás gravemente la caja de transmisión.',
      recommendedTitle: 'Grúa de Levante Wheel-Lift + Dollies',
      price: 'Desde $84.990',
      eta: '45–60 min',
      ctaLabel: 'Solicitar Grúa para Subterráneo',
      ctaHref: '/emergencia?service=grua-levante',
    };
  }

  if (
    t.includes('bateria') ||
    t.includes('batería') ||
    t.includes('clic') ||
    t.includes('no parte') ||
    t.includes('no enciende') ||
    t.includes('arranca') ||
    t.includes('alternador')
  ) {
    return {
      urgency: 'ALTA · ASISTENCIA EN RUTA 30 MIN',
      urgencyColor: 'amber',
      diagnosis:
        'Caída de tensión bajo 11.5V en batería de arranque o consumo parasitario / falla de alternador.',
      safetyTip:
        'Apaga luces, aire acondicionado y radio. No hagas puente con cables domésticos desde otro auto moderno sin protección de picos, puedes dañar la ECU.',
      recommendedTitle: 'Auxilio de Batería (Puente Booster o Reemplazo In Situ)',
      price: 'Desde $24.990',
      eta: '30–45 min',
      ctaLabel: 'Pedir Auxilio de Batería',
      ctaHref: '/emergencia?service=bateria-sos',
    };
  }

  if (
    t.includes('neumatico') ||
    t.includes('neumático') ||
    t.includes('pinch') ||
    t.includes('rueda') ||
    t.includes('llanta') ||
    t.includes('vulca')
  ) {
    return {
      urgency: 'ALTA · NO RODAR DESINFLADO',
      urgencyColor: 'amber',
      diagnosis: 'Pérdida de presión en neumático por punción en banda de rodado o válvula dañada.',
      safetyTip:
        'Estaciona en superficie plana con freno de mano activado. Rodar con 0 PSI destruye el talón interno del neumático en pocos metros.',
      recommendedTitle: 'Neumáticos y Vulcanización Móvil 24/7',
      price: 'Desde $24.990',
      eta: '30–45 min',
      ctaLabel: 'Solicitar Vulcanización Móvil',
      ctaHref: '/emergencia?service=neumaticos-sos',
    };
  }

  if (
    t.includes('llave') ||
    t.includes('cerr') ||
    t.includes('adentro') ||
    t.includes('puerta') ||
    t.includes('maletero')
  ) {
    return {
      urgency: 'ASISTENCIA RÁPIDA EN TERRENO',
      urgencyColor: 'amber',
      diagnosis: 'Bloqueo accidental de cierre centralizado con llaves en el interior.',
      safetyTip:
        'No introduzcas objetos metálicos por el marco del vidrio: puedes quebrar el cristal o rasgar los burletes insonorizantes.',
      recommendedTitle: 'Apertura Técnica de Vehículo Sin Daño',
      price: 'Desde $24.990',
      eta: '30–45 min',
      ctaLabel: 'Solicitar Apertura de Vehículo',
      ctaHref: '/emergencia?service=cerrajeria-sos',
    };
  }

  if (
    t.includes('freno') ||
    t.includes('chillid') ||
    t.includes('pastilla') ||
    t.includes('disco') ||
    t.includes('pedal')
  ) {
    return {
      urgency: 'PRIORIDAD MECÁNICA · AGENDAR EN DOMICILIO',
      urgencyColor: 'blue',
      diagnosis:
        'Desgaste de material de fricción en pastillas de freno (sensor acústico rozando el disco) o fatiga de líquido DOT4.',
      safetyTip:
        'Aumenta la distancia de frenado y evita descensos pronunciados hasta reemplazar las pastillas para no rayar los discos.',
      recommendedTitle: 'Servicio de Frenos Cerámicos a Domicilio',
      price: 'Desde $45.000',
      eta: '60–80 min en tu casa u oficina',
      ctaLabel: 'Agendar Cambio de Frenos',
      ctaHref: '/#agendar',
    };
  }

  return {
    urgency: 'DIAGNÓSTICO COMPUTARIZADO RECOMENDADO',
    urgencyColor: 'blue',
    diagnosis:
      'Anomalía electrónica o mecánica registrada en módulos de control (ECU / TCM / ABS). Requiere lectura de códigos DTC en vivo.',
    safetyTip:
      'Si el testigo Check Engine parpadea de forma intermitente, reduce las RPM del motor (indica falla de encendido o misfire que puede dañar el catalizador).',
    recommendedTitle: 'Escáner Automotriz Computarizado OBD2 a Domicilio',
    price: '$25.000',
    eta: '30–40 min',
    ctaLabel: 'Agendar Escáner OBD2 o Diagnóstico',
    ctaHref: '/diagnostico',
  };
}

export default function AutoBotAssistant({ defaultOpen = false, embedded = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: '¡Hola! Soy AutoAI, tu ingeniero mecánico virtual 24/7. Cuéntame qué ruido, testigo o síntoma tiene tu auto y te diré exactamente qué hacer y cuánto cuesta resolverlo.',
      analysis: null,
    },
  ]);

  function handleSendText(customText = null) {
    const textToSend = (customText ?? input).trim();
    if (!textToSend) return;

    const userMsg = {
      id: 'u-' + Date.now(),
      role: 'user',
      text: textToSend,
    };

    const result = analyzeUserMessage(textToSend);
    const botMsg = {
      id: 'b-' + (Date.now() + 1),
      role: 'assistant',
      text: `He analizado tu caso: "${textToSend}". Aquí tienes el dictamen técnico de AutoAI y la solución recomendada:`,
      analysis: result,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (!customText) setInput('');
  }

  const chatPanel = (
    <div className="bg-[#0d1117] border border-white/[0.12] rounded-3xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.85)] flex flex-col max-h-[600px]">
      {/* Header del Chat */}
      <div className="bg-gradient-to-r from-blue-950/80 via-[#101726] to-[#0d1117] border-b border-white/[0.08] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black text-xs">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-sm font-black text-white">AutoAI · Ingeniero Virtual</strong>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[11px] text-white/50">
              Diagnóstico instantáneo para emergencias SOS y mantenciones
            </span>
          </div>
        </div>
        {!embedded && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/70 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Historial de conversación */}
      <div className="p-5 overflow-y-auto space-y-4 flex-1 max-h-[370px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-br-sm'
                  : 'bg-white/[0.04] border border-white/[0.08] text-white/85 rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>

            {m.analysis && (
              <div className="mt-2.5 w-full bg-[#080a0d] border border-white/[0.1] rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.analysis.urgencyColor === 'rose'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : m.analysis.urgencyColor === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {m.analysis.urgency}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    ⏱ {m.analysis.eta}
                  </span>
                </div>

                <div className="text-xs text-white font-semibold">{m.analysis.diagnosis}</div>
                <div className="text-[11px] text-white/60 bg-white/[0.02] border border-white/[0.06] rounded-xl p-2.5">
                  <strong className="text-white/85">Protocolo de seguridad:</strong>{' '}
                  {m.analysis.safetyTip}
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="text-[10px] text-white/45 block">Solución recomendada:</span>
                    <strong className="text-xs font-bold text-white">
                      {m.analysis.recommendedTitle} ({m.analysis.price})
                    </strong>
                  </div>
                  <Link
                    href={m.analysis.ctaHref}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white text-center shrink-0 ${
                      m.analysis.urgencyColor === 'rose'
                        ? 'bg-rose-600 hover:bg-rose-500'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    {m.analysis.ctaLabel} →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chips de síntomas rápidos */}
      <div className="px-4 py-2.5 bg-black/40 border-t border-white/[0.06]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">
          Toca un síntoma rápido:
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.id}
              type="button"
              onClick={() => handleSendText(qp.text)}
              className="px-2.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-blue-600/20 border border-white/[0.08] hover:border-blue-500/40 text-[11px] text-white/75 hover:text-white whitespace-nowrap shrink-0 cursor-pointer transition-all"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input de texto libre */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendText();
        }}
        className="p-3 bg-[#080a0d] border-t border-white/[0.08] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregúntale a AutoAI qué le pasa a tu auto..."
          className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shrink-0"
        >
          Diagnosticar
        </button>
      </form>
    </div>
  );

  if (embedded) {
    return chatPanel;
  }

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-50 w-[92vw] max-w-md">
          {chatPanel}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-40 bg-[#0d1117]/95 hover:bg-[#131b29] text-white border border-blue-500/40 px-4 py-2.5 rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.35)] flex items-center gap-2.5 text-xs font-bold cursor-pointer transition-transform hover:scale-105"
        >
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
            AI
          </span>
          <span>¿Dudas con tu falla? Habla con AutoAI</span>
        </button>
      )}
    </>
  );
}
