import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { GLOBAL_CSS } from "../theme";

const styles = `
  ${GLOBAL_CSS}

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 28px; transition: color 0.2s; font-family: var(--ff-ui); }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .cd-filters { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
  .cd-search-box { position: relative; flex: 1; min-width: 180px; }
  .cd-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--border2); pointer-events: none; }
  .cd-search-box input { width: 100%; padding-left: 34px; }

  .cd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 20px; }

  .cd-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm); transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s; }
  .cd-card:hover { border-color: var(--violet); box-shadow: var(--shadow-lg); transform: translateY(-4px); }

  .cd-img { height: 190px; overflow: hidden; background: var(--bg2); position: relative; }
  .cd-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .cd-card:hover .cd-img img { transform: scale(1.05); }
  .cd-img-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--bg2); }
  .cd-img-ph svg { width: 38px; height: 38px; opacity: 0.15; }
  .cd-rating-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.62); backdrop-filter: blur(4px); border-radius: 20px; padding: 4px 10px; display: flex; align-items: center; gap: 5px; }
  .cd-rating-star { color: #f5c842; font-size: 12px; }
  .cd-rating-score { color: #fff; font-size: 12px; font-weight: 700; font-family: var(--ff-ui); }
  .cd-rating-count { color: rgba(255,255,255,0.6); font-size: 10px; font-family: var(--ff-ui); }

  .cd-body { padding: 18px 20px 22px; }
  .cd-name { font-family: var(--ff-display); font-size: 17px; font-weight: 600; color: var(--plum); margin-bottom: 10px; }
  .cd-meta { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
  .cd-meta-item { font-size: 12px; color: var(--muted); font-weight: 300; }
  .cd-price { color: var(--terra); font-weight: 600; font-size: 13px; }
  .cd-events { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
  .cd-event-chip { padding: 2px 9px; background: rgba(124,92,158,0.08); border: 1px solid rgba(124,92,158,0.2); color: var(--violet); border-radius: 99px; font-size: 10px; font-weight: 600; }

  .cd-btn-view { display: block; width: 100%; padding: 9px; background: transparent; color: var(--plum); border: 1.5px solid var(--border2); text-align: center; text-decoration: none; font-family: var(--ff-ui); font-size: 10.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border-radius: var(--radius); transition: all 0.2s; }
  .cd-btn-view:hover { background: var(--plum); color: var(--bg); border-color: var(--plum); }

  .results-note { font-size: 12px; color: var(--muted); font-weight: 300; margin-bottom: 18px; }
`;

function ClientDashboard() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [ratings, setRatings] = useState({});
  const [nameSearch, setNameSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/profiles").then(res => setProfiles(res.data));
    axios.get("http://localhost:5000/api/reviews/averages/all").then(res => setRatings(res.data)).catch(() => {});
  }, []);

  const filtered = profiles.filter(p =>
    !nameSearch || p.name?.toLowerCase().includes(nameSearch.toLowerCase())
  );

  return (
    <DashboardLayout role="client">
      <style>{styles}</style>

      <button className="back-btn" onClick={() => navigate(-1)}>
        <span className="back-btn-arrow">←</span> Back
      </button>

      <div className="fc-page-header">
        <p className="fc-eyebrow">Discovery</p>
        <h2 className="fc-title">Browse Videographers</h2>
        <p className="fc-subtitle">{profiles.length} creatives available</p>
      </div>

      <div className="cd-filters">
        <div className="cd-search-box">
          <span className="cd-search-icon">🔍</span>
          <input className="fc-input" placeholder="Search by name..." value={nameSearch} onChange={e => setNameSearch(e.target.value)} />
        </div>
      </div>

      {nameSearch && <p className="results-note">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{nameSearch}"</p>}

      <div className="cd-grid">
        {filtered.length === 0 ? (
          <div className="fc-empty" style={{ gridColumn: "1/-1" }}>No videographers found.</div>
        ) : filtered.map((p, i) => {
          const rData = ratings[p._id];
          return (
          <div className={`cd-card anim-fadeup anim-d${Math.min(i + 1, 6)}`} key={p._id}>
            <div className="cd-img">
              {p.profileImage
                ? <img src={p.profileImage} alt={p.name} />
                : <div className="cd-img-ph"><svg viewBox="0 0 24 24" fill="none" stroke="var(--plum)" strokeWidth="1"><path d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg></div>
              }
              {rData && (
                <div className="cd-rating-badge">
                  <span className="cd-rating-star">★</span>
                  <span className="cd-rating-score">{rData.avg.toFixed(1)}</span>
                  <span className="cd-rating-count">({rData.count})</span>
                </div>
              )}
            </div>
            <div className="cd-body">
              <h5 className="cd-name">{p.name}</h5>
              <div className="cd-meta">
                <span className="cd-meta-item">📍 {p.location}</span>
                {p.servicePricing?.length > 0
                  ? <span className="cd-meta-item cd-price">From ₹{Math.min(...p.servicePricing.map(s => Number(s.price) || 0)).toLocaleString()}</span>
                  : p.pricing ? <span className="cd-meta-item cd-price">₹{p.pricing}</span> : null}
              </div>
              {p.selectedEvents?.length > 0 && (
                <div className="cd-events">
                  {p.selectedEvents.slice(0, 3).map(ev => <span key={ev} className="cd-event-chip">{ev}</span>)}
                  {p.selectedEvents.length > 3 && <span className="cd-event-chip">+{p.selectedEvents.length - 3}</span>}
                </div>
              )}
              <Link to={`/profile/${p._id}`} className="cd-btn-view">View Profile</Link>
            </div>
          </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

export default ClientDashboard;