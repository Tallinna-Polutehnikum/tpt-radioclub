import React from "react";

const About: React.FC = () => (
    <>
        <section className="page about">
            <div className="about-header">
                <h2>📡 History of the Tallinn Polytechnic Radio Club (ES1XQ, ES1TP)</h2>

                <div className="about-buttons">
                    <button className="about-btn primary" onClick={() => window.open('https://www.qrz.com/db/ES1TP')}>QRZ</button>
                    <button className="about-btn primary" onClick={() => window.open('https://erau.ee')}>ERAÜ</button>
                    <button className="about-btn primary" onClick={() => window.open('https://www.facebook.com/ES1XQ')}>Facebook</button>
                </div>
            </div>

            <p>The story of the Tallinn Polytechnic School Radio Club is one of passion, persistence, and generations of young engineers inspired by the invisible magic of radio waves.</p>

            <h3>Early beginnings</h3>

            <p>The roots go back to the late 1950s, when Jaan Kuus (ES1NI) — a curious boy fascinated by the glowing lamps and mysterious sounds inside a wooden radio box — decided to learn everything about how radios work. In 1960, he entered Tallinn Polytechnic School (TPT) to study radiotechnics, where he met his lifelong mentor, Arnold Isotamm, the author of the Radio Amateur’s Handbook and one of Estonia’s most respected radio educators.</p>

            <h3>The birth of the club</h3>

            <p>With Isotamm’s encouragement, Jaan and his fellow students Tõnu Elhi (UR2DW) and Ivo Kibuspuu (ES0NW) decided to rebuild the school’s dormant amateur radio station. At that time, there was almost no space for a new lab, so their first “radio room” was set up in a small, unused restroom — cleaned, repaired, and converted into a workshop.</p>

            <p>The early equipment was mostly homemade: a KVM receiver, self-built power supplies, and small transmitters designed under the guidance of the experienced radio amateur Avo Talvet (UR2AH). Despite limited means, the students managed to establish regular contacts on 3.5 MHz, and soon their enthusiasm attracted more participants. The station operated under the callsigns UR2KAB and later UK2RAB.</p>

            <h3>Growth and education</h3>

            <p>After the passing of Arnold Isotamm in 1966, the future of radio education at TPT was uncertain. At the school’s request, Jaan Kuus accepted the role of instructor, restoring the club once again — this time in a new room and under new conditions.</p>

            <p>Throughout the 1970s and 1980s, the radio club became a true technical laboratory. Students learned the principles of electronic circuits, antennas, transmitters, and receivers through real practical work. Under Jaan’s leadership, the club pioneered experiments with SSB (Single Side Band) transmission and designed custom-built transceivers, such as the UW3DI series. Many TPT graduates went on to become skilled radio engineers and active members of Estonia’s amateur radio community.</p>

            <h3>From the Soviet era to modern times</h3>

            <p>As technology advanced, so did the TPT Radio Club. In the 1990s, thanks to the efforts of Tõnu Elhi (ES2DW) and the strong support of the school administration, the club received new professional-grade transceivers like the Yaesu FT-847, which opened a new chapter in HF and VHF/UHF communication.</p>

            <p>From 1999 onward, TPT hosted the ERAÜ (Estonian Radio Amateurs Union) Winter Technical Days — national events that brought together experimenters, constructors, and radio operators from all over the Baltic region. The club also presented its work at major youth fairs such as TEEVIIT, demonstrating live radio links, video communication, and interactive workshops that introduced hundreds of students to amateur radio.</p>

            <h3>A hub for education and innovation</h3>

            <p>In the 2000s and 2010s, the club continued to expand its educational mission. The station took part in Scouts Jamboree On The Air (JOTA), teaching young scouts radio communication and international QSO etiquette. It also participated in satellite-tracking projects such as ESTCube-1, the first Estonian student satellite, successfully receiving and recording its signals in orbit.</p>

            <p>During building renovations, the club’s equipment was temporarily relocated — but the passion for radio never paused. Members organized field operations, antenna workshops, and contests across Estonia, exploring quiet rural locations like Harilaid for low-noise operating conditions.</p>

            <h3>The station today</h3>

            <p>Today, the official callsign ES1TP represents a modern, fully equipped educational radio station. Its gear includes IC-7700, IC-9100, IC-PW1, FT-847, and FTdx-5000 transceivers, along with a wide range of antennas for HF, VHF, and UHF. The club regularly participates in major contests such as CQ WW DX, WPX, and Russian DX, and collaborates with national and international radio amateurs.</p>

            <p>The radio room also serves as a learning laboratory for electronics and communication students. Many young enthusiasts earn their radio amateur licenses here, gaining practical experience in RF technology, soldering, and antenna construction.</p>

            <h3>Legacy</h3>

            <p>For more than 60 years, the Tallinn Polytechnic Radio Club has been a bridge between generations — connecting teachers, students, and radio amateurs from Estonia and beyond. What began as a spark of curiosity in a young boy’s mind has grown into a living tradition of learning, experimentation, and friendship through the airwaves.</p>

            <p>ES1TP continues to uphold that tradition — proving that, even in the digital age, the art and science of radio still inspire the innovators of tomorrow.</p>
        </section>
    </>
);

export default About;
