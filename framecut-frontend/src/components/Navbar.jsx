import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}

  .navbar {
    position: sticky; top: 0; z-index: 200;
    background: rgba(242,237,247,0.94);
    backdrop-filter: blur(14px);
    border-bottom: 1.5px solid var(--border);
    font-family: var(--ff-ui);
    transition: box-shadow 0.3s;
  }
  .navbar.scrolled { box-shadow: var(--shadow-md); }

  .navbar-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 64px;
  }

  .navbar-brand {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; transition: opacity 0.2s;
  }
  .navbar-brand:hover { opacity: 0.82; }

  .navbar-logo-svg { width: 38px; height: 38px; flex-shrink: 0; }
  .navbar-brand-name {
    font-family: var(--ff-display); font-size: 19px; font-weight: 700;
    color: var(--plum); letter-spacing: 0.01em;
  }

  .navbar-desktop { display: flex; align-items: center; gap: 8px; }

  .navbar-hamburger {
    display: none; flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer; padding: 8px;
  }
  .navbar-hamburger span {
    display: block; width: 22px; height: 2px; background: var(--plum);
    border-radius: 2px; transition: all 0.3s ease; transform-origin: center;
  }
  .navbar-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .navbar-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .navbar-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

  .navbar-mobile {
    overflow: hidden; max-height: 0;
    transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
    opacity: 0; border-top: 1.5px solid transparent;
    background: var(--surface);
  }
  .navbar-mobile.open { max-height: 400px; opacity: 1; border-top-color: var(--border); }
  .navbar-mobile-inner { padding: 16px 24px 20px; display: flex; flex-direction: column; gap: 4px; }
  .navbar-mobile-link {
    display: block; padding: 10px 14px; color: var(--muted); font-size: 13.5px;
    font-weight: 500; text-decoration: none; border-radius: var(--radius);
    transition: background 0.2s, color 0.2s;
  }
  .navbar-mobile-link:hover { background: var(--bg2); color: var(--plum); }
  .navbar-mobile-link.active { color: var(--violet); background: rgba(124,92,158,0.08); }

  @media (max-width: 768px) {
    .navbar-desktop { display: none; }
    .navbar-hamburger { display: flex; }
    .navbar-inner { padding: 0 20px; }
  }
`;

// Custom FrameCut logo — film frame with aperture lens
const LogoSVG = () => (
  <svg className="navbar-logo-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast("You've been signed out.", "info", "Goodbye");
    setTimeout(() => navigate("/"), 600);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{styles}</style>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <LogoSVG />
            <span className="navbar-brand-name">FrameCut</span>
          </Link>

          <div className="navbar-desktop">
            <Link to="/videographers" style={{ textDecoration: "none" }}>
              <RippleButton className="fc-btn-ghost fc-btn-sm">Browse</RippleButton>
            </Link>
            {!role && <>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <RippleButton className="fc-btn-outline fc-btn-sm">Register</RippleButton>
              </Link>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <RippleButton className="fc-btn-primary fc-btn-sm">Sign In</RippleButton>
              </Link>
            </>}
            {role && <>
              {role === "admin" && <Link to="/admin" style={{ textDecoration: "none" }}><RippleButton className="fc-btn-ghost fc-btn-sm">Admin</RippleButton></Link>}
              {role === "client" && <Link to="/client" style={{ textDecoration: "none" }}><RippleButton className="fc-btn-ghost fc-btn-sm">Dashboard</RippleButton></Link>}
              {role === "videographer" && <Link to="/videographer" style={{ textDecoration: "none" }}><RippleButton className="fc-btn-ghost fc-btn-sm">Dashboard</RippleButton></Link>}
              <RippleButton className="fc-btn-danger fc-btn-sm" onClick={logout}>Logout</RippleButton>
            </>}
          </div>

          <button className={`navbar-hamburger ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>

        <div className={`navbar-mobile ${open ? "open" : ""}`}>
          <div className="navbar-mobile-inner">
            <Link to="/videographers" className={`navbar-mobile-link ${isActive("/videographers") ? "active" : ""}`}>Browse Videographers</Link>
            {!role && <>
              <Link to="/register" className="navbar-mobile-link">Register</Link>
              <Link to="/login" className="navbar-mobile-link">Sign In</Link>
            </>}
            {role && <>
              {role === "admin" && <Link to="/admin" className={`navbar-mobile-link ${isActive("/admin") ? "active" : ""}`}>Admin Dashboard</Link>}
              {role === "client" && <Link to="/client" className={`navbar-mobile-link ${isActive("/client") ? "active" : ""}`}>Dashboard</Link>}
              {role === "videographer" && <Link to="/videographer" className={`navbar-mobile-link ${isActive("/videographer") ? "active" : ""}`}>Dashboard</Link>}
              <button onClick={logout} style={{ all: "unset", cursor: "pointer" }} className="navbar-mobile-link">Logout</button>
            </>}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;