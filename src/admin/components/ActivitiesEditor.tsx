/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import "../../styles/admin.css";
import type { Activity } from "../../components/Activities";
import {
    getAllActivities,
    createActivity,
    updateActivity,
    deleteActivity,
} from "../../database/activities";

const ToolbarButton: React.FC<{
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    active?: boolean;
    title?: string;
    children?: React.ReactNode;
}> = ({ onClick, children, active, title }) => (
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
    const [activities, setActivities] = useState<Activity[]>([]);
    const [editing, setEditing] = useState<Partial<Activity> | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const editor = useEditor({
        extensions: [StarterKit, Link.configure({ openOnClick: true, autolink: true }), Image],
        content: "<p></p>",
    });

    const loadedForIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!editor) return;

        const idKey = editing && (editing as any).id ? String((editing as any).id) : "__new__";

        if (loadedForIdRef.current === idKey) return;

        const content = editing?.content || editing?.content || "<p></p>";
        editor.commands.setContent(content);

        const editorIsFocused = typeof (editor as any).isFocused === "function" ? (editor as any).isFocused() : false;
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const activeIsInput = activeTag === "input" || activeTag === "textarea";

        if (!editorIsFocused && !activeIsInput) {
            try {
                editor.commands.focus();
            } catch {
                // ignore focus errors for safety
            }
        }

        loadedForIdRef.current = idKey;
    }, [editing?.id, editor]);

    // clear marker when editor is closed so next open reloads
    useEffect(() => {
        if (!editing) {
            loadedForIdRef.current = null;
        }
    }, [editing]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllActivities();
                if (mounted) setActivities(data || []);
            } catch (err: any) {
                console.error("Failed to load activities:", err);
                if (mounted) setError("Failed to load activities");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, []);

    const startEdit = (a: Activity) => setEditing({ ...a });

    const createNew = async () => {
        setSaving(true);
        setError(null);

        const payload: Partial<Activity> = {
            title: "New article",
            description: "description...",
            content: "<p>Start writing here...</p>",
        };

        setEditing(payload);
        try {
            const created = await createActivity(payload);
            if (created) {
                setActivities((s) => [created, ...s]);
                setEditing(created);
            } else {
                setError("Create returned empty result");
            }
        } catch (err: any) {
            console.error("Create activity failed:", err);
            setError("Failed to create activity");
        } finally {
            setSaving(false);
        }
    };

    const saveEdit = async (changed: Activity) => {
        console.log("Saving changes:", changed);
        if (!changed || !changed.id) {
            setError("Missing activity id");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const updated = await updateActivity(changed.id as unknown as string, changed);
            if (updated) {
                const data = await getAllActivities();
                setActivities(data);
                setEditing(null);
            } else {
                setError("Update returned empty result");
            }
        } catch (err: any) {
            console.error("Update activity failed:", err);
            setError("Failed to update activity");
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id?: string) => {
        if (!id) return;
        const confirmed = window.confirm("Remove activity?");
        if (!confirmed) return;
        setSaving(true);
        setError(null);
        try {
            const ok = await deleteActivity(id as unknown as string);
            if (ok) {
                setActivities((s) => s.filter((a) => a.id !== id));
                if (editing?.id === id) setEditing(null);
            } else {
                setError("Delete failed");
            }
        } catch (err: any) {
            console.error("Delete activity failed:", err);
            setError("Failed to delete activity");
        } finally {
            setSaving(false);
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            window.alert("Please select an image file");
            e.currentTarget.value = "";
            return;
        }

        const cloudName = 'dsdocdfcx';
        const uploadPreset = 'Default-Unsigned';

        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", uploadPreset);

        setUploadingImage(true);

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: "POST",
            body: form,
        })
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`Upload failed: ${res.status} ${txt}`);
                }
                return res.json();
            })
            .then((json) => {
                console.log("Cloudinary upload JSON:", json);
                const src = json.secure_url || json.url;
                if (!src) throw new Error("No URL returned from Cloudinary");
                if (editor) {
                    setEditing({...editing, image: json.secure_url});
                    window.alert("Image uploaded successfully. It has been added to the activity data.");
                }
            })
            .catch((err) => {
                console.error("Cloudinary upload error:", err);
                window.alert("Image upload failed");
            })
            .finally(() => {
                setUploadingImage(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            });
    };

    return (
        <div>
            <h3 className="page-title">Edit Activities</h3>

            <div style={{ marginBottom: 12 }}>
                <button className="cta" onClick={createNew} disabled={saving}>
                    {saving ? "Creating..." : "Create new article"}
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div style={{ color: "crimson" }}>{error}</div>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {activities.map((a) => (
                        <div key={(a.id || Math.random()) as string} className="activity-card" style={{ padding: 12 }}>
                            <div className="activity-info">
                                <h4>{a.title}</h4>
                                <p className="muted">{a.description}</p>
                                <div style={{ marginTop: 8 }}>
                                    <button className="cta-outline" onClick={() => startEdit(a)}>Edit</button>
                                    <button className="cta-outline" onClick={() => remove(a.id)} style={{ marginLeft: 8 }}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editing && (
                <div className="page" style={{ marginTop: 16 }}>
                    <h4>Edit: {editing.title}</h4>

                    <label style={{ display: "block", marginTop: 8 }}>Title</label>
                    <input
                        className="admin-input"
                        value={editing.title || ""}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        style={{ marginTop: 6 }}
                    />

                    <label style={{ display: "block", marginTop: 8 }}>Description</label>
                    <input
                        className="admin-input"
                        value={editing.description || ""}
                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
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
                        <ToolbarButton onClick={triggerFileSelect} title="Upload image">
                            {uploadingImage ? "Uploading…" : "🖼️"}
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor?.chain().focus().clearNodes().run()} title="Clear">Clear</ToolbarButton>
                    </div>

                    <div className="editor-wrapper" style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: 6, padding: 10, background: "var(--panel)" }}>
                        <EditorContent editor={editor} />
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    <div style={{ marginTop: 12 }}>
                        <button
                            className="cta"
                            onClick={async () => {
                                if (!editing) return;
                                const html = editor?.getHTML() || "";
                                await saveEdit({ ...editing, content: html } as Activity);
                            }}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button style={{ marginLeft: 8 }} onClick={() => setEditing(null)} className="cta">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitiesEditor;