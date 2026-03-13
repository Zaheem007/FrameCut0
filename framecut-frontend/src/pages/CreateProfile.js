import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const EVENT_TYPES = ["Wedding", "Pre-Wedding", "Engagement", "Birthday", "Corporate", "Product Shoot", "Music Video", "Documentary", "Real Estate", "Other"];

const styles = `
  ${GLOBAL_CSS}
  .cp-wrap { max-width: 640px; font-family: var(--ff-ui); }

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 28px; transition: color 0.2s; font-family: var(--ff-ui); }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .service-pricing-table { border: 1.5px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 8px; }
  .spt-head { display: grid; grid-template-columns: 1fr 120px 36px; gap: 0; background: var(--bg2); border-bottom: 1.5px solid var(--border); }
  .spt-head span { padding: 8px 12px; font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .spt-row { display: grid; grid-template-columns: 1fr 120px 36px; border-bottom: 1px solid var(--border); transition: background 0.15s; }
  .spt-row:last-child { border-bottom: none; }
  .spt-row:hover { background: var(--bg2); }
  .spt-cell { padding: 2px 4px; display: flex; align-items: center; }
  .spt-cell input {
    width: 100%; background: transparent; border: none; outline: none;
    font-family: var(--ff-ui); font-size: 13px; font-weight: 300; color: var(--plum);
    padding: 8px 8px;
  }
  .spt-cell input::placeholder { color: #c4bace; }
  .spt-cell input:focus { background: rgba(124,92,158,0.05); }
  .spt-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 16px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
  .spt-remove:hover { color: var(--red); }

  .chip-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .chip {
    padding: 5px 12px; border-radius: 99px; font-size: 11.5px; font-weight: 500;
    border: 1.5px solid var(--border); color: var(--muted); background: var(--surface2);
    cursor: pointer; transition: all 0.18s; user-select: none;
  }
  .chip:hover { border-color: var(--violet); color: var(--violet); }
  .chip.selected { background: rgba(61,31,78,0.1); border-color: var(--plum); color: var(--plum); font-weight: 600; }

  .form-section { margin-bottom: 32px; }
  .form-section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--violet); margin-bottom: 18px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }

  .pwd-section { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 24px 26px; margin-top: 44px; }
  .pwd-section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--terra); margin-bottom: 18px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .pwd-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 600px) { .pwd-row { grid-template-columns: 1fr; } }

  /* ── Availability Calendar ── */
  .avail-section { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 24px 26px; margin-top: 32px; }
  .avail-title { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--violet); margin-bottom: 6px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .avail-subtitle { font-size: 12px; color: var(--muted); font-weight: 300; margin-bottom: 20px; }
  .cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .cal-nav-btn { background: none; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 5px 12px; cursor: pointer; font-size: 14px; color: var(--plum); transition: all 0.2s; }
  .cal-nav-btn:hover { background: var(--plum); color: var(--bg); border-color: var(--plum); }
  .cal-month { font-family: var(--ff-display); font-size: 17px; font-weight: 600; color: var(--plum); }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .cal-day-label { text-align: center; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding: 6px 0; }
  .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 12.5px; font-weight: 400; cursor: pointer; transition: all 0.15s; border: 1.5px solid transparent; color: var(--plum); user-select: none; }
  .cal-day:hover:not(.cal-empty):not(.cal-past) { border-color: var(--violet); background: rgba(124,92,158,0.07); }
  .cal-day.cal-available { background: rgba(74,140,110,0.12); border-color: rgba(74,140,110,0.35); color: #2d7a57; font-weight: 600; }
  .cal-day.cal-available:hover { background: rgba(74,140,110,0.22); }
  .cal-day.cal-past { color: var(--border2); cursor: default; }
  .cal-day.cal-empty { cursor: default; }
  .cal-day.cal-today { border-color: var(--violet); font-weight: 700; }
  .cal-legend { display: flex; gap: 18px; margin-top: 14px; }
  .cal-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--muted); font-weight: 400; }
  .cal-legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
  .avail-count { font-size: 12px; color: var(--violet); font-weight: 600; margin-top: 14px; }

  .img-upload-zone {
    border: 2px dashed var(--border2); border-radius: var(--radius);
    padding: 28px 20px; text-align: center; cursor: pointer;
    transition: border-color 0.2s, background 0.2s; position: relative;
    background: var(--surface2);
  }
  .img-upload-zone:hover { border-color: var(--violet); background: rgba(124,92,158,0.04); }
  .img-upload-zone.has-image { padding: 0; border-style: solid; border-color: var(--border); overflow: hidden; }
  .img-upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .img-upload-preview { width: 100%; height: 200px; object-fit: cover; display: block; }
  .img-upload-label { font-size: 12px; color: var(--muted); font-weight: 400; margin-top: 8px; }
  .img-upload-hint { font-size: 10.5px; color: var(--border2); margin-top: 4px; }
  .img-upload-icon { font-size: 28px; margin-bottom: 8px; opacity: 0.4; }
  .img-upload-change {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: rgba(61,31,78,0.7); color: var(--bg);
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 8px; text-align: center; opacity: 0; transition: opacity 0.2s;
  }
  .img-upload-zone.has-image:hover .img-upload-change { opacity: 1; }
`;

