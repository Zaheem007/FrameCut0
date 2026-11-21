import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .reg-page { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 60px 24px; font-family: var(--ff-ui); }
  .reg-card { width: 100%; max-width: 440px; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-md); padding: 48px 44px; animation: fadeUp 0.5s ease forwards; }
  .reg-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
  .reg-logo-svg { width: 34px; height: 34px; }
  .reg-logo-name { font-family: var(--ff-display); font-size: 19px; font-weight: 700; color: var(--plum); }
  .reg-heading { font-family: var(--ff-display); font-size: 30px; font-weight: 600; color: var(--plum); margin-bottom: 4px; }
  .reg-sub { font-size: 13px; color: var(--muted); font-weight: 300; margin-bottom: 36px; }
  .role-label { font-size: 10.5px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em; display: block; margin-bottom: 10px; }
  .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 28px; }
  .role-opt { padding: 12px 10px; background: var(--surface2); border: 1.5px solid var(--border); color: var(--muted); font-family: var(--ff-ui); font-size: 12.5px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; text-align: center; border-radius: var(--radius); transition: all 0.2s; }
  .role-opt.active { background: rgba(61,31,78,0.08); border-color: var(--plum); color: var(--plum); font-weight: 600; }
  .role-opt:hover:not(.active) { border-color: var(--violet); color: var(--violet); }
  .reg-divider { height: 1px; background: var(--border); margin: 24px 0; }
  .reg-footer { font-size: 13px; color: var(--muted); text-align: center; font-weight: 300; }
  .reg-footer a { color: var(--violet); text-decoration: none; font-weight: 600; }
`;

const LogoSVG = () => (
  <svg className="reg-logo-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="36" height="36" rx="7" fill="#3d1f4e"/>
    <rect x="5" y="8" width="4" height="5" rx="1" fill="#c47a52"/>
    <rect x="5" y="16" width="4" height="5" rx="1" fill="#c47a52"/>
    <rect x="5" y="24" width="4" height="5" rx="1" fill="#c47a52"/>
    <rect x="29" y="8" width="4" height="5" rx="1" fill="#c47a52"/>
    <rect x="29" y="16" width="4" height="5" rx="1" fill="#c47a52"/>
    <rect x="29" y="24" width="4" height="5" rx="1" fill="#c47a52"/>
    <rect x="11" y="7" width="16" height="24" rx="2" stroke="#f2edf7" strokeWidth="1.5"/>
    <circle cx="19" cy="19" r="5" stroke="#f2edf7" strokeWidth="1.5"/>
    <circle cx="19" cy="19" r="2" fill="#c47a52"/>
    <line x1="15" y1="15" x2="23" y2="23" stroke="#f2edf7" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
  useEffect(() => { localStorage.clear(); }, []);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setRole = (role) => setForm({ ...form, role });

  const register = () => {
    if (!form.name || !form.email || !form.password) { toast("Please fill in all fields.", "warning"); return; }
    axios.post("https://framecut-rqms.onrender.com/api/auth/register", form)
      .then(() => { toast("Account created! Please sign in.", "success", "Welcome"); setTimeout(() => navigate("/"), 800); })
      .catch(err => toast(err.response?.data?.message || "Registration failed.", "error"));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="reg-page">
        <div className="reg-card">
          <div className="reg-logo"><LogoSVG /><span className="reg-logo-name">FrameCut</span></div>
          <h2 className="reg-heading">Create account</h2>
          <p className="reg-sub">Join the platform to get started</p>
          <div className="fc-field"><label className="fc-label">Full Name</label><input className="fc-input" name="name" placeholder="Your name" onChange={handleChange} /></div>
          <div className="fc-field"><label className="fc-label">Email Address</label><input className="fc-input" name="email" placeholder="you@example.com" onChange={handleChange} /></div>
          <div className="fc-field"><label className="fc-label">Password</label><input type="password" className="fc-input" name="password" placeholder="••••••••" onChange={handleChange} /></div>
          <span className="role-label">I am a</span>
          <div className="role-grid">
            <div className={`role-opt ${form.role === "client" ? "active" : ""}`} onClick={() => setRole("client")}>Client</div>
            <div className={`role-opt ${form.role === "videographer" ? "active" : ""}`} onClick={() => setRole("videographer")}>Videographer</div>
          </div>
          <RippleButton className="fc-btn-primary fc-btn-full fc-btn-lg" onClick={register}>Create Account</RippleButton>
          <div className="reg-divider" />
          <p className="reg-footer">Already have an account? <Link to="/">Sign in</Link></p>
        </div>
      </div>
    </>
  );
}

export default Register;