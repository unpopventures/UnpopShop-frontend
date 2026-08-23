import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Card, LoadingBlock, EmptyState } from "../ui/Primitives";
import { api } from "../../api/client";

export default function MessagesPanel() {
  const [threads, setThreads] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.threads().then((res) => {
      setThreads(res.data.threads);
      if (res.data.threads[0]) setActive(res.data.threads[0]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!active) return;
    api.thread(active.counterpart.id, active.rfq?.id).then((res) => setMessages(res.data.messages));
  }, [active]);

  async function send() {
    if (!draft.trim() || !active) return;
    await api.sendMessage({ receiverId: active.counterpart.id, body: draft, rfqId: active.rfq?.id });
    setDraft("");
    const res = await api.thread(active.counterpart.id, active.rfq?.id);
    setMessages(res.data.messages);
  }

  if (loading) return <LoadingBlock />;
  if (threads.length === 0) {
    return <EmptyState title="No conversations yet" description="Messages tied to an RFQ or enquiry will show up here." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="p-2 lg:col-span-1">
        {threads.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(t)}
            className={`flex w-full items-center gap-3 rounded-lg p-3 text-left ${active === t ? "bg-cream-100" : "hover:bg-cream-50"}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-500 text-xs font-semibold text-cream-50">
              {t.counterpart.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-forest-700">{t.counterpart.name}</p>
              <p className="truncate text-xs text-forest-400">{t.rfq ? t.rfq.productName : t.lastMessage}</p>
            </div>
            {t.unread > 0 && <span className="h-2 w-2 rounded-full bg-gold-500" />}
          </button>
        ))}
      </Card>

      <Card className="flex flex-col p-4 lg:col-span-2">
        {active ? (
          <>
            <div className="mb-3 border-b border-forest-100 pb-3">
              <p className="font-display text-sm font-semibold text-forest-700">{active.counterpart.name}</p>
              {active.rfq && <p className="text-xs text-forest-400">Re: {active.rfq.productName}</p>}
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto py-2" style={{ maxHeight: 360 }}>
              {messages.map((m) => (
                <div key={m.id} className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${m.senderId === active.counterpart.id ? "bg-cream-100 text-forest-700" : "ml-auto bg-forest-500 text-cream-50"}`}>
                  {m.body}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message…"
                className="input"
              />
              <button onClick={send} className="btn-primary shrink-0">
                <Send size={15} />
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-forest-400">Select a conversation.</p>
        )}
      </Card>
    </div>
  );
}