const EMPTY = { name: "", location: "", experience: "", bio: "", profileImage: "", equipment: "" };

function CreateProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [services, setServices] = useState([{ name: "", price: "" }]);
  const [isExisting, setIsExisting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [calMonth, setCalMonth] = useState(new Date());

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast("Image must be under 5MB.", "warning"); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm(prev => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    axios.get(`http://localhost:5000/api/profiles/user/${userId}`, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" }
    })
      .then(res => {
        const p = res.data;
        setForm({ name: p.name || "", location: p.location || "", experience: p.experience || "", bio: p.bio || "", profileImage: p.profileImage || "", equipment: p.equipment || "" });
        if (p.profileImage) setImagePreview(p.profileImage);
        if (p.selectedEvents) setSelectedEvents(p.selectedEvents);
        if (p.servicePricing?.length) setServices(p.servicePricing);
        if (p.availableDates?.length) setAvailableDates(p.availableDates);
        setIsExisting(true);
      })
      .catch(err => { if (err.response?.status !== 404) toast("Could not load profile.", "error"); })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleEvent = (ev) => setSelectedEvents(prev => prev.includes(ev) ? prev.filter(e => e !== ev) : [...prev, ev]);

  const updateService = (i, key, val) => setServices(services.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const addService = () => setServices([...services, { name: "", price: "" }]);
  const removeService = (i) => setServices(services.filter((_, idx) => idx !== i));

  // Calendar helpers
  const toDateStr = (y, m, d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayStr = toDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const toggleDate = (str) => {
    if (str < todayStr) return;
    setAvailableDates(prev => prev.includes(str) ? prev.filter(d => d !== str) : [...prev, str]);
  };
  const prevMonth = () => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const calDays = () => {
    const y = calMonth.getFullYear(), m = calMonth.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    return { y, m, firstDay, daysInMonth };
  };
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const saveAvailability = () => {
    if (!userId) return;
    axios.post("http://localhost:5000/api/profiles/create", {
      ...form, userId,
      services: selectedEvents.join(", "),
      pricing: services.filter(s => s.name).length ? Math.min(...services.filter(s => s.name).map(s => Number(s.price) || 0)) : 0,
      servicePricing: services.filter(s => s.name),
      selectedEvents,
      availableDates,
    })
      .then(() => toast("Availability updated!", "success"))
      .catch(() => toast("Failed to update availability.", "error"));
  };

  const save = () => {
    if (!form.name || !form.location) { toast("Name and location are required.", "warning"); return; }
    const validServices = services.filter(s => s.name);
    const pricing = validServices.length ? Math.min(...validServices.map(s => Number(s.price) || 0)) : 0;
    axios.post("http://localhost:5000/api/profiles/create", {
      ...form, userId,
      services: selectedEvents.join(", "),
      pricing,
      servicePricing: validServices,
      selectedEvents,
      availableDates,
    })
      .then(res => {
        const p = res.data.profile;
        setForm({ name: p.name || "", location: p.location || "", experience: p.experience || "", bio: p.bio || "", profileImage: p.profileImage || "", equipment: p.equipment || "" });
        if (p.profileImage) setImagePreview(p.profileImage);
        if (p.selectedEvents) setSelectedEvents(p.selectedEvents);
        if (p.servicePricing?.length) setServices(p.servicePricing);
        toast("Profile saved successfully!", "success");
      })
      .catch(() => toast("Failed to save profile.", "error"));
  };

  const changePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = pwdForm;
    if (!currentPassword || !newPassword || !confirmPassword) { toast("Please fill in all password fields.", "warning"); return; }
    if (newPassword.length < 6) { toast("New password must be at least 6 characters.", "warning"); return; }
    if (newPassword !== confirmPassword) { toast("Passwords do not match.", "warning"); return; }
    setPwdLoading(true);
    axios.post("http://localhost:5000/api/auth/change-password", { userId, currentPassword, newPassword })
      .then(() => {
        toast("Password changed successfully!", "success");
        setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch(err => toast(err.response?.data?.message || "Failed to change password.", "error"))
      .finally(() => setPwdLoading(false));
  };

  if (loading) return <DashboardLayout role="videographer"><style>{styles}</style><p style={{ color: "var(--muted)", fontStyle: "italic" }}>Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout role="videographer">
      <style>{styles}</style>
      <div className="cp-wrap">

        <button className="back-btn" onClick={() => navigate(-1)}><span className="back-btn-arrow">←</span> Back</button>
        <div className="fc-page-header">
          <p className="fc-eyebrow">Profile Setup</p>
          <h2 className="fc-title">My Profile</h2>
        </div>

        <div className="form-section">
          <p className="form-section-title">Basic Information</p>
          <div className="fc-field"><label className="fc-label">Full Name</label><input className="fc-input" name="name" placeholder="Your name" onChange={handleChange} value={form.name} /></div>
          <div className="fc-field"><label className="fc-label">Location</label><input className="fc-input" name="location" placeholder="City, State" onChange={handleChange} value={form.location} /></div>
          <div className="fc-field"><label className="fc-label">Years of Experience</label><input className="fc-input" name="experience" placeholder="e.g. 5 years" onChange={handleChange} value={form.experience} /></div>
          <div className="fc-field"><label className="fc-label">Bio</label><textarea className="fc-textarea" name="bio" placeholder="Tell clients about yourself, your style, your passion..." onChange={handleChange} value={form.bio} /></div>
          <div className="fc-field">
            <label className="fc-label">Profile Photo</label>
            <div className={`img-upload-zone ${imagePreview ? "has-image" : ""}`}>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Profile preview" className="img-upload-preview" />
                  <div className="img-upload-change">Click to Change Photo</div>
                </>
              ) : (
                <>
                  <div className="img-upload-icon">📷</div>
                  <p className="img-upload-label">Click to upload a profile photo</p>
                  <p className="img-upload-hint">JPG, PNG or WEBP — max 5MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <p className="form-section-title">Events You Cover</p>
          <div className="chip-grid">
            {EVENT_TYPES.map(ev => (
              <div key={ev} className={`chip ${selectedEvents.includes(ev) ? "selected" : ""}`} onClick={() => toggleEvent(ev)}>{ev}</div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <p className="form-section-title">Service Pricing</p>
          <div className="service-pricing-table">
            <div className="spt-head">
              <span>Service / Package</span><span>Price (₹)</span><span></span>
            </div>
            {services.map((s, i) => (
              <div className="spt-row" key={i}>
                <div className="spt-cell"><input placeholder="e.g. Wedding Full Day" value={s.name} onChange={e => updateService(i, "name", e.target.value)} /></div>
                <div className="spt-cell"><input type="number" placeholder="0" value={s.price} onChange={e => updateService(i, "price", e.target.value)} /></div>
                <div className="spt-cell" style={{ justifyContent: "center" }}>
                  {services.length > 1 && <button className="spt-remove" onClick={() => removeService(i)}>×</button>}
                </div>
              </div>
            ))}
          </div>
          <RippleButton className="fc-btn-outline fc-btn-sm" onClick={addService} style={{ marginTop: "8px" }}>+ Add Service</RippleButton>
        </div>

        <div className="form-section">
          <p className="form-section-title">Equipment</p>
          <div className="fc-field">
            <label className="fc-label">Equipment List</label>
            <textarea className="fc-textarea" name="equipment" placeholder="e.g. Sony A7 III, DJI Ronin, Rode NTG3, DJI Mavic 3 Drone..." onChange={handleChange} value={form.equipment} style={{ minHeight: "90px" }} />
          </div>
        </div>

        <RippleButton className="fc-btn-terra fc-btn-lg" onClick={save}>{isExisting ? "Update Profile" : "Save Profile"}</RippleButton>

        {/* ── Availability Calendar ── */}
        <div className="avail-section">
          <p className="avail-title">Availability Calendar</p>
          <p className="avail-subtitle">Click dates to mark yourself as available. Click again to remove. Save when done.</p>

          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <span className="cal-month">{MONTH_NAMES[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
            <button className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="cal-grid">
            {DAY_LABELS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
            {(() => {
              const { y, m, firstDay, daysInMonth } = calDays();
              const cells = [];
              for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="cal-day cal-empty" />);
              for (let d = 1; d <= daysInMonth; d++) {
                const str = toDateStr(y, m, d);
                const isPast = str < todayStr;
                const isAvail = availableDates.includes(str);
                const isToday = str === todayStr;
                cells.push(
                  <div
                    key={str}
                    className={`cal-day ${isAvail ? "cal-available" : ""} ${isPast ? "cal-past" : ""} ${isToday ? "cal-today" : ""}`}
                    onClick={() => toggleDate(str)}
                    title={isAvail ? "Available — click to remove" : isPast ? "Past date" : "Click to mark available"}
                  >{d}</div>
                );
              }
              return cells;
            })()}
          </div>

          <div className="cal-legend">
            <div className="cal-legend-item"><div className="cal-legend-dot" style={{ background: "rgba(74,140,110,0.25)", border: "1.5px solid rgba(74,140,110,0.4)" }} />Available</div>
            <div className="cal-legend-item"><div className="cal-legend-dot" style={{ background: "var(--surface2)", border: "1.5px solid var(--border)" }} />Not set</div>
            <div className="cal-legend-item"><div className="cal-legend-dot" style={{ border: "1.5px solid var(--violet)", background: "transparent" }} />Today</div>
          </div>

          {availableDates.length > 0 && (
            <p className="avail-count">✓ {availableDates.filter(d => d >= todayStr).length} upcoming date{availableDates.filter(d => d >= todayStr).length !== 1 ? "s" : ""} marked available</p>
          )}

          <RippleButton className="fc-btn-primary fc-btn-sm" onClick={saveAvailability} style={{ marginTop: "16px" }}>
            Save Availability
          </RippleButton>
        </div>

        <div className="pwd-section">
          <p className="pwd-section-title">Change Password</p>
          <div className="fc-field">
            <label className="fc-label">Current Password</label>
            <input className="fc-input" type="password" placeholder="••••••••" value={pwdForm.currentPassword} onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
          </div>
          <div className="pwd-row">
            <div className="fc-field">
              <label className="fc-label">New Password</label>
              <input className="fc-input" type="password" placeholder="••••••••" value={pwdForm.newPassword} onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
            </div>
            <div className="fc-field">
              <label className="fc-label">Confirm New Password</label>
              <input className="fc-input" type="password" placeholder="••••••••" value={pwdForm.confirmPassword} onChange={e => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} />
            </div>
          </div>
          <RippleButton className="fc-btn-outline fc-btn-sm" onClick={changePassword} disabled={pwdLoading}>
            {pwdLoading ? "Updating…" : "Change Password"}
          </RippleButton>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default CreateProfile;