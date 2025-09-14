import { NextResponse } from "next/server";

const INTENTS = [
  { key: "SCHED", words: ["agendar", "remarcar", "cancelar", "horário"] },
  { key: "PROOF", words: ["comprovar", "comprovação", "relatar horas", "enviar foto", "protocolo"] },
  { key: "FAQ",   words: ["dúvida", "regra", "prazo", "falta", "orientação", "informação"] },
  { key: "HUMAN", words: ["humano", "atendente", "pessoa", "falar com alguém"] },
];

function routeIntent(text: string) {
  const lower = (text || "").toLowerCase();
  for (const intent of INTENTS) {
    if (intent.words.some(w => lower.includes(w))) return intent.key;
  }
  return "FAQ";
}

export async function POST(req: Request) {
  const { message } = await req.json();
  const intent = routeIntent(message);

  const replies: Record<string, string> = {
    SCHED: "Para AGENDAR/REAGENDAR: informe dia(s) e horários preferidos. Posso gerar um protocolo de solicitação e enviar confirmação por e-mail/WhatsApp.",
    PROOF: "Para COMPROVAR CUMPRIMENTO: descreva a atividade (data, local, horas) e, se tiver, anexe foto/declaração. Eu gero um protocolo.",
    FAQ:   "Posso ajudar com dúvidas sobre regras, prazos e faltas justificadas. Se preferir, peço um(a) atendente humano(a).",
    HUMAN: "Encaminhando para atendimento humano. Horário padrão: seg-sex, 9h-17h. Também posso registrar um pedido de retorno.",
  };

  return NextResponse.json({ reply: replies[intent] || replies.FAQ, routing: { intent, confidence: 0.65 } });
}
