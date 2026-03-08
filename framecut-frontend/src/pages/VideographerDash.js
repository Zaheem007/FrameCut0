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
  .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .status-dot.approved { background: var(--green); }
  .status-dot.rejected { background: var(--red); }
  .status-dot.pending  { background: var(--amber); }

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

function statusClass(s) {
  if (s === "Approved") return "approved";
  if (s === "Rejected") return "rejected";
  return "pending";
}

function VideographerDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [noProfile, setNoProfile] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/profiles/user/${userId}`)
      .then(res => axios.get(`http://localhost:5000/api/bookings/videographer/${res.data._id}`))
      .then(res => setBookings(res.data))
      .catch(() => setNoProfile(true));
  }, [userId]);

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/api/bookings/update/${id}`, { status })
      .then(() => {
        setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
        toast(`Booking ${status.toLowerCase()} successfully.`, status === "Approved" ? "success" : "info");
      })
      .catch(() => toast("Failed to update status.", "error"));
  };

  const pending = bookings.filter(b => b.status === "Pending").length;
  const approved = bookings.filter(b => b.status === "Approved").length;

  return (
    <DashboardLayout role="videographer">
      <style>{styles}</style>
      
      <button className="back-btn" onClick={() => navigate(-1)}><span className="back-btn-arrow">←</span> Back</button>
      <div className="fc-page-header">
        <p className="fc-eyebrow">Incoming</p>
        <h2 className="fc-title">Booking Requests</h2>
        <p className="fc-subtitle">{bookings.length} total request{bookings.length !== 1 ? "s" : ""}</p>
      </div>

      {noProfile ? (
        <div className="no-profile-banner">
          Set up your <strong>My Profile</strong> first — clients can't find or book you until your profile is live.
        </div>
      ) : (
        <>
          <div className="vg-stats">
            <div className="stat-card">
              <p className="stat-num">{bookings.length}</p>
              <p className="stat-label">Total</p>
            </div>
            <div className="stat-card approved">
              <p className="stat-num">{approved}</p>
              <p className="stat-label">Approved</p>
            </div>
            <div className="stat-card pending">
              <p className="stat-num">{pending}</p>
              <p className="stat-label">Pending</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="fc-empty">No booking requests yet.</div>
          ) : (
            <div className="vg-grid">
              {bookings.map((b, i) => {
                const sc = statusClass(b.status);
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
                        <div className={`status-dot ${sc}`} />
                        <span className={`fc-badge fc-badge-${sc}`}>{b.status}</span>
                      </div>
                      {b.status === "Pending" && (
                        <div className="vg-actions">
                          <RippleButton className="fc-btn-sm" style={{ background: "rgba(74,140,110,0.1)", color: "var(--green)", border: "1.5px solid rgba(74,140,110,0.3)", borderRadius: "var(--radius)" }} onClick={() => updateStatus(b._id, "Approved")}>Approve</RippleButton>
                          <RippleButton className="fc-btn-danger fc-btn-sm" onClick={() => updateStatus(b._id, "Rejected")}>Reject</RippleButton>
                        </div>
                      )}
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