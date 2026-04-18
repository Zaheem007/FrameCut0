import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 28px; transition: color 0.2s; font-family: var(--ff-ui); }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .vg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }

  .vg-card {
    background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius);
    padding: 22px 24px; box-shadow: var(--shadow-sm);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .vg-card:hover { border-color: var(--border2); box-shadow: var(--shadow-md); }

  .vg-card-label { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--border2); margin-bottom: 14px; }

  .vg-detail { display: flex; gap: 10px; margin-bottom: 9px; }
  .vg-key { font-size: 9.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--border2); min-width: 70px; margin-top: 2px; }
  .vg-val { font-size: 13px; color: var(--muted2); font-weight: 300; }

  .vg-card-footer { padding-top: 14px; border-top: 1.5px solid var(--border); margin-top: 14px; display: flex; align-items: center; justify-content: space-between; }

  .status-pill { display: flex; align-items: center; gap: 7px; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background: var(--green); }

  .vg-actions { display: flex; gap: 8px; }

  .no-profile-banner {
    background: rgba(176,120,48,0.07); border: 1.5px solid rgba(176,120,48,0.25);
    border-radius: var(--radius); padding: 20px 24px;
    color: var(--amber); font-size: 13.5px; font-weight: 300; line-height: 1.6;
  }
  .no-profile-banner strong { font-weight: 600; }

  .vg-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 36px; }
  .stat-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 18px 20px; text-align: center; box-shadow: var(--shadow-sm); }
  .stat-num { font-family: var(--ff-display); font-size: 32px; font-weight: 700; color: var(--plum); }
  .stat-label { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-top: 4px; }
  .stat-card.approved .stat-num { color: var(--green); }
  .stat-card.pending  .stat-num { color: var(--amber); }
`;

function VideographerDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [noProfile, setNoProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/profiles/user/${userId}`)
      .then(res => {
        const profileId = res.data._id;
        return axios.get(`http://localhost:5000/api/bookings/videographer/${profileId}`);
      })
      .then(res => { setBookings(res.data); setLoading(false); })
      .catch(err => {
        if (err.response?.status === 404) setNoProfile(true);
        setLoading(false);
      });
  }, [userId]);

  const total = bookings.length;

  if (loading) return (
    <DashboardLayout role="videographer">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px", fontFamily: "var(--ff-ui)" }}>
        <div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTop: "3px solid var(--violet)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "var(--muted)", fontSize: "13px" }}>Loading bookings...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="videographer">
      <style>{styles}</style>
      
      <button className="back-btn" onClick={() => navigate(-1)}><span className="back-btn-arrow">←</span> Back</button>
      <div className="fc-page-header">
        <p className="fc-eyebrow">Incoming</p>
        <h2 className="fc-title">Booking Requests</h2>
        <p className="fc-subtitle">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
      </div>

      {noProfile ? (
        <div className="no-profile-banner">
          Set up your <strong>My Profile</strong> first — clients can't find or book you until your profile is live.
        </div>
      ) : (
        <>
          <div className="vg-stats">
            <div className="stat-card">
              <p className="stat-num">{total}</p>
              <p className="stat-label">Total Bookings</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="fc-empty">No booking requests yet.</div>
          ) : (
            <div className="vg-grid">
              {bookings.map((b, i) => {
                return (
                  <div className={`vg-card anim-fadeup anim-d${Math.min(i + 1, 6)}`} key={b._id}>
                    <p className="vg-card-label">Event Booking</p>
                    <div className="vg-detail"><span className="vg-key">Client</span><span className="vg-val">{b.clientEmail}</span></div>
                    <div className="vg-detail"><span className="vg-key">Event</span><span className="vg-val">{b.eventType}</span></div>
                    <div className="vg-detail"><span className="vg-key">Date</span><span className="vg-val">{b.eventDate}</span></div>
                    <div className="vg-detail"><span className="vg-key">Location</span><span className="vg-val">{b.eventLocation}</span></div>
                    {b.selectedService && <div className="vg-detail"><span className="vg-key">Package</span><span className="vg-val">{b.selectedService}</span></div>}
                    {b.agreedPrice && <div className="vg-detail"><span className="vg-key">Price</span><span className="vg-val" style={{ color: "var(--terra)", fontWeight: 600 }}>₹{Number(b.agreedPrice).toLocaleString()}</span></div>}
                    {b.notes && <div className="vg-detail"><span className="vg-key">Notes</span><span className="vg-val">{b.notes}</span></div>}
                    <div className="vg-card-footer">
                      <div className="status-pill">
                        <div className="status-dot" />
                        <span className="fc-badge fc-badge-approved">Confirmed</span>
                      </div>
                      <span style={{
                        fontSize: "11px", fontWeight: 600, padding: "3px 10px",
                        borderRadius: "99px",
                        background: b.paymentStatus === "Advance Paid" ? "rgba(74,140,110,0.12)" : "rgba(176,120,48,0.1)",
                        color: b.paymentStatus === "Advance Paid" ? "var(--green)" : "var(--amber)",
                        border: `1px solid ${b.paymentStatus === "Advance Paid" ? "rgba(74,140,110,0.3)" : "rgba(176,120,48,0.3)"}`,
                      }}>
                        {b.paymentStatus === "Advance Paid" ? "💰 Advance Paid" : "⏳ Payment Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default VideographerDashboard;