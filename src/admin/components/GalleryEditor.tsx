import React, { useEffect, useRef, useState } from "react";
import { createFolder, deleteFolder, getAllFolders, type Folder } from "../../database/folders";
import { addImageToFolder, deleteImage, deleteImagesByFolderId, getImagesByFolderId, updateImageFolder, type ImageMeta } from "../../database/images";
import { cloudinaryUploadImage } from "../../connection/cloudinary";

const GalleryEditor: React.FC = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [images, setImages] = useState<ImageMeta[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const initDefaultFolderAndImages = async () => {
            try {
                const folders = await getAllFolders();
                const defaultFolderId = folders.length ? folders[0].id : null;
                const images = await getImagesByFolderId(defaultFolderId || 0);

                setFolders(folders);
                setImages(images);
                setSelectedFolder((prev) => (prev ? prev : (folders[0] || { id: "root", name: "Default" })));
                return;
            } catch (err) {
                console.warn("Supabase gallery load failed, falling back to localStorage", err);
                return;
            }
        };
        initDefaultFolderAndImages();
    }, []);

    const createNewFolder = async (name: string) => {
        if (!name.trim()) return;
        try {
            const newFolder = await createFolder(name.trim());
            setFolders((s) => [newFolder, ...s]);
            switchFolder(newFolder);
            return;
        } catch (err) {
            console.warn("Create folder supabase failed:", err);
        }
    };

    const deleteExistingFolder = async (folderId: number | string) => {
        if (!window.confirm("Delete folder and its image metadata?")) return;
        try {
            await deleteImagesByFolderId(folderId);
            await deleteFolder(folderId);
            const f = folders.filter((f) => f.id !== folderId);
            setFolders(f);
            setImages((imgs) => imgs.filter((i) => i.folder_id !== folderId));
            setSelectedFolder(f[0] || null);
            return;
        } catch (err) {
            console.warn("Supabase deleteFolder failed:", err);
        }
    };

    const uploadFiles = async (files: FileList | null) => {
        if (!files || files.length === 0 || !selectedFolder) return;
        const file = files[0];
        if (!file.type.startsWith("image/")) {
            window.alert("Select an image file");
            return;
        }
        setUploading(true);
        try {
            const uploadedImage = await cloudinaryUploadImage(file, selectedFolder.name);
            const meta: Partial<ImageMeta> = {
                url: uploadedImage.url,
                filename: file.name,
                public_id: uploadedImage.public_id,
                folder_id: selectedFolder.id
            };

            await saveImageMeta(meta);
        } catch (err) {
            console.error("Upload error:", err);
            window.alert("Upload failed");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const saveImageMeta = async (meta: Partial<ImageMeta>) => {
        try {
            const data = await addImageToFolder({
                url: meta.url,
                filename: meta.filename,
                public_id: meta.public_id,
                folder_id: meta.folder_id,
            });
            setImages((s) => [data as ImageMeta, ...s]);
            return;
        } catch (err) {
            console.warn("Supabase insert image metadata failed:", err);
        }
    };

    const moveImageToFolder = async (imageId: string | number, destFolderId: number) => {
        try {
            await updateImageFolder(destFolderId, imageId);
            const imagesInFolder = await getImagesByFolderId(selectedFolder!.id);
            setImages(imagesInFolder);
        } catch (err) {
            console.warn("Supabase move image failed:", err);
        }
    };

    const deleteExistingImage = async (image: ImageMeta) => {
        if (!window.confirm("Delete image metadata?")) return;
        try {
            await deleteImage(image.id);
            const imagesInFolder = await getImagesByFolderId(selectedFolder!.id);
            setImages(imagesInFolder);
        } catch (err) {
            console.warn("Supabase delete image failed:", err);
        }
    };

    const switchFolder = async (folder: Folder) => {
        const imagesInFolder = await getImagesByFolderId(folder.id);
        setSelectedFolder(folder);
        setImages(imagesInFolder);
    }

    return (
        <div className="page">
            <h3 className="page-title">Gallery</h3>

            <div style={{ display: "flex", gap: 16 }}>
                <aside style={{ width: 240 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <input className="admin-input" placeholder="New folder" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
                        <button className="cta" onClick={() => { createNewFolder(newFolderName); setNewFolderName(""); }}>Create</button>
                    </div>

                    <div style={{ background: "var(--panel)", padding: 8, borderRadius: 8 }}>
                        {folders.map((f) => (
                            <div key={String(f.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: 6, marginBottom: 6, background: selectedFolder?.id === f.id ? "rgba(168,59,42,0.06)" : "transparent", cursor: "pointer" }}>
                                <div onClick={() => switchFolder(f)} style={{ flex: 1 }}>{f.name}</div>
                                <div>
                                    <button className="cta-outline" onClick={() => deleteExistingFolder(f.id)} title="Delete folder">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div>
                            <strong>{selectedFolder?.name || "—"}</strong>
                            <div style={{ fontSize: 12, color: "var(--muted)" }}>{images.length} images</div>
                        </div>

                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => uploadFiles(e.target.files)} />
                            <button className="cta" onClick={() => fileRef.current?.click()} disabled={!selectedFolder || uploading}>{uploading ? "Uploading…" : "Upload image"}</button>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
                        {images.map((img) => (
                            <div key={String(img.id)} style={{ background: "var(--panel)", padding: 8, borderRadius: 8 }}>
                                <div style={{ height: 140, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                                    <img src={img.url} alt={img.filename} style={{ maxWidth: "100%", maxHeight: "100%", display: "block" }} />
                                </div>
                                <div style={{ fontSize: 12 }}>{img.filename || img.public_id}</div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <select onChange={(e) => moveImageToFolder(img.id, Number(e.target.value))} defaultValue={String(img.folder_id || "")} style={{ maxWidth: 180 }}>
                                            {folders.map((f) => <option key={String(f.id)} value={String(f.id)}>{f.name}</option>)}
                                        </select>
                                        <button className="cta-outline" onClick={() => deleteExistingImage(img)}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {images.length === 0 && <div style={{ gridColumn: "1/-1", color: "var(--muted)", padding: 16 }}>No images in this folder.</div>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GalleryEditor;