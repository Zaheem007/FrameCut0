import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const EVENT_TYPES = ["Wedding", "Pre-Wedding", "Engagement", "Birthday", "Corporate", "Product Shoot", "Music Video", "Documentary", "Real Estate", "Other"];

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

  .event-chip-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .event-chip { padding: 6px 14px; border-radius: 99px; font-size: 11.5px; font-weight: 500; border: 1.5px solid var(--border); color: var(--muted); background: var(--surface2); cursor: pointer; transition: all 0.18s; }
  .event-chip:hover { border-color: var(--violet); color: var(--violet); }
  .event-chip.selected { background: var(--plum); border-color: var(--plum); color: var(--bg); font-weight: 600; }

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
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [form, setForm] = useState({ eventDate: "", eventLocation: "", notes: "" });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/profiles/${id}`)
      .then(res => setProfile(res.data))
      .catch(() => toast("Could not load profile.", "error"));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const eventsToShow = profile?.selectedEvents?.length ? profile.selectedEvents : EVENT_TYPES;

  const submit = () => {
    if (!selectedEvent) { toast("Please select an event type.", "warning"); return; }
    if (!form.eventDate) { toast("Please choose a date.", "warning"); return; }
    if (!form.eventLocation) { toast("Please enter the event location.", "warning"); return; }

    axios.post("http://localhost:5000/api/bookings/create", {
      clientEmail, videographerId: id,
      eventType: selectedEvent,
      selectedService: selectedService?.name || "",
      agreedPrice: selectedService?.price || "",
      eventDate: form.eventDate,
      eventLocation: form.eventLocation,
      notes: form.notes,
    })
      .then(() => {
        toast("Booking submitted! You'll hear back soon.", "success", "Request Sent");
        setTimeout(() => navigate("/home"), 800);
      })
      .catch(() => toast("Failed to submit booking.", "error"));
  };

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
            <div className="bs-row"><span className="bs-row-label">Event</span><span className="bs-row-val">{selectedEvent || "—"}</span></div>
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

            <div className="fc-field">
              <label className="fc-label">Event Type</label>
              <div className="event-chip-grid">
                {eventsToShow.map(ev => (
                  <div key={ev} className={`event-chip ${selectedEvent === ev ? "selected" : ""}`} onClick={() => setSelectedEvent(ev)}>{ev}</div>
                ))}
              </div>
            </div>

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
              <label className="fc-label">Event Date</label>
              <input type="date" className="fc-input" name="eventDate" onChange={handleChange} />
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