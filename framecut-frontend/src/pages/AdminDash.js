import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .admin-page { min-height: 100vh; background: var(--bg); padding: 52px 40px; font-family: var(--ff-ui); }
  .admin-inner { max-width: 900px; margin: 0 auto; }

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 28px; transition: color 0.2s; font-family: var(--ff-ui); }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .admin-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 44px; }
  .astat { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px 22px; box-shadow: var(--shadow-sm); }
  .astat-num { font-family: var(--ff-display); font-size: 36px; font-weight: 700; color: var(--plum); }
  .astat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-top: 4px; }

  .admin-section { margin-bottom: 48px; }

  .profile-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius);
    margin-bottom: 8px; transition: border-color 0.2s; box-shadow: var(--shadow-sm);
  }
  .profile-row:hover { border-color: var(--border2); }
  .profile-row-info { flex: 1; }
  .profile-row-name { font-family: var(--ff-display); font-size: 15px; font-weight: 600; color: var(--plum); }
  .profile-row-sub { font-size: 12px; color: var(--muted); font-weight: 300; margin-top: 2px; }

  .booking-row {
    padding: 16px 18px; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius);
    margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
    box-shadow: var(--shadow-sm); transition: border-color 0.2s;
  }
  .booking-row:hover { border-color: var(--border2); }
  .br-left { flex: 1; }
  .br-client { font-size: 13.5px; font-weight: 500; color: var(--plum); margin-bottom: 3px; }
  .br-detail { font-size: 12px; color: var(--muted); font-weight: 300; }
  .br-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
  .br-date { font-size: 11px; color: var(--border2); }
`;

function AdminDashboard() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("https://framecut-rqms.onrender.com/api/profiles").then(r => setProfiles(r.data));
    axios.get("https://framecut-rqms.onrender.com/api/bookings").then(r => setBookings(r.data));
  }, []);

  const deleteProfile = (id) => {
    if (!window.confirm("Delete this profile permanently?")) return;
    axios.delete(`https://framecut-rqms.onrender.com/api/profiles/delete/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(() => { setProfiles(profiles.filter(p => p._id !== id)); toast("Profile deleted.", "info"); })
      .catch(() => toast("Only admins can delete profiles.", "error"));
  };

  const statusClass = (s) => {
    if (s === "Approved") return "fc-badge fc-badge-approved";
    if (s === "Rejected") return "fc-badge fc-badge-rejected";
    return "fc-badge fc-badge-pending";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="admin-page">
        <div className="admin-inner">
          <button className="back-btn" onClick={() => navigate(-1)}><span className="back-btn-arrow">←</span> Back</button>
          <div className="fc-page-header">
            <p className="fc-eyebrow">Control Panel</p>
            <h2 className="fc-title">Admin Dashboard</h2>
          </div>

          <div className="admin-stats">
            <div className="astat"><p className="astat-num">{profiles.length}</p><p className="astat-label">Videographers</p></div>
            <div className="astat"><p className="astat-num">{bookings.length}</p><p className="astat-label">Total Bookings</p></div>
            <div className="astat"><p className="astat-num" style={{ color: "var(--amber)" }}>{bookings.filter(b => b.status === "Pending").length}</p><p className="astat-label">Pending</p></div>
          </div>

          <div className="admin-section">
            <div className="fc-section-header">
              <span className="fc-section-label">Videographer Profiles</span>
              <div className="fc-section-line" />
              <span className="fc-section-count">{profiles.length} total</span>
            </div>
            {profiles.length === 0 ? <p className="fc-empty">No profiles found.</p> : profiles.map((p, i) => (
              <div className={`profile-row anim-fadeup anim-d${Math.min(i + 1, 6)}`} key={p._id}>
                <div className="profile-row-info">
                  <p className="profile-row-name">{p.name}</p>
                  <p className="profile-row-sub">📍 {p.location} {p.experience ? `· ${p.experience}` : ""}</p>
                </div>
                <RippleButton className="fc-btn-danger fc-btn-sm" onClick={() => deleteProfile(p._id)}>Delete</RippleButton>
              </div>
            ))}
          </div>

          <div className="admin-section">
            <div className="fc-section-header">
              <span className="fc-section-label">All Bookings</span>
              <div className="fc-section-line" />
              <span className="fc-section-count">{bookings.length} total</span>
            </div>
            {bookings.length === 0 ? <p className="fc-empty">No bookings yet.</p> : bookings.map((b, i) => (
              <div className={`booking-row anim-fadeup anim-d${Math.min(i + 1, 6)}`} key={b._id}>
                <div className="br-left">
                  <p className="br-client">{b.clientEmail}</p>
                  <p className="br-detail">{b.eventType} — {b.eventLocation} {b.selectedService ? `· ${b.selectedService}` : ""}</p>
                </div>
                <div className="br-right">
                  <span className={statusClass(b.status)}>{b.status}</span>
                  <span className="br-date">{b.eventDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;