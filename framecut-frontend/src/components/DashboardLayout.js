import { Link, useLocation } from "react-router-dom";
import { GLOBAL_CSS, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}

  .layout { display: flex; min-height: 100vh; background: var(--bg); }

  .sidebar {
    width: 232px; min-height: 100vh; background: var(--surface);
    border-right: 1.5px solid var(--border);
    display: flex; flex-direction: column; padding: 32px 0;
    position: sticky; top: 0; height: 100vh; flex-shrink: 0;
  }

  .sb-logo { display: flex; align-items: center; gap: 10px; padding: 0 22px; margin-bottom: 44px; }
  .sb-logo-svg { width: 34px; height: 34px; flex-shrink: 0; }
  .sb-logo-name { font-family: var(--ff-display); font-size: 17px; font-weight: 700; color: var(--plum); }

  .sb-section { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--border2); padding: 0 22px; margin-bottom: 8px; }

  .sb-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 10px; flex: 1; }
  .sb-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; font-size: 13px; font-weight: 400;
    color: var(--muted); text-decoration: none;
    border-radius: var(--radius); transition: color 0.2s, background 0.2s; position: relative;
  }
  .sb-link:hover { color: var(--plum); background: var(--bg2); }
  .sb-link.active { color: var(--violet); background: rgba(124,92,158,0.1); font-weight: 600; }
  .sb-link.active::before {
    content: ''; position: absolute; left: 0; top: 25%; bottom: 25%;
    width: 3px; background: var(--violet); border-radius: 0 3px 3px 0;
  }
  .sb-link-icon { font-size: 14px; opacity: 0.7; flex-shrink: 0; }

  .sb-footer { padding: 16px 10px 0; margin: 0 10px; border-top: 1.5px solid var(--border); }
  .sb-logout {
    width: 100%; padding: 10px 12px; background: transparent; color: var(--muted);
    border: 1.5px solid var(--border); font-family: var(--ff-ui); font-size: 11px;
    font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; border-radius: var(--radius); transition: all 0.2s;
    text-align: left; display: flex; align-items: center; gap: 8px;
  }
  .sb-logout:hover { color: var(--red); border-color: rgba(184,64,64,0.35); background: rgba(184,64,64,0.04); }

  .layout-main { flex: 1; padding: 48px 52px; min-height: 100vh; overflow-y: auto; }

  @media (max-width: 900px) {
    .sidebar { width: 200px; }
    .layout-main { padding: 36px 28px; }
  }
`;

const LogoSVG = () => (
  <svg className="sb-logo-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function DashboardLayout({ children, role }) {
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    toast("Signed out successfully.", "info", "Goodbye");
    setTimeout(() => { window.location.href = "/"; }, 600);
  };

  const clientLinks = [
    { to: "/client", label: "Dashboard", icon: "◈" },
    { to: "/videographers", label: "Browse", icon: "▶" },
    { to: "/home", label: "My Bookings", icon: "◷" },
  ];
  const videographerLinks = [
    { to: "/videographer", label: "Dashboard", icon: "◈" },
    { to: "/create-profile", label: "My Profile", icon: "◉" },
    { to: "/portfolio", label: "Portfolio", icon: "▣" },
  ];
  const links = role === "client" ? clientLinks : videographerLinks;

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sb-logo">
            <LogoSVG />
            <span className="sb-logo-name">FrameCut</span>
          </div>
          <p className="sb-section">Navigation</p>
          <nav className="sb-nav">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`sb-link ${location.pathname === l.to ? "active" : ""}`}>
                <span className="sb-link-icon">{l.icon}</span>{l.label}
              </Link>
            ))}
          </nav>
          <div className="sb-footer">
            <button className="sb-logout" onClick={logout}>↪ Logout</button>
          </div>
        </aside>
        <main className="layout-main">{children}</main>
      </div>
    </>
  );
}

export default DashboardLayout;