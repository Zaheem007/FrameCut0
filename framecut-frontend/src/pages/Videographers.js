import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GLOBAL_CSS } from "../theme";

const EVENT_TYPES = ["All", "Wedding", "Pre-Wedding", "Engagement", "Birthday", "Corporate", "Product Shoot", "Music Video", "Documentary", "Real Estate"];

const styles = `
  ${GLOBAL_CSS}
  .vlist-page { min-height: 100vh; background: var(--bg); padding: 52px 40px; font-family: var(--ff-ui); }
  .vlist-inner { max-width: 1100px; margin: 0 auto; }

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 28px; transition: color 0.2s; font-family: var(--ff-ui); }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .filter-bar { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px 24px; margin-bottom: 32px; box-shadow: var(--shadow-sm); }
  .filter-row { display: flex; gap: 14px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 18px; }
  .filter-row:last-child { margin-bottom: 0; }
  .filter-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 180px; }
  .filter-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }

  .search-box { position: relative; }
  .search-box input { width: 100%; padding-left: 34px; }
  .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--border2); pointer-events: none; }

  .chip-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .chip { padding: 5px 13px; border-radius: 99px; font-size: 11.5px; font-weight: 500; border: 1.5px solid var(--border); color: var(--muted); background: var(--surface2); cursor: pointer; transition: all 0.18s; user-select: none; white-space: nowrap; }
  .chip:hover { border-color: var(--violet); color: var(--violet); }
  .chip.active { background: var(--plum); border-color: var(--plum); color: var(--bg); font-weight: 600; }

  .results-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .results-count { font-size: 12px; color: var(--muted); font-weight: 300; }

  .vlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

  .vcard { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm); transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s; }
  .vcard:hover { border-color: var(--violet); box-shadow: var(--shadow-lg); transform: translateY(-4px); }

  .vcard-img { height: 200px; overflow: hidden; background: var(--bg2); }
  .vcard-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .vcard:hover .vcard-img img { transform: scale(1.05); }
  .vcard-img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
  .vcard-img-ph svg { width: 40px; height: 40px; opacity: 0.15; }

  .vcard-body { padding: 18px 20px 22px; }
  .vcard-name { font-family: var(--ff-display); font-size: 18px; font-weight: 600; color: var(--plum); margin-bottom: 10px; }
  .vcard-meta { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
  .vcard-meta-item { font-size: 12.5px; color: var(--muted); font-weight: 300; }
  .vcard-price { color: var(--terra); font-weight: 600; font-size: 13px; }
  .vcard-events { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
  .vcard-event-chip { padding: 2px 9px; background: rgba(124,92,158,0.08); border: 1px solid rgba(124,92,158,0.2); color: var(--violet); border-radius: 99px; font-size: 10px; font-weight: 600; }

  .btn-view { display: block; width: 100%; padding: 9px; background: transparent; color: var(--plum); border: 1.5px solid var(--border2); text-align: center; text-decoration: none; font-family: var(--ff-ui); font-size: 10.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border-radius: var(--radius); transition: all 0.2s; }
  .btn-view:hover { background: var(--plum); color: var(--bg); border-color: var(--plum); }
`;

function Videographers() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [location, setLocation] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [activeEvent, setActiveEvent] = useState("All");

  const fetchProfiles = useCallback(() => {
    axios.get(`http://localhost:5000/api/profiles?location=${location}`)
      .then(res => setProfiles(res.data))
      .catch(err => console.log(err));
  }, [location]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const filtered = profiles
    .filter(p => activeEvent === "All" || p.selectedEvents?.includes(activeEvent) || p.services?.includes(activeEvent))
    .filter(p => !nameSearch || p.name?.toLowerCase().includes(nameSearch.toLowerCase()));

  return (
    <>
      <style>{styles}</style>
      <div className="vlist-page">
        <div className="vlist-inner">

          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-btn-arrow">←</span> Back
          </button>

          <div className="fc-page-header">
            <p className="fc-eyebrow">Directory</p>
            <h2 className="fc-title">Available Videographers</h2>
            <p className="fc-subtitle">{profiles.length} professionals listed</p>
          </div>

          <div className="filter-bar">
            <div className="filter-row">
              <div className="filter-group">
                <span className="filter-label">Search by Name</span>
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input className="fc-input" placeholder="Videographer name..." value={nameSearch} onChange={e => setNameSearch(e.target.value)} />
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-label">Search by Location</span>
                <div className="search-box">
                  <span className="search-icon">📍</span>
                  <input className="fc-input" placeholder="City, State..." value={location} onChange={e => setLocation(e.target.value)} />
                </div>
              </div>
            </div>
            <div>
              <span className="filter-label" style={{ marginBottom: "10px", display: "block" }}>Filter by Event Type</span>
              <div className="chip-grid">
                {EVENT_TYPES.map(ev => (
                  <div key={ev} className={`chip ${activeEvent === ev ? "active" : ""}`} onClick={() => setActiveEvent(ev)}>{ev}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="results-bar">
            <span className="results-count">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {activeEvent !== "All" ? ` for "${activeEvent}"` : ""}
              {nameSearch ? ` matching "${nameSearch}"` : ""}
              {location ? ` in "${location}"` : ""}
            </span>
          </div>

          <div className="vlist-grid">
            {filtered.length === 0 ? (
              <div className="fc-empty" style={{ gridColumn: "1/-1" }}>No videographers found for your filters.</div>
            ) : filtered.map((p, i) => (
              <div className={`vcard anim-fadeup anim-d${Math.min(i + 1, 6)}`} key={p._id}>
                <div className="vcard-img">
                  {p.profileImage
                    ? <img src={p.profileImage} alt={p.name} />
                    : <div className="vcard-img-ph"><svg viewBox="0 0 24 24" fill="none" stroke="var(--plum)" strokeWidth="1"><path d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg></div>
                  }
                </div>
                <div className="vcard-body">
                  <h5 className="vcard-name">{p.name}</h5>
                  <div className="vcard-meta">
                    <span className="vcard-meta-item">📍 {p.location}</span>
                    {p.servicePricing?.length > 0
                      ? <span className="vcard-meta-item vcard-price">From ₹{Math.min(...p.servicePricing.map(s => Number(s.price) || 0)).toLocaleString()}</span>
                      : p.pricing ? <span className="vcard-meta-item vcard-price">₹{p.pricing}</span> : null}
                  </div>
                  {p.selectedEvents?.length > 0 && (
                    <div className="vcard-events">
                      {p.selectedEvents.slice(0, 3).map(ev => <span key={ev} className="vcard-event-chip">{ev}</span>)}
                      {p.selectedEvents.length > 3 && <span className="vcard-event-chip">+{p.selectedEvents.length - 3}</span>}
                    </div>
                  )}
                  <Link to={`/profile/${p._id}`} className="btn-view">View Profile</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Videographers;