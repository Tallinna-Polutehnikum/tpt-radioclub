/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { deleteQslMessage, getAllQslMessages } from "../../database/qslBoard";
import type { QslMessage } from "../../components/QslBoard";

const QslBoardEditor: React.FC = () => {
  const [messages, setMessages] = useState<QslMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Load messages
  useEffect(() => {
    loadMessages();
  }, []);

    const loadMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const messages = await getAllQslMessages();
            setMessages(messages || []);
        } catch (err: any) {
            console.error("Failed to load messages:", err);
            setError(err?.message || "Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

  const deleteMessage = async (id: number) => {
    const confirmed = window.confirm("Delete this QSL message?");
    if (!confirmed) return;

    setDeleting(id);
    try {
      await deleteQslMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err: any) {
      console.error("Failed to delete message:", err);
      setError(err?.message || "Failed to delete message");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="page">Loading messages...</div>;
  }

  return (
    <div className="page">
      <h3 className="page-title">QSL Board Management</h3>

      {error && (
        <div style={{ padding: 12, background: "rgba(220, 53, 69, 0.1)", color: "crimson", borderRadius: 6, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <button className="cta-outline" onClick={loadMessages}>
          Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <div style={{ padding: 24, background: "var(--panel)", borderRadius: 8, textAlign: "center", color: "var(--muted)" }}>
          No messages yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: 16,
                background: "var(--panel)",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>{msg.callsign}</span>
                </div>
                <p style={{ margin: "8px 0", lineHeight: 1.5, color: "var(--text)" }}>
                  {msg.message}
                </p>
                <small style={{ color: "var(--muted)" }}>
                  {msg.created_at ? new Date(msg.created_at).toLocaleString() : "—"}
                </small>
              </div>

              <button
                className="cta-outline"
                onClick={() => deleteMessage(msg.id)}
                disabled={deleting === msg.id}
                title="Delete message"
                style={{
                  padding: "8px 12px",
                  whiteSpace: "nowrap",
                  background: deleting === msg.id ? "rgba(220, 53, 69, 0.1)" : undefined,
                }}
              >
                {deleting === msg.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, background: "var(--panel)", borderRadius: 8 }}>
        <strong>Total messages:</strong> {messages.length}
      </div>
    </div>
  );
};

export default QslBoardEditor;