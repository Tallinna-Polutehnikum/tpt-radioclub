import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Callsign } from "../../components/Callbook";
import { getAllCallSigns, updateCallSign } from "../../database/callsigns";

const emptyForm = {
    id: 0,
    callsign: "",
    name: "",
    qth: "",
    locator: "",
    bandsInput: "",
    modesInput: "",
};

const parseArray = (s: string) =>
    s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

const CallsignManager: React.FC = () => {
    const [entries, setEntries] = useState<Callsign[]>([]);
    const [form, setForm] = useState<typeof emptyForm>(emptyForm);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const formTopRef = useRef<HTMLDivElement | null>(null);

    const isValid = useMemo(
        () => form.callsign.trim().length > 0,
        [form.callsign]
    );

    useEffect(() => {
        const fetchCallsigns = async () => {
            const allCallsigns = await getAllCallSigns();
            setEntries(allCallsigns);
        };
        fetchCallsigns();
    }, []);

    const startEdit = (idx: number) => {
        const e = entries[idx];
        setEditingIndex(idx);
        setForm({
            id: e.id,
            callsign: e.callsign || "",
            name: e.name || "",
            qth: e.qth || "",
            locator: e.locator || "",
            bandsInput: (e.bands || []).join(", "),
            modesInput: (e.modes || []).join(", "),
        });
        formTopRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const save = async () => {
        const next: Callsign = {
            id: form.id,
            callsign: form.callsign.trim().toUpperCase(),
            name: form.name.trim() || undefined,
            qth: form.qth.trim() || undefined,
            locator: form.locator.trim() || undefined,
            bands: parseArray(form.bandsInput),
            modes: parseArray(form.modesInput),
        };
        if (!next.callsign) return;

        await updateCallSign(next.id, next);

        setEntries((s) => {
            const foundIndex = s.findIndex((x) => x.callsign === next.callsign);
            if (editingIndex === null) {
                if (foundIndex !== -1) {
                    const copy = [...s];
                    copy[foundIndex] = next;
                    return copy;
                }
                return [next, ...s];
            } else {
                const copy = [...s];
                if (foundIndex !== -1 && foundIndex !== editingIndex) {
                    copy.splice(foundIndex, 1);
                }
                copy[editingIndex] = next;
                return copy;
            }
        });

        setForm(emptyForm);
        setEditingIndex(null);
        console.log(
            editingIndex === null
                ? "Added callsign (placeholder):"
                : "Updated callsign (placeholder):",
            next
        );
    };

    const remove = (idx: number) => {
        const entry = entries[idx];
        const confirmed = window.confirm(`Remove callsign ${entry.callsign}?`);
        if (!confirmed) return;
        setEntries((s) => s.filter((_, i) => i !== idx));
        if (editingIndex === idx) {
            setEditingIndex(null);
            setForm(emptyForm);
        }
        console.log("Removed callsign (placeholder):", entry);
    };

    return (
        <div>
            <h3 className="page-title">Manage Callsigns</h3>

            <div
                className="callsign-form"
                ref={formTopRef}
                style={{ paddingLeft: 100 }}
            >
                <div className="form-row">
                    <label>Callsign</label>
                    <input
                        className="admin-input"
                        value={form.callsign}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, callsign: e.target.value }))
                        }
                        placeholder="ES1ABC"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && isValid) {
                                save();
                            }
                        }}
                    />
                </div>

                <div className="form-row">
                    <label>Name</label>
                    <input
                        className="admin-input"
                        value={form.name}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Operator name"
                    />
                </div>

                <div className="form-row">
                    <label>QTH</label>
                    <input
                        className="admin-input"
                        value={form.qth}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, qth: e.target.value }))
                        }
                        placeholder="Tallinn"
                    />
                </div>

                <div className="form-row">
                    <label>Locator</label>
                    <input
                        className="admin-input"
                        value={form.locator}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, locator: e.target.value }))
                        }
                        placeholder="KO29KL"
                    />
                </div>

                <div className="form-row">
                    <label>Bands (comma separated)</label>
                    <input
                        className="admin-input"
                        value={form.bandsInput}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                bandsInput: e.target.value,
                            }))
                        }
                        placeholder="HF, VHF, UHF"
                    />
                </div>

                <div className="form-row">
                    <label>Modes (comma separated)</label>
                    <input
                        className="admin-input"
                        value={form.modesInput}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                modesInput: e.target.value,
                            }))
                        }
                        placeholder="SSB, FT8, CW"
                    />
                </div>

                <div className="form-actions">
                    <button className="cta" onClick={save} disabled={!isValid}>
                        {editingIndex === null ? "Add" : "Save"}
                    </button>
                    <button
                        className="cta-outline"
                        onClick={() => {
                            setForm(emptyForm);
                            setEditingIndex(null);
                        }}
                        style={{ marginLeft: 8 }}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className="page">
                <table className="callbook-table">
                    <thead>
                        <tr>
                            <th>Callsign</th>
                            <th>Name</th>
                            <th>QTH</th>
                            <th>Locator</th>
                            <th>Bands</th>
                            <th>Modes</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((e, idx) => (
                            <tr key={`${e.callsign}-${idx}`}>
                                <td className="callsign">{e.callsign}</td>
                                <td>{e.name || "—"}</td>
                                <td>{e.qth || "—"}</td>
                                <td>{e.locator || "—"}</td>
                                <td>
                                    {(e.bands || []).map((b, i) => (
                                        <span key={b + i} className="chip">
                                            {b}
                                        </span>
                                    ))}
                                </td>
                                <td>
                                    {(e.modes || []).map((m, i) => (
                                        <span key={m + i} className="chip">
                                            {m}
                                        </span>
                                    ))}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button
                                        className="cta-outline"
                                        onClick={() => startEdit(idx)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="cta-outline"
                                        onClick={() => remove(idx)}
                                        style={{ marginLeft: 8 }}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {entries.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    style={{
                                        textAlign: "center",
                                        padding: 20,
                                        color: "var(--muted, #666)",
                                    }}
                                >
                                    No callsigns
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CallsignManager;
