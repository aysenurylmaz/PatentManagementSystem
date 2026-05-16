import { useEffect, useState } from "react";

const members = [
    { name: "Ayşenur Yılmaz", id: "B231202019", initials: "AY", color: "#4A90D9" },
    { name: "Elif Gül Arslan", id: "B231202061", initials: "EA", color: "#5BA85A" },
    { name: "Rana İrem Özen", id: "B241202002", initials: "RO", color: "#D96A4A" },
    { name: "Vildan Karaca",   id: "B231202027", initials: "VK", color: "#9B59B6" },
];

const About = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            minHeight: "calc(100vh - 80px)",
            background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f5f0ff 100%)",
            padding: "48px 24px",
            fontFamily: "'Segoe UI', sans-serif",
        }}>
            {/* Başlık */}
            <div style={{
                textAlign: "center",
                marginBottom: "48px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(-20px)",
                transition: "all 0.6s ease",
            }}>
                <div style={{
                    display: "inline-block",
                    background: "#1a6fc4",
                    borderRadius: "12px",
                    padding: "10px 28px",
                    marginBottom: "16px",
                }}>
                    <span style={{ color: "white", fontWeight: 700, fontSize: "13px", letterSpacing: "2px" }}>
                        PATENT MANAGEMENT SYSTEM
                    </span>
                </div>
                <h1 style={{
                    fontSize: "clamp(28px, 5vw, 42px)",
                    fontWeight: 800,
                    color: "#1a1a2e",
                    margin: "0 0 12px",
                }}>
                    Project Teams
                </h1>
                <p style={{ color: "#666", fontSize: "16px", margin: 0 }}>
                    The team members who developed this project together
                </p>
            </div>

            {/* Kartlar */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px",
                maxWidth: "960px",
                margin: "0 auto 56px",
            }}>
                {members.map((m, i) => (
                    <div key={m.id} style={{
                        background: "white",
                        borderRadius: "16px",
                        padding: "32px 24px",
                        textAlign: "center",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        borderTop: `4px solid ${m.color}`,
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(30px)",
                        transition: `all 0.5s ease ${0.1 + i * 0.1}s`,
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "50%",
                            background: `${m.color}22`,
                            border: `2px solid ${m.color}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            fontSize: "22px",
                            fontWeight: 700,
                            color: m.color,
                        }}>
                            {m.initials}
                        </div>

                        <h3 style={{
                            margin: "0 0 8px",
                            fontSize: "17px",
                            fontWeight: 700,
                            color: "#1a1a2e",
                        }}>
                            {m.name}
                        </h3>

                        <span style={{
                            display: "inline-block",
                            background: `${m.color}18`,
                            color: m.color,
                            borderRadius: "20px",
                            padding: "4px 14px",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                        }}>
                            {m.id}
                        </span>
                    </div>
                ))}
            </div>

            {/* Alt bilgi */}
            <div style={{
                textAlign: "center",
                opacity: visible ? 1 : 0,
                transition: "all 0.6s ease 0.6s",
            }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "white",
                    borderRadius: "12px",
                    padding: "16px 32px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}>
                    <span style={{ fontSize: "20px" }}>🎓</span>
                    <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "14px" }}>
                            Sakarya University
                        </div>
                        <div style={{ color: "#888", fontSize: "13px" }}>
                            Software Engineering
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;