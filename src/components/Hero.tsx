import React from "react";
import Player from "./Player";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section id="home" className="hero">
            <div className="hero-left">
                <div
                    className="radio-card"
                    role="img"
                    aria-label="Shortwave Transceiver"
                >
                    <svg
                        viewBox="0 0 800 450"
                        preserveAspectRatio="xMidYMid meet"
                        className="transceiver-svg"
                    >
                        <defs>
                            <filter id="grain">
                                <feTurbulence
                                    baseFrequency="0.8"
                                    numOctaves="2"
                                    stitchTiles="stitch"
                                />
                                <feColorMatrix type="saturate" values="0" />
                                <feBlend mode="overlay" in2="SourceGraphic" />
                            </filter>
                        </defs>

                        <rect
                            x="30"
                            y="35"
                            rx="30"
                            ry="30"
                            width="740"
                            height="360"
                            fill="#a83b2a"
                            stroke="#4a2f26"
                            strokeWidth="6"
                        />
                        <rect
                            x="60"
                            y="65"
                            rx="18"
                            ry="18"
                            width="680"
                            height="150"
                            fill="#e9d6bf"
                        />

                        <g transform="translate(80,80)">
                            <rect
                                width="420"
                                height="120"
                                rx="8"
                                fill="#d6c1a9"
                            />
                            <g fill="#8b6f5e" opacity="0.9">
                                {Array.from({ length: 11 }).map((_, row) =>
                                    Array.from({ length: 20 }).map((_, col) => (
                                        <circle
                                            key={`${row}-${col}`}
                                            cx={20 + col * 20}
                                            cy={10 + row * 10}
                                            r="2"
                                        />
                                    ))
                                )}
                            </g>
                        </g>

                        <g transform="translate(520,80)">
                            <rect
                                x="-10"
                                y="0"
                                width="220"
                                height="120"
                                rx="10"
                                fill="#e3cdb4"
                                stroke="#4a2f26"
                            />

                            <text x="0" y="25" fontSize="15" fill="#4a2f26">
                                S
                            </text>
                            <text x="20" y="25" fontSize="15" fill="#4a2f26">
                                1
                            </text>
                            <text x="40" y="25" fontSize="15" fill="#4a2f26">
                                3
                            </text>
                            <text x="60" y="25" fontSize="15" fill="#4a2f26">
                                5
                            </text>
                            <text x="80" y="25" fontSize="15" fill="#4a2f26">
                                7
                            </text>
                            <text x="100" y="25" fontSize="15" fill="#4a2f26">
                                9
                            </text>
                            <text x="115" y="25" fontSize="15" fill="#4a2f26">
                                +20
                            </text>
                            <text x="145" y="25" fontSize="15" fill="#4a2f26">
                                +40
                            </text>
                            <text x="175" y="25" fontSize="15" fill="#4a2f26">
                                +60
                            </text>

                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                                const x = 10 + i * 18;
                                return (
                                    <line
                                        key={i}
                                        x1={x}
                                        y1={90}
                                        x2={x}
                                        y2={102}
                                        stroke="#4a2f26"
                                        strokeWidth="2"
                                    />
                                );
                            })}

                            <text x="0" y="84" fontSize="20" fill="#4a2f26">
                                1.8
                            </text>
                            <text x="55" y="84" fontSize="20" fill="#4a2f26">
                                3.5
                            </text>
                            <text x="108" y="84" fontSize="20" fill="#4a2f26">
                                7
                            </text>
                            <text x="140" y="84" fontSize="20" fill="#4a2f26">
                                14
                            </text>
                            <text x="180" y="84" fontSize="20" fill="#4a2f26">
                                21
                            </text>

                            <g transform="translate(120,92)">
                                <rect
                                    x="-32"
                                    y="-36"
                                    width="4"
                                    height="60"
                                    rx="3"
                                    fill="#3b2b24"
                                />
                            </g>
                        </g>

                        <g transform="translate(80,230)">
                            <rect
                                x="-20"
                                y="0"
                                rx="10"
                                width="683"
                                height="150"
                                fill="#d9bfa7"
                                stroke="#4a2f26"
                                strokeWidth="4"
                            />

                            <g transform="translate(20,20)">
                                {[
                                    "AGC",
                                    "NB",
                                    "NR",
                                    "MODE",
                                    "VFO",
                                    "TUNER",
                                ].map((txt, i) => (
                                    <g
                                        key={txt}
                                        transform={`translate(${i * 110},0)`}
                                    >
                                        <rect
                                            x="-20"
                                            y="0"
                                            width="90"
                                            height="46"
                                            rx="6"
                                            fill="#e9d6bf"
                                            stroke="#4a2f26"
                                        />
                                        <text
                                            x="25"
                                            y="30"
                                            textAnchor="middle"
                                            fontSize="18"
                                            fill="#4a2f26"
                                        >
                                            {txt}
                                        </text>
                                    </g>
                                ))}
                            </g>

                            <g transform="translate(360,12)">
                                <rect
                                    x="43"
                                    y="65"
                                    width="240"
                                    height="64"
                                    rx="8"
                                    fill="#2b1e18"
                                />
                                <text
                                    x="165"
                                    y="109"
                                    textAnchor="middle"
                                    fontSize="36"
                                    fontFamily="monospace"
                                    fill="#f3c79b"
                                >
                                    3.670 kHz
                                </text>
                            </g>

                            <g transform="translate(10,86)">
                                <circle cx="35" cy="25" r="32" fill="#4a2f26" />
                                <circle cx="35" cy="25" r="22" fill="#2a1a16" />
                            </g>
                        </g>
                    </svg>
                </div>

                <div className="hero-info">
                    <h2>Welcome to TPT Radio Club</h2>
                    <p className="muted">
                        Shortwave enthusiasts of Tallinn — events, schedules,
                        live QSO and workshops.
                    </p>
                    <Player />
                    <p className="muted">
                        Broadcasting from the heart of Tallinn, our club brings
                        together radio enthusiasts, operators, and curious minds
                        who share a love for the airwaves. Whether you're tuning
                        in from across the city or across the world, you're part
                        of our frequency.
                    </p>
                    <p className="muted">
                        Founded by passionate amateur radio operators, TPT Radio
                        Club keeps the spirit of traditional shortwave alive
                        while embracing the technology of today. From Morse code
                        and QRP adventures to antenna building and friendly
                        contests, we’re always on the air — learning, sharing,
                        and connecting.
                    </p>
                    <p className="muted">
                        Join us on our weekly nets, events, and workshops. Let’s
                        make the world smaller, one signal at a time.
                    </p>
                    <p className="muted">🎙️ 73! de ES1TP</p>
                </div>
            </div>

            <div className="hero-right">
                <div className="poster">
                    <h3>Club Meetings</h3>
                    <p>
                        Every Tuesday, 18:00 – 22:00 at{" "}
                        <strong>Tallinn Polytech School</strong>
                    </p>
                    <button className="cta" onClick={() => navigate("/meetup")}>
                        Meetups Info
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
