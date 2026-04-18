import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";


const styles = `
  ${GLOBAL_CSS}
  .booking-page { min-height: 100vh; background: var(--bg); display: flex; align-items: flex-start; justify-content: center; padding: 60px 24px; font-family: var(--ff-ui); }
  .booking-wrap { width: 100%; max-width: 860px; display: grid; grid-template-columns: 1fr 380px; gap: 28px; }

  .booking-summary { background: var(--plum); border-radius: var(--radius); padding: 36px 32px; color: var(--bg); position: sticky; top: 80px; height: fit-content; }
  .bs-eyebrow { font-size: 9.5px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--violet2); margin-bottom: 12px; }
  .bs-name { font-family: var(--ff-display); font-size: 26px; font-weight: 600; margin-bottom: 8px; line-height: 1.2; }
  .bs-location { font-size: 13px; color: rgba(242,237,247,0.6); font-weight: 300; margin-bottom: 28px; }
  .bs-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 20px 0; }
  .bs-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .bs-row-label { font-size: 11px; color: rgba(242,237,247,0.55); font-weight: 400; letter-spacing: 0.06em; text-transform: uppercase; }
  .bs-row-val { font-size: 13.5px; font-weight: 500; color: var(--bg); }
  .bs-price-big { font-family: var(--ff-display); font-size: 32px; font-weight: 700; color: var(--terra); margin-top: 8px; }
  .bs-price-note { font-size: 11px; color: rgba(242,237,247,0.4); font-weight: 300; }

  .booking-form-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 36px 32px; box-shadow: var(--shadow-md); animation: fadeUp 0.4s ease forwards; }
  .bf-heading { font-family: var(--ff-display); font-size: 26px; font-weight: 600; color: var(--plum); margin-bottom: 4px; }
  .bf-sub { font-size: 13px; color: var(--muted); font-weight: 300; margin-bottom: 32px; }

  .service-select-list { border: 1.5px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-top: 4px; }
  .ssl-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.15s; }
  .ssl-item:last-child { border-bottom: none; }
  .ssl-item:hover { background: var(--bg2); }
  .ssl-item.selected { background: rgba(61,31,78,0.07); }
  .ssl-item-name { font-size: 13.5px; font-weight: 400; color: var(--plum); }
  .ssl-item-price { font-size: 13px; font-weight: 600; color: var(--terra); }
  .ssl-item-check { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
  .ssl-item.selected .ssl-item-check { background: var(--plum); border-color: var(--plum); color: white; font-size: 10px; }

  .fc-textarea { min-height: 80px; }

  .avail-cal-wrap { margin-bottom: 4px; }
  .avail-cal-title { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; display: block; }
  .avail-cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .avail-cal-nav-btn { background: none; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 4px 10px; cursor: pointer; font-size: 13px; color: var(--plum); transition: all 0.2s; }
  .avail-cal-nav-btn:hover { background: var(--plum); color: var(--bg); border-color: var(--plum); }
  .avail-cal-month { font-family: var(--ff-display); font-size: 15px; font-weight: 600; color: var(--plum); }
  .avail-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .avail-day-label { text-align: center; font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); padding: 5px 0; }
  .avail-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-size: 12px; font-weight: 400; border: 1.5px solid transparent; color: var(--muted); user-select: none; }
  .avail-day.available { background: rgba(74,140,110,0.1); border-color: rgba(74,140,110,0.3); color: #2d7a57; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .avail-day.available:hover { background: rgba(74,140,110,0.22); border-color: rgba(74,140,110,0.5); }
  .avail-day.available.selected { background: #2d7a57; color: #fff; border-color: #2d7a57; }
  .avail-day.past { color: var(--border); }
  .avail-day.today { border-color: var(--violet); }
  .avail-no-dates { font-size: 12.5px; color: var(--muted); font-style: italic; padding: 12px 0; }
  .avail-legend { display: flex; gap: 14px; margin-top: 10px; }
  .avail-legend-item { display: flex; align-items: center; gap: 5px; font-size: 10.5px; color: var(--muted); }
  .avail-legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }

  @media (max-width: 720px) {
    .booking-wrap { grid-template-columns: 1fr; }
    .booking-summary { position: static; }
  }
`;

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clientEmail = localStorage.getItem("email");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({ eventDate: "", eventLocation: "", notes: "" });
  const [calMonth, setCalMonth] = useState(new Date());

  useEffect(() => {
    axios.get(`http://localhost:5000/api/profiles/${id}`)
      .then(res => { setProfile(res.data); setLoading(false); })
      .catch(() => { toast("Could not load profile.", "error"); setLoading(false); });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toDateStr = (y, m, d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayStr = toDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const calDays = () => {
    const y = calMonth.getFullYear(), m = calMonth.getMonth();
    return { y, m, firstDay: new Date(y, m, 1).getDay(), daysInMonth: new Date(y, m + 1, 0).getDate() };
  };
  const availSet = new Set(profile?.availableDates || []);
  const selectDate = (str) => {
    if (!availSet.has(str)) return;
    setForm(f => ({ ...f, eventDate: str }));
  };

  const submit = () => {
    if (!form.eventDate) { toast("Please choose a date.", "warning"); return; }
    if (!form.eventLocation) { toast("Please enter the event location.", "warning"); return; }

    axios.post("http://localhost:5000/api/bookings/create", {
      clientEmail, videographerId: id,
      eventType: selectedService?.name || "",
      selectedService: selectedService?.name || "",
      agreedPrice: selectedService?.price || "",
      eventDate: form.eventDate,
      eventLocation: form.eventLocation,
      notes: form.notes,
    })
      .then((res) => {
        toast("Booking confirmed! Redirecting to payment...", "success", "Booking Created");
        setTimeout(() => navigate("/payment", {
          state: {
            bookingId: res.data.booking._id,
            totalAmount: Number(selectedService?.price || 0),
            clientEmail,
            videographerId: id,
            videographerName: profile?.name,
            eventDate: form.eventDate,
            eventLocation: form.eventLocation,
            selectedService: selectedService?.name || "",
          }
        }), 800);
      })
      .catch(() => toast("Failed to submit booking.", "error"));
  };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", fontFamily: "var(--ff-ui)" }}>
        <div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTop: "3px solid var(--violet)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "var(--muted)", fontSize: "13px" }}>Loading profile...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="booking-page">
        <div className="booking-wrap">
          {/* Summary panel */}
          <div className="booking-summary">
            <p className="bs-eyebrow">Booking For</p>
            <h2 className="bs-name">{profile?.name || "…"}</h2>
            <p className="bs-location">📍 {profile?.location || "…"}</p>
            <div className="bs-divider" />
            <div className="bs-row"><span className="bs-row-label">Date</span><span className="bs-row-val">{form.eventDate || "—"}</span></div>
            <div className="bs-row"><span className="bs-row-label">Venue</span><span className="bs-row-val">{form.eventLocation || "—"}</span></div>
            {selectedService && <div className="bs-row"><span className="bs-row-label">Package</span><span className="bs-row-val">{selectedService.name}</span></div>}
            <div className="bs-divider" />
            {selectedService?.price
              ? <><p className="bs-price-big">₹{Number(selectedService.price).toLocaleString()}</p><p className="bs-price-note">Agreed package price</p></>
              : <p className="bs-price-note">Select a package to see pricing</p>}
          </div>

          {/* Form */}
          <div className="booking-form-card">
            <h3 className="bf-heading">Book Now</h3>
            <p className="bf-sub">Fill in your event details below</p>

            {profile?.servicePricing?.length > 0 && (
              <div className="fc-field">
                <label className="fc-label">Select Package</label>
                <div className="service-select-list">
                  {profile.servicePricing.map((s, i) => (
                    <div key={i} className={`ssl-item ${selectedService?.name === s.name ? "selected" : ""}`} onClick={() => setSelectedService(selectedService?.name === s.name ? null : s)}>
                      <span className="ssl-item-name">{s.name}</span>
                      <span className="ssl-item-price">₹{Number(s.price).toLocaleString()}</span>
                      <span className="ssl-item-check">{selectedService?.name === s.name ? "✓" : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="fc-field">
              <label className="fc-label">Select Date</label>
              {profile?.availableDates?.length > 0 ? (
                <div className="avail-cal-wrap">
                  <div className="avail-cal-nav">
                    <button className="avail-cal-nav-btn" onClick={() => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>‹</button>
                    <span className="avail-cal-month">{MONTH_NAMES[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
                    <button className="avail-cal-nav-btn" onClick={() => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>›</button>
                  </div>
                  <div className="avail-cal-grid">
                    {DAY_LABELS.map(d => <div key={d} className="avail-day-label">{d}</div>)}
                    {(() => {
                      const { y, m, firstDay, daysInMonth } = calDays();
                      const cells = [];
                      for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="avail-day" />);
                      for (let d = 1; d <= daysInMonth; d++) {
                        const str = toDateStr(y, m, d);
                        const isAvail = availSet.has(str);
                        const isPast = str < todayStr;
                        const isSelected = form.eventDate === str;
                        const isToday = str === todayStr;
                        cells.push(
                          <div
                            key={str}
                            className={`avail-day ${isAvail && !isPast ? "available" : ""} ${isPast ? "past" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                            onClick={() => !isPast && selectDate(str)}
                            title={isAvail && !isPast ? "Available — click to select" : !isAvail && !isPast ? "Not available" : ""}
                          >{d}</div>
                        );
                      }
                      return cells;
                    })()}
                  </div>
                  <div className="avail-legend">
                    <div className="avail-legend-item"><div className="avail-legend-dot" style={{ background: "rgba(74,140,110,0.2)", border: "1px solid rgba(74,140,110,0.4)" }} />Available</div>
                    <div className="avail-legend-item"><div className="avail-legend-dot" style={{ background: "#2d7a57" }} />Selected</div>
                    <div className="avail-legend-item"><div className="avail-legend-dot" style={{ background: "var(--bg2)" }} />Unavailable</div>
                  </div>
                  {form.eventDate && <p style={{ fontSize: "12px", color: "#2d7a57", fontWeight: 600, marginTop: "10px" }}>✓ Selected: {form.eventDate}</p>}
                </div>
              ) : (
                <>
                  <p className="avail-no-dates">This videographer hasn't set their availability yet. Pick any date below.</p>
                  <input type="date" className="fc-input" name="eventDate" value={form.eventDate} onChange={handleChange} min={todayStr} />
                </>
              )}
            </div>

            <div className="fc-field">
              <label className="fc-label">Event Location / Venue</label>
              <input className="fc-input" name="eventLocation" placeholder="City or venue name" onChange={handleChange} />
            </div>

            <div className="fc-field">
              <label className="fc-label">Additional Notes (optional)</label>
              <textarea className="fc-textarea" name="notes" placeholder="Any special requirements, preferences or details..." onChange={handleChange} />
            </div>

            <RippleButton className="fc-btn-terra fc-btn-lg fc-btn-full" onClick={submit}>Confirm Booking Request</RippleButton>
            <RippleButton className="fc-btn-ghost fc-btn-sm fc-btn-full" onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>Go Back</RippleButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default Booking;