import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .login-page { min-height: 100vh; display: flex; font-family: var(--ff-ui); }

  .login-panel {
    flex: 1; background: var(--plum);
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 52px 56px; position: relative; overflow: hidden;
  }
  .login-panel::before {
    content: ''; position: absolute; top: -100px; right: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(124,92,158,0.4) 0%, transparent 65%);
    pointer-events: none;
  }
  .login-panel::after {
    content: ''; position: absolute; bottom: -80px; left: -80px;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(196,122,82,0.2) 0%, transparent 65%);
    pointer-events: none;
  }

  .lp-brand { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
  .lp-logo-svg { width: 44px; height: 44px; flex-shrink: 0; }
  .lp-brand-name { font-family: var(--ff-display); font-size: 22px; font-weight: 700; color: var(--bg); letter-spacing: 0.02em; }

  .lp-quote { position: relative; z-index: 1; }
  .lp-quote p { font-family: var(--ff-display); font-size: 38px; font-weight: 400; color: rgba(242,237,247,0.88); line-height: 1.25; max-width: 340px; font-style: italic; }
  .lp-quote span { display: block; margin-top: 20px; font-size: 10.5px; font-weight: 600; color: var(--violet2); letter-spacing: 0.2em; text-transform: uppercase; }

  .login-form-side {
    width: 460px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; padding: 60px 56px;
  }
  .login-form-wrap { width: 100%; animation: fadeUp 0.5s ease forwards; }
  .lf-heading { font-family: var(--ff-display); font-size: 36px; font-weight: 600; color: var(--plum); margin-bottom: 6px; }
  .lf-sub { font-size: 13px; color: var(--muted); font-weight: 300; margin-bottom: 40px; }
  .lf-divider { height: 1px; background: var(--border); margin: 28px 0; }
  .lf-footer { font-size: 13px; color: var(--muted); text-align: center; font-weight: 300; }
  .lf-footer a { color: var(--violet); text-decoration: none; font-weight: 600; }
  .lf-footer a:hover { color: var(--terra); }

  @media (max-width: 820px) {
    .login-panel { display: none; }
    .login-form-side { width: 100%; padding: 48px 32px; }
  }
`;

const LogoSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="36" height="36" rx="7" fill="rgba(255,255,255,0.15)"/>
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

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const login = () => {
    if (!form.email || !form.password) { toast("Please fill in all fields.", "warning"); return; }
    setLoading(true);
    axios.post("http://localhost:5000/api/auth/login", form)
      .then(res => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("name", res.data.name);
        toast(`Welcome back, ${res.data.name?.split(" ")[0] || "there"}!`, "success");
        setTimeout(() => {
          if (res.data.role === "admin") navigate("/admin");
          else if (res.data.role === "client") navigate("/client");
          else navigate("/videographer");
        }, 500);
      })
      .catch(err => { toast(err.response?.data?.message || "Login failed.", "error"); setLoading(false); });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <div className="login-panel">
          <div className="lp-brand">
            <LogoSVG className="lp-logo-svg" />
            <span className="lp-brand-name">FrameCut</span>
          </div>
          <div className="lp-quote">
            <p>Every great story deserves a great frame.</p>
            <span>Videographer Booking Platform</span>
          </div>
        </div>
        <div className="login-form-side">
          <div className="login-form-wrap">
            <h2 className="lf-heading">Welcome back</h2>
            <p className="lf-sub">Sign in to your account to continue</p>
            <div className="fc-field">
              <label className="fc-label">Email Address</label>
              <input className="fc-input" name="email" placeholder="you@example.com" onChange={handleChange} />
            </div>
            <div className="fc-field">
              <label className="fc-label">Password</label>
              <input className="fc-input" type="password" name="password" placeholder="••••••••" onChange={handleChange} onKeyDown={e => e.key === "Enter" && login()} />
            </div>
            <RippleButton className="fc-btn-primary fc-btn-lg fc-btn-full" onClick={login} disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </RippleButton>
            <div className="lf-divider" />
            <p className="lf-footer">Don't have an account? <Link to="/register">Create one</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;