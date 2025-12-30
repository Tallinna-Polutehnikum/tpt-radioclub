import React from "react";
import "../styles/global.css";

const Meetup: React.FC = () => {
    const meetups = [
        {
            id: 1,
            title: "Weekly Club Meeting",
            date: "Every Tuesday",
            time: "18:00 PM - 22:00 PM",
            location: "Tallinna Polütehnikum, Room A414 (4th floor)",
            description:
                "Regular weekly gathering of club members to discuss activities, share experiences, and plan upcoming events.",
            image: "https://vgpfxbuvddogkxhzaeqr.supabase.co/storage/v1/object/public/gallery/tpt_front.png",
        },
        {
            id: 2,
            title: "HF Net",
            date: "Every Saturday",
            time: "9:00 EET",
            location: "3.670 MHz (LSB)",
            description:
                "Coordinated HF operating session where members practice on various bands. Good for beginners and experienced operators.",
            image: "https://vgpfxbuvddogkxhzaeqr.supabase.co/storage/v1/object/public/gallery/ontheair.jpg",
        },
        {
            id: 3,
            title: "ES1ROB VHF Net",
            date: "Every Thursday",
            time: "21:30 EET",
            location: "145.500 MHz (FM)",
            description:
                "Breaking news from around the world, weather reports, broadcast forecasts and more.",
            image: "https://vgpfxbuvddogkxhzaeqr.supabase.co/storage/v1/object/public/gallery/IMG_9971.png",
        },
        {
            id: 4,
            title: "ES1HHR CB Net",
            date: "Every Tuesday",
            time: "20:30 EET",
            location: "27.255 MHz (FM) / CB Channel 23",
            description:
                "Weekly CB net for local operators. Open discussion, signal reports, and friendly on-air communication for everyone.",
            image: "https://vgpfxbuvddogkxhzaeqr.supabase.co/storage/v1/object/public/gallery/image.jpeg",
        },
        {
            id: 5,
            title: "ES1HHR UHF Net",
            date: "Every Wednesday",
            time: "20:30 EET",
            location: " 433.500 MHz (FM)",
            description:
                "Weekly UHF net for amateur radio operators. Equipment checks, signal reports, and general discussion on the 70 cm band.",
            image: "https://vgpfxbuvddogkxhzaeqr.supabase.co/storage/v1/object/public/gallery/older-yagi-antenna-question-v0-44ehnc7tvcxa1.webp",
        },
    ];

    return (
        <div className="page">
            <h1 className="about-header" style={{ marginBottom: 10 }}>
                Club Meetups & Events
            </h1>
            <p style={{ marginBottom: 50 }}>
                Join us for regular meetings, operating sessions, and training
                events. Whether you're a seasoned operator or just starting out,
                there's something for everyone.
            </p>
            <section
                className="meetups-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                    gap: 24,
                    marginBottom: 48,
                }}
            >
                {meetups.map((meetup) => (
                    <div
                        key={meetup.id}
                        className="meetup-card"
                        style={{
                            background: "var(--panel)",
                            borderRadius: 12,
                            overflow: "hidden",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                    >
                        <div
                            style={{
                                height: 200,
                                overflow: "hidden",
                                background: "rgba(0,0,0,0.05)",
                            }}
                        >
                            <img
                                src={meetup.image}
                                alt={meetup.title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>

                        <div style={{ padding: 20 }}>
                            <h3
                                style={{
                                    marginTop: 0,
                                    marginBottom: 8,
                                    fontSize: 18,
                                    fontWeight: 700,
                                }}
                            >
                                {meetup.title}
                            </h3>

                            <div
                                style={{
                                    display: "grid",
                                    gap: 6,
                                    marginBottom: 12,
                                    fontSize: 14,
                                    color: "var(--muted, #666)",
                                }}
                            >
                                <div>
                                    <strong>📅 When:</strong> {meetup.date}
                                </div>
                                <div>
                                    <strong>🕐 Time:</strong> {meetup.time}
                                </div>
                                <div>
                                    <strong>📍 Where:</strong> {meetup.location}
                                </div>
                            </div>

                            <p
                                style={{
                                    margin: "12px 0",
                                    lineHeight: 1.5,
                                    color: "var(--text, #333)",
                                    minHeight: 50,
                                }}
                            >
                                {meetup.description}
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            <section
                style={{
                    maxWidth: 800,
                    marginLeft: "auto",
                    marginRight: "auto",
                    padding: 24,
                    background: "var(--panel)",
                    borderRadius: 12,
                }}
            >
                <h2 style={{ marginTop: 0 }}>Getting Started</h2>
                <p>
                    New to amateur radio or our club? All meetups are open to
                    licensed amateurs and those interested in learning. No
                    experience necessary — we welcome beginners!
                </p>
                <ul style={{ lineHeight: 1.8 }}>
                    <li>Check the calendar for upcoming events</li>
                    <li>Reach out to us on the repeater or via email</li>
                    <li>Bring your radio and antenna (we can help set up)</li>
                    <li>Join our Discord/Telegram for real-time updates</li>
                </ul>

                <div
                    style={{
                        marginTop: 20,
                        padding: 16,
                        background: "rgba(168,59,42,0.08)",
                        borderLeft: "4px solid var(--accent)",
                        borderRadius: 6,
                    }}
                >
                    <strong>📢 Questions?</strong> Contact us at{" "}
                    <a href="mailto:es1mw@erau.ee">es1mw@erau.ee</a> or find us
                    on the air.
                </div>
            </section>
        </div>
    );
};

export default Meetup;
