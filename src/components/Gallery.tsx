import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import galleryItems from "../assets/gallery.json";

interface GalleryItem {
    id: number;
    src: string;
    title: string;
    desc?: string;
}

const Gallery: React.FC = () => {
    const [selected, setSelected] = useState<GalleryItem | null>(null);

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
                        <img src={item.src} alt={item.title} loading="lazy" />
                        <div className="gallery-caption">
                            <h4>{item.title}</h4>
                        </div>
                    </motion.div>
                ))}
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
                            <img src={selected.src} alt={selected.title} />
                            <div className="lightbox-text">
                                <h3>{selected.title}</h3>
                                {selected.desc && <p>{selected.desc}</p>}
                            </div>
                            <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
