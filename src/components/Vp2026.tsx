import React, { useState, useEffect } from "react";
import type { Vp2026Registration } from "../database/vp2026";
import { getAllRegistrations, createRegistration } from "../database/vp2026";

const COUNTIES = [
    { value: "HI", label: "Hiiumaa" },
    { value: "HR", label: "Harju" },
    { value: "IV", label: "Ida-Viru" },
    { value: "JG", label: "Jõgeva" },
    { value: "JR", label: "Järva" },
    { value: "LN", label: "Lääne" },
    { value: "LV", label: "Lääne-Viru" },
    { value: "PL", label: "Põlva" },
    { value: "PU", label: "Pärnu" },
    { value: "RP", label: "Rapla" },
    { value: "SR", label: "Saaremaa" },
    { value: "TA", label: "Tartu" },
    { value: "TL", label: "Tallinn" },
    { value: "VC", label: "Valga" },
    { value: "VO", label: "Võru" },
    { value: "VP", label: "Viljandi" },
];

const Vp2026: React.FC = () => {
    const [registrations, setRegistrations] = useState<Vp2026Registration[]>([]);
    const [form, setForm] = useState({ callsign: "", name: "", county: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllRegistrations();
            setRegistrations(data);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!form.callsign.trim() || !form.name.trim() || !form.county) return;

        setLoading(true);

        try {
            await createRegistration(
                form.callsign.trim().toUpperCase(),
                form.name.trim(),
                form.county
            );
            setForm({ callsign: "", name: "", county: "" });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            const data = await getAllRegistrations();
            setRegistrations(data);
        } catch (err: unknown) {
            if (
                typeof err === "object" &&
                err !== null &&
                "code" in err &&
                (err as { code: string }).code === "23505"
            ) {
                setError("This callsign is already registered");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }

        setLoading(false);
    };

    return (
        <div className="page" style={{ maxWidth: 800, margin: "2rem auto" }}>
            <h1 className="page-title">Estonian Field Day 2026</h1>
            <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                Register your station for the upcoming field day
            </p>

            <form
                onSubmit={handleSubmit}
                style={{ maxWidth: 500, margin: "0 auto 2rem" }}
            >
                <input
                    className="admin-input"
                    placeholder="Callsign"
                    value={form.callsign}
                    onChange={(e) =>
                        setForm({ ...form, callsign: e.target.value })
                    }
                    style={{ marginBottom: 10 }}
                    maxLength={10}
                    required
                />
                <input
                    className="admin-input"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    style={{ marginBottom: 10 }}
                    required
                />
                <select
                    className="month-dropdown"
                    value={form.county}
                    onChange={(e) =>
                        setForm({ ...form, county: e.target.value })
                    }
                    style={{ width: "100%", marginBottom: 12 }}
                    required
                >
                    <option value="" disabled>
                        Select county
                    </option>
                    {COUNTIES.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.value} - {c.label}
                        </option>
                    ))}
                </select>
                <button className="cta" type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
                {error && (
                    <div style={{ color: "var(--accent)", marginTop: 8 }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ color: "green", marginTop: 8 }}>
                        Registered successfully!
                    </div>
                )}
            </form>

            <div className="callbook-table-wrapper">
                <table className="callbook-table">
                    <thead>
                        <tr>
                            <th>Nr</th>
                            <th>Callsign</th>
                            <th>Name</th>
                            <th>County</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td className="callsign">{r.callsign}</td>
                                <td>{r.name}</td>
                                <td>{r.county}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrations.length === 0 && (
                    <div className="muted center">No registrations yet</div>
                )}
            </div>
        </div>
    );
};

export default Vp2026;
