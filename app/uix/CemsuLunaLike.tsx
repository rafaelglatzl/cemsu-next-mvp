'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, ShieldCheck, ExternalLink, Loader2 } from "lucide-react";

export default function CemsuLunaLike() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user"|"assistant"|"system"; content: string; ts: number }>>([
    { role: "system", content: "Bem-vindo(a) à Central de Medidas Socialmente Úteis de Cambará (CEMSU). Posso ajudar com: agendamento, informações sobre medidas, comprovação de horas, orientações e encaminhamentos.", ts: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text, ts: Date.now() }]);
    setBusy(true);
    try {
      const payload = {
        message: text,
        context: { org: "CEMSU Cambará", locale: "pt-BR", hints: ["agendamento", "comprovante", "orientação", "horário", "contato", "encaminhamento", "denúncia", "atendimento presencial"] },
      };
      const res = await fetch("/api/cemsu-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Falha ao obter resposta do assistente.");
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "(Sem resposta)", ts: Date.now() }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: "Desculpe, não consegui responder agora. Tente novamente em instantes ou utilize os canais alternativos: telefone da CEMSU ou atendimento presencial no Fórum.", ts: Date.now() }]);
    } finally {
      setBusy(false);
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
    }
  };

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 100);
  }, [open]);

  const header = useMemo(() => (
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-2xl bg-emerald-600/10 grid place-items-center">
        <MessageCircle className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Assistente Virtual – CEMSU Cambará</h2>
        <p className="text-xs text-gray-500">Canal digital para orientações, triagem e agendamento</p>
      </div>
    </div>
  ), []);

  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 grid place-items-center text-white font-bold">C</div>
          <div>
            <h1 className="text-2xl font-bold">CEMSU Cambará</h1>
            <p className="text-sm text-gray-500">Central de Medidas Socialmente Úteis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="#sobre" className="text-sm underline-offset-2 hover:underline">Sobre</a>
          <a href="#servicos" className="text-sm underline-offset-2 hover:underline">Serviços</a>
          <a href="#contato" className="text-sm underline-offset-2 hover:underline">Contato</a>
          <Button className="ml-3" onClick={() => setOpen(true)}>Abrir Chat</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-start">
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold">Atendimento humanizado, rápido e inclusivo</h2>
          <p className="text-base text-gray-700">
            O portal digital da CEMSU Cambará facilita o acesso a orientações, agendamentos e comprovação de medidas.
            Nossa assistente virtual realiza triagem inicial e encaminha casos ao atendimento humano quando necessário.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShieldCheck className="w-4 h-4" />
            <span>LGPD: minimização de dados, termo de privacidade e criptografia em trânsito.</span>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setOpen(true)}>Começar pelo Chat</Button>
            <a className="inline-flex items-center gap-2 text-emerald-700 underline-offset-2 hover:underline" href="#politica-privacidade">
              Política de Privacidade <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        <section>
          <Card className="rounded-2xl shadow-md border-gray-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Serviços Prioritários</h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                <li className="p-3 rounded-xl bg-white shadow-sm border">Agendar atendimento</li>
                <li className="p-3 rounded-xl bg-white shadow-sm border">Orientações sobre medidas</li>
                <li className="p-3 rounded-xl bg-white shadow-sm border">Comprovação/relatos de cumprimento</li>
                <li className="p-3 rounded-xl bg-white shadow-sm border">Encaminhamentos em rede</li>
              </ul>
              <p className="text-xs text-gray-500">A qualquer momento, você pode pedir para falar com um(a) atendente humano(a).</p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Widget do Chat */}
      <div className="fixed right-6 bottom-6 z-50">
        {!open && (
          <Button size="lg" className="rounded-2xl shadow-xl" onClick={() => setOpen(true)}>
            <MessageCircle className="mr-2 h-5 w-5" /> Falar com a CEMSU
          </Button>
        )}

        {open && (
          <Card className="w-[360px] max-h-[70vh] flex flex-col rounded-2xl shadow-2xl border-emerald-200">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-start justify-between">
                {header}
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fechar">✕</Button>
              </div>
              <div ref={listRef} className="mt-3 flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`${m.role === "user" ? "bg-emerald-600 text-white" : m.role === "system" ? "bg-gray-100" : "bg-white"} rounded-2xl px-3 py-2 shadow border max-w-[80%] text-sm whitespace-pre-wrap`}>{m.content}</div>
                  </div>
                ))}
                {busy && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Aguardando resposta…
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                  placeholder="Digite sua mensagem"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                />
                <Button onClick={send} disabled={busy || input.trim().length === 0}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-[10px] text-gray-500">
                Ao usar o chat você concorda com a <a href="#politica-privacidade" className="underline">Política de Privacidade</a>. Dados são usados para triagem e registro de atendimento, conforme base legal aplicável.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Seções institucionais */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-semibold mb-3">Sobre a CEMSU</h3>
        <p className="text-gray-700 max-w-3xl">
          A Central de Medidas Socialmente Úteis (CEMSU) de Cambará atua na coordenação, acompanhamento e
          registro do cumprimento de medidas alternativas e socialmente úteis, em articulação com o Poder
          Judiciário, Ministério Público, Defesa/Defensoria e Rede de Proteção.
        </p>
      </section>

      <section id="servicos" className="border-t border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white shadow-sm border">
            <h4 className="font-semibold mb-2">Agendamentos</h4>
            <p className="text-sm text-gray-600">Solicite, remarque ou cancele atendimentos. Receba confirmação por e-mail/WhatsApp.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-sm border">
            <h4 className="font-semibold mb-2">Comprovação</h4>
            <p className="text-sm text-gray-600">Envie relatos de cumprimento, fotos/declarações e gere protocolo.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-sm border">
            <h4 className="font-semibold mb-2">Orientações</h4>
            <p className="text-sm text-gray-600">Dúvidas sobre regras, prazos, faltas justificadas e encaminhamentos.</p>
          </div>
        </div>
      </section>

      <section id="contato" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-semibold mb-3">Contato</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-2 text-sm text-gray-700">
              <p><strong>Endereço:</strong> Fórum / Sede CEMSU – Cambará/PR</p>
              <p><strong>Horário:</strong> Seg–Sex, 09:00–17:00</p>
              <p><strong>E-mail:</strong> cemsu@cambara.pr.gov.br (exemplo)</p>
              <p><strong>Telefone/WhatsApp:</strong> (43) 0000-0000 (exemplo)</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-sm">
              <h5 className="font-semibold mb-2">Canais Alternativos</h5>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                <li>Atendimento presencial com senha/prioridades legais</li>
                <li>Encaminhamento para Defensoria/Assistência Social quando necessário</li>
                <li>Acessibilidade: Libras (agendamento), linguagem simples e leitores de tela</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="politica-privacidade" className="">
        <div className="max-w-6xl mx-auto px-4 py-14 space-y-2">
          <h3 className="text-2xl font-semibold">Política de Privacidade (Resumo)</h3>
          <p className="text-sm text-gray-700 max-w-4xl">
            Este serviço trata dados pessoais mínimos necessários para triagem e registro de atendimento, em
            conformidade com a LGPD. Bases legais: cumprimento de obrigação legal/regulatória, execução de
            políticas públicas e exercício regular de direitos. Direitos do titular: confirmação, acesso,
            correção, anonimização, oposição e eliminação nos termos legais. Dados em trânsito são cifrados (TLS)
            e logs de auditoria são mantidos com acesso restrito.
          </p>
        </div>
      </section>

      <footer className="py-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CEMSU Cambará – Central de Medidas Socialmente Úteis. Todos os direitos reservados.
      </footer>
    </div>
  );
}
