import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import "../../styles/admin.css";

type Article = { id: string; title: string; excerpt: string; body?: string };

const mock: Article[] = [
    {
        id: "1",
        title: "Antenna Building Workshop",
        excerpt: "Build a simple dipole...",
        body: "<p>Join our hands-on antenna building workshop. We'll cover materials, tools and tuning.</p>",
    },
    {
        id: "2",
        title: "Morse Code Night",
        excerpt: "Learn Morse basics...",
        body: "<p>Practice sending and receiving Morse in a friendly environment. Beginners welcome.</p>",
    },
];

const ToolbarButton: React.FC<{ onClick: () => void; active?: boolean; title?: string }> = ({ onClick, children, active, title }) => (
  <button
    type="button"
    className={`cta-outline ${active ? "active" : ""}`}
    onClick={onClick}
    aria-pressed={!!active}
    title={title}
    style={{ marginRight: 6 }}
  >
    {children}
  </button>
);

const ActivitiesEditor: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>(mock);
    const [editing, setEditing] = useState<Article | null>(null);

    // Create editor once; do NOT pass editing as dependency to avoid recreation and focus loss
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: true, autolink: true }),
            Image,
        ],
        content: "<p></p>",
        // NOTE: no onUpdate — we will read content explicitly on Save to avoid re-renders while typing
    });

    // When editing changes, load its content into the existing editor
    useEffect(() => {
        if (!editor) return;
        const content = editing?.body || "<p></p>";
        editor.commands.setContent(content);
        editor.commands.focus();
    }, [editing, editor]);

    const startEdit = (a: Article) => setEditing({ ...a });
    const saveEdit = (changed: Article) => {
        setArticles((s) => (s.some((x) => x.id === changed.id) ? s.map((x) => (x.id === changed.id ? changed : x)) : [changed, ...s]));
        setEditing(null);
        console.log("Saved article (placeholder):", changed);
    };
    const createNew = () => {
        const newArticle: Article = {
            id: Date.now().toString(),
            title: "New article",
            excerpt: "Excerpt...",
            body: "<p>Start writing here...</p>",
        };
        setArticles((s) => [newArticle, ...s]);
        setEditing(newArticle);
        console.log("Created article (placeholder):", newArticle);
    };
    const remove = (id: string) => {
        setArticles((s) => s.filter((a) => a.id !== id));
        if (editing?.id === id) setEditing(null);
        console.log("Removed article (placeholder):", id);
    };

    const insertImageByUrl = () => {
        const url = window.prompt("Image URL");
        if (url && editor) {
            editor.chain().focus().setImage({ src: url, alt: "Image" }).run();
        }
    };

    return (
        <div>
            <h3 className="page-title">Edit Activities</h3>

            <div style={{ marginBottom: 12 }}>
                <button className="cta" onClick={createNew}>Create new article</button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
                {articles.map((a) => (
                    <div key={a.id} className="activity-card" style={{ padding: 12 }}>
                        <div className="activity-info">
                            <h4>{a.title}</h4>
                            <p className="muted">{a.excerpt}</p>
                            <div style={{ marginTop: 8 }}>
                                <button className="cta-outline" onClick={() => startEdit(a)}>Edit</button>
                                <button className="cta-outline" onClick={() => remove(a.id)} style={{ marginLeft: 8 }}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <div className="page" style={{ marginTop: 16 }}>
                    <h4>Edit: {editing.title}</h4>

                    <label style={{ display: "block", marginTop: 8 }}>Title</label>
                    <input
                        className="admin-input"
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        style={{ marginTop: 6 }}
                    />

                    <label style={{ display: "block", marginTop: 8 }}>Excerpt</label>
                    <input
                        className="admin-input"
                        value={editing.excerpt}
                        onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                        style={{ marginTop: 6 }}
                    />

                    <label style={{ display: "block", marginTop: 12 }}>Body</label>

                    <div style={{ margin: "8px 0", display: "flex", alignItems: "center", gap: 6 }}>
                        <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={!!editor?.isActive("bold")} title="Bold">B</ToolbarButton>
                        <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={!!editor?.isActive("italic")} title="Italic">I</ToolbarButton>
                        <ToolbarButton onClick={() => editor?.chain().focus().toggleStrike().run()} active={!!editor?.isActive("strike")} title="Strike">S</ToolbarButton>
                        <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={!!editor?.isActive("heading", { level: 2 })} title="H2">H2</ToolbarButton>
                        <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={!!editor?.isActive("bulletList")} title="Bullet">•</ToolbarButton>
                        <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={!!editor?.isActive("orderedList")} title="Ordered">1.</ToolbarButton>
                        <ToolbarButton onClick={() => {
                            const url = window.prompt("URL");
                            if (url) editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                        }} title="Link">🔗</ToolbarButton>
                        <ToolbarButton onClick={insertImageByUrl} title="Insert image">🖼️</ToolbarButton>
                        <ToolbarButton onClick={() => editor?.chain().focus().clearNodes().run()} title="Clear">Clear</ToolbarButton>
                    </div>

                    <div className="editor-wrapper" style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: 6, padding: 10, background: "var(--panel)" }}>
                        <EditorContent editor={editor} />
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <button
                            className="cta"
                            onClick={() => {
                                if (!editing) return;
                                const html = editor?.getHTML() || "";
                                saveEdit({ ...editing, body: html });
                            }}
                        >
                            Save (placeholder)
                        </button>
                        <button style={{ marginLeft: 8 }} onClick={() => setEditing(null)} className="cta">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitiesEditor;