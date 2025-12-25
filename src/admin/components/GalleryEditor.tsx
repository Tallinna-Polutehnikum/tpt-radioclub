import React, { useState } from "react";

type ImageItem = { id: string; title: string; url?: string };

const mock: ImageItem[] = [
    { id: "1", title: "Workshop antenna", url: "" },
    { id: "2", title: "Club meeting", url: "" },
];

const GalleryEditor: React.FC = () => {
    const [items, setItems] = useState<ImageItem[]>(mock);

    const add = () => {
        const it: ImageItem = { id: Date.now().toString(), title: "New image" };
        setItems((s) => [it, ...s]);
        console.log("Add image (placeholder):", it);
    };

    const remove = (id: string) => {
        setItems((s) => s.filter((x) => x.id !== id));
        console.log("Remove image (placeholder):", id);
    };

    return (
        <div>
            <h3 className="page-title">Edit Gallery</h3>
            <div style={{ marginBottom: 12 }}>
                <button className="cta" onClick={add}>Add image</button>
            </div>

            <div className="gallery-grid">
                {items.map((it) => (
                    <div key={it.id} className="gallery-item" style={{ padding: 12 }}>
                        <div style={{ height: 140, background: "#fffaf3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="muted">{it.title}</span>
                        </div>
                        <div style={{ padding: 10 }}>
                            <button className="cta-outline" onClick={() => remove(it.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryEditor;