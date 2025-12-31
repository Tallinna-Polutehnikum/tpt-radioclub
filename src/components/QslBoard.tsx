import React, { useState, useEffect } from "react";
import { createQslMessage, getAllQslMessages } from "../database/qslBoard";

export interface QslMessage {
    id: number;
    callsign: string;
    message: string;
    created_at: Date
}
const QslBoard: React.FC = () => {
  const [messages, setMessages] = useState<QslMessage[]>([]);
  const [form, setForm] = useState({ callsign: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => { 
            const allMessages = await getAllQslMessages();
            setMessages(allMessages); 
        };
        
        fetchMessages();
    }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;
        setLoading(true);

        await createQslMessage({ callsign: form.callsign.trim(), message: form.message.trim() });

        try {
            setForm({ callsign: "", message: "" });
            setSubmitted(true); 
            setTimeout(() => setSubmitted(false), 3000);
            const allMessages = await getAllQslMessages();
            if (allMessages) setMessages(allMessages);
        } catch (error) {
            console.log(error);
            return;
        }

        setLoading(false);
    };

    return (
    <div className="page">
      <h1 className="page-title">QSL Board</h1>
      <p>Leave a message for our radio club members!</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600, marginBottom: 32 }}>
        <input
          className="admin-input"
          placeholder="Callsign"
          value={form.callsign}
          onChange={(e) => setForm({ ...form, callsign: e.target.value })}
          style={{marginBottom: 10}}
          required
        />
        <textarea
          className="admin-input"
          placeholder="Your message..."
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          style={{marginBottom: 10}}
        />
        <button className="cta" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send message"}
        </button>
        {submitted && <div style={{ color: "green", marginTop: 8 }}>✓ Message sent!</div>}
      </form>

      <div style={{ display: "grid", gap: 12 }} className="callbook-table-wrapper">
        {!messages.length && (<>It's empty here yet...</>)}
        {messages.map((msg) => (
          <div key={msg.id} style={{ padding: 16, background: "var(--panel)", borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "var(--accent)" }}>{msg.callsign}</span>
            </div>
            <p style={{ margin: "8px 0", lineHeight: 1.5 }}>{msg.message}</p>
            <small style={{ color: "var(--muted)" }}>
              {new Date(msg.created_at).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QslBoard;