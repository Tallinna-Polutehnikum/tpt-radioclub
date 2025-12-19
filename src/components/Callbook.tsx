import { useMemo, useState } from "react";
import callsigns from "../assets/callsigns.json";
import { Link } from "react-router-dom";

const Callbook = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return callsigns.filter((e) =>
      `${e.callsign} ${e.name} ${e.qth} ${e.locator ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  return (
    <div className="page callbook-page">
      <section className="section">
        <header className="section-header">
          <h1>Callbook</h1>
          <p className="section-subtitle">
            Members of TPT Radio Club
          </p>
        </header>

        <div className="content">
          <input
            className="input callbook-search"
            type="text"
            placeholder="Search by callsign, name or QTH"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="callbook-table-wrapper">
            <table className="callbook-table">
              <thead>
                <tr>
                  <th>Callsign</th>
                  <th>Name</th>
                  <th>QTH</th>
                  <th>Locator</th>
                  <th>Bands</th>
                  <th>Modes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.callsign}>
                    <td className="callsign">
                      <Link to={`https://www.qrz.com/db/${e.callsign}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {e.callsign}
                      </Link>
                    </td>
                    <td>{e.name}</td>
                    <td>{e.qth ?? "—"}</td>
                    <td>{e.locator ?? "—"}</td>
                    <td>{e.bands?.join(", ") ?? "—"}</td>
                    <td>{e.modes?.join(", ")?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="muted center">
                No callbook entries found
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Callbook;
