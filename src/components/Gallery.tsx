import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageForFolder, getImagesByFolderId, type ImageMeta } from "../database/images";
import { getAllFolders } from "../database/folders";
import { useNavigate } from "react-router-dom";

interface FolderDescription {
    folderId: number;
    description: string;
    image: ImageMeta;
}

const Gallery: React.FC = () => {
    const [selected, setSelected] = useState<ImageMeta | null>(null);
    const [galleryItems, setGalleryItems] = useState<ImageMeta[] | []>([]);
    const [folders, setFolders] = useState<FolderDescription[]>([]);

    const navigate = useNavigate();

    const initGallery = async () => {
        const folders = await getAllFolders();
        const defaultFolderId = folders.length ? folders[0].id : null;
        const images = await getImagesByFolderId(defaultFolderId || 0);

        const foldersExceptDefault = folders.slice(1);
        const folderImages = await Promise.all(foldersExceptDefault.map(async (f) => {
            const img = await getImageForFolder(f.id);
            return {
                folderId: f.id,
                description: f.name,
                image: img
            } as FolderDescription;
        }));

        setFolders(folderImages);
        setGalleryItems(images);
    }

    useEffect(() => {
        initGallery();
    }, []);

    const openFolder = async (folder: FolderDescription) => {
        navigate(`/gallery/${folder.folderId}`)
    }

    return (
        <section className="page gallery">
            <h2>Photo Gallery</h2>
            <p className="muted">Moments from TPT Radio Club activities and events</p>

            <div className="gallery-grid">
                {galleryItems.map((item) => (
                    <motion.div
                        key={item.id}
                        className="gallery-item"
                        layoutId={`img-${item.id}`}
                        onClick={() => setSelected(item)}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <img src={item.url} alt={item.filename} loading="lazy" />
                    </motion.div>
                ))}
                {folders.map((item) => {
                    if (!item.image) {
                        return;
                    }

                    return <motion.div
                        key={item.folderId}
                        className="gallery-item"
                        layoutId={`img-${item.folderId}`}
                        onClick={() => { openFolder(item); }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <img src={item.image.url} alt={item.description} loading="lazy" />
                        <div className="gallery-caption">
                            <h4>{item.description}</h4>
                        </div>
                    </motion.div>
                })}
            </div>
            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="lightbox-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            className="lightbox-content"
                            layoutId={`img-${selected.id}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 250 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={selected.url} alt={selected.filename} />
                            <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
