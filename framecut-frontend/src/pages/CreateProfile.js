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