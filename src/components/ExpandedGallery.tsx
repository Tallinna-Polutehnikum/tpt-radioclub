import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getImagesByFolderId, type ImageMeta } from "../database/images";
import { Link, useParams } from "react-router-dom";
import { getFolderById } from "../database/folders";

const ExpandedGallery: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [selected, setSelected] = useState<ImageMeta | null>(null);
    const [galleryItems, setGalleryItems] = useState<ImageMeta[] | []>([]);
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        const initGallery = async () => {
            const folder = await getFolderById(Number(id));
            const images = await getImagesByFolderId(Number(id));
            setGalleryItems(images);
            setTitle(folder?.name ?? "");
        };

        initGallery();
    }, [id]);

    return (
        <section className="page gallery">
            <h2>Photo Gallery</h2>
            <p className="muted">{title}</p>

            <div className="gallery-grid">
                {galleryItems.map((item) => (
                    <motion.div
                        key={item.id}
                        className="gallery-item"
                        layoutId={`img-${item.id}`}
                        onClick={() => setSelected(item)}
                        whileHover={{ scale: 1.03 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                        }}
                    >
                        <img
                            src={item.url}
                            alt={item.filename}
                            loading="lazy"
                        />
                    </motion.div>
                ))}
            </div>
            <div>
                <Link
                    to="/gallery"
                    className="back-link"
                    style={{ paddingTop: 20 }}
                >
                    ← Back to Gallery
                </Link>
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
                            transition={{
                                type: "spring",
                                damping: 20,
                                stiffness: 250,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={selected.url} alt={selected.filename} />
                            <button
                                className="close-btn"
                                onClick={() => setSelected(null)}
                            >
                                ✕
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ExpandedGallery;
