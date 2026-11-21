import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { GLOBAL_CSS } from "../theme";

const styles = `
  ${GLOBAL_CSS}

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 28px; transition: color 0.2s; font-family: var(--ff-ui); }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .bookings-list { display: flex; flex-direction: column; gap: 14px; }

  .bk-card {
    background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius);
    padding: 22px 26px; box-shadow: var(--shadow-sm);
    transition: border-color 0.2s, box-shadow 0.2s;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 20px;
  }
  .bk-card:hover { border-color: var(--border2); box-shadow: var(--shadow-md); }

  .bk-card-left { flex: 1; }
  .bk-videographer { font-family: var(--ff-display); font-size: 17px; font-weight: 600; color: var(--plum); margin-bottom: 10px; }

  .bk-details { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
  .bk-detail { display: flex; flex-direction: column; gap: 3px; }
  .bk-detail-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--border2); }
  .bk-detail-value { font-size: 13px; color: var(--muted2); font-weight: 300; }

  .bk-card-right { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

  .bk-event-tag { padding: 4px 12px; background: var(--bg2); border: 1.5px solid var(--border); color: var(--muted); border-radius: var(--radius); font-size: 10.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

  .bk-package { font-size: 11px; color: var(--violet); font-weight: 500; }

  .empty-state { text-align: center; padding: 80px 20px; }
  .empty-icon { font-size: 48px; margin-bottom: 14px; opacity: 0.35; }
  .empty-text { font-family: var(--ff-display); font-size: 16px; color: var(--border2); font-style: italic; }
`;

function statusClass(s) {
  if (s === "Approved") return "fc-badge fc-badge-approved";
  if (s === "Rejected") return "fc-badge fc-badge-rejected";
  return "fc-badge fc-badge-pending";
}

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const clientEmail = localStorage.getItem("email");

  useEffect(() => {
    axios.get("https://framecut-rqms.onrender.com/api/bookings")
      .then(res => setBookings(res.data.filter(b => b.clientEmail === clientEmail)))
      .catch(err => console.log(err));
  }, [clientEmail]);

  return (
    <DashboardLayout role="client">
      <style>{styles}</style>
      <button className="back-btn" onClick={() => navigate(-1)}><span className="back-btn-arrow">←</span> Back</button>
      <div className="fc-page-header">
        <p className="fc-eyebrow">Your Schedule</p>
        <h2 className="fc-title">My Bookings</h2>
        <p className="fc-subtitle">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <p className="empty-text">No bookings yet — find a videographer and get started!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((b, i) => (
            <div className={`bk-card anim-fadeup anim-d${Math.min(i + 1, 6)}`} key={b._id}>
              <div className="bk-card-left">
                <p className="bk-videographer">{b.videographerId?.name || "Videographer"}</p>
                <div className="bk-details">
                  <div className="bk-detail"><span className="bk-detail-label">Date</span><span className="bk-detail-value">{b.eventDate}</span></div>
                  <div className="bk-detail"><span className="bk-detail-label">Location</span><span className="bk-detail-value">{b.eventLocation}</span></div>
                  {b.selectedService && <div className="bk-detail"><span className="bk-detail-label">Package</span><span className="bk-detail-value">{b.selectedService}</span></div>}
                  {b.agreedPrice && <div className="bk-detail"><span className="bk-detail-label">Price</span><span className="bk-detail-value" style={{ color: "var(--terra)", fontWeight: 600 }}>₹{Number(b.agreedPrice).toLocaleString()}</span></div>}
                  {b.notes && <div className="bk-detail" style={{ gridColumn: "1/-1" }}><span className="bk-detail-label">Notes</span><span className="bk-detail-value">{b.notes}</span></div>}
                </div>
              </div>
              <div className="bk-card-right">
                <span className="bk-event-tag">{b.eventType}</span>
                <span className={statusClass(b.status)}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyBookings;