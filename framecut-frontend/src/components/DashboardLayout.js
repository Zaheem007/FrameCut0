import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GLOBAL_CSS, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}

  .layout { display: flex; min-height: 100vh; background: var(--bg); }

  /* ── Sidebar ── */
  .sidebar {
    width: 232px; min-height: 100vh; background: var(--surface);
    border-right: 1.5px solid var(--border);
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh; flex-shrink: 0;
    transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }
  .sidebar.collapsed { width: 64px; }

  /* ── Toggle button ── */
  .sb-toggle {
    position: absolute; top: 20px; right: -13px; z-index: 10;
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--surface); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: var(--shadow-sm);
    transition: background 0.2s, transform 0.28s cubic-bezier(0.4,0,0.2,1);
    flex-shrink: 0;
  }
  .sb-toggle:hover { background: var(--plum); color: var(--bg); border-color: var(--plum); }
  .sb-toggle-icon { font-size: 11px; color: var(--muted); transition: color 0.2s; line-height: 1; }
  .sb-toggle:hover .sb-toggle-icon { color: var(--bg); }
  .sidebar.collapsed .sb-toggle { transform: rotate(180deg); right: -13px; }

  /* ── Logo ── */
  .sb-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 28px 15px 36px;
    white-space: nowrap; overflow: hidden;
    flex-shrink: 0;
  }
  .sb-logo-svg { width: 34px; height: 34px; flex-shrink: 0; }
  .sb-logo-name {
    font-family: var(--ff-display); font-size: 17px; font-weight: 700; color: var(--plum);
    opacity: 1; transition: opacity 0.2s, width 0.28s;
    overflow: hidden; white-space: nowrap;
  }
  .sidebar.collapsed .sb-logo-name { opacity: 0; width: 0; }

  /* ── Section label ── */
  .sb-section {
    font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--border2); padding: 0 20px; margin-bottom: 8px;
    white-space: nowrap; overflow: hidden;
    opacity: 1; transition: opacity 0.2s;
    flex-shrink: 0;
  }
  .sidebar.collapsed .sb-section { opacity: 0; }

  /* ── Nav links ── */
  .sb-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 8px; flex: 1; overflow: hidden; }
  .sb-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; font-size: 13px; font-weight: 400;
    color: var(--muted); text-decoration: none;
    border-radius: var(--radius); transition: color 0.2s, background 0.2s;
    position: relative; white-space: nowrap; overflow: hidden;
  }
  .sb-link:hover { color: var(--plum); background: var(--bg2); }
  .sb-link.active { color: var(--violet); background: rgba(124,92,158,0.1); font-weight: 600; }
  .sb-link.active::before {
    content: ''; position: absolute; left: 0; top: 25%; bottom: 25%;
    width: 3px; background: var(--violet); border-radius: 0 3px 3px 0;
  }
  .sb-link-icon { font-size: 15px; opacity: 0.75; flex-shrink: 0; }
  .sb-link-label {
    opacity: 1; transition: opacity 0.2s;
    overflow: hidden; white-space: nowrap;
  }
  .sidebar.collapsed .sb-link-label { opacity: 0; width: 0; }

  /* Tooltip on collapsed */
  .sidebar.collapsed .sb-link { justify-content: center; }
  .sidebar.collapsed .sb-link::after {
    content: attr(data-label);
    position: absolute; left: 58px; top: 50%; transform: translateY(-50%);
    background: var(--plum); color: var(--bg);
    font-size: 11.5px; font-weight: 600; padding: 5px 10px;
    border-radius: 6px; white-space: nowrap;
    opacity: 0; pointer-events: none;
    transition: opacity 0.15s; z-index: 100;
    box-shadow: var(--shadow-md);
  }
  .sidebar.collapsed .sb-link:hover::after { opacity: 1; }

  /* ── Footer / logout ── */
  .sb-footer { padding: 16px 8px 20px; border-top: 1.5px solid var(--border); flex-shrink: 0; overflow: hidden; }
  .sb-logout {
    width: 100%; padding: 10px 12px; background: transparent; color: var(--muted);
    border: 1.5px solid var(--border); font-family: var(--ff-ui); font-size: 11px;
    font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; border-radius: var(--radius); transition: all 0.2s;
    display: flex; align-items: center; gap: 8px; white-space: nowrap; overflow: hidden;
  }
  .sb-logout:hover { color: var(--red); border-color: rgba(184,64,64,0.35); background: rgba(184,64,64,0.04); }
  .sb-logout-icon { flex-shrink: 0; font-size: 14px; }
  .sb-logout-label { opacity: 1; transition: opacity 0.2s; }
  .sidebar.collapsed .sb-logout { justify-content: center; padding: 10px 0; }
  .sidebar.collapsed .sb-logout-label { opacity: 0; width: 0; overflow: hidden; }
  .sidebar.collapsed .sb-logout::after {
    content: 'Logout';
    position: absolute; left: 58px; top: 50%; transform: translateY(-50%);
    background: var(--red); color: #fff;
    font-size: 11.5px; font-weight: 600; padding: 5px 10px;
    border-radius: 6px; white-space: nowrap;
    opacity: 0; pointer-events: none;
    transition: opacity 0.15s; z-index: 100;
    box-shadow: var(--shadow-md);
  }
  .sidebar.collapsed .sb-logout:hover::after { opacity: 1; }
  .sb-footer { position: relative; }

  /* ── Main content ── */
  .layout-main {
    flex: 1; padding: 48px 52px; min-height: 100vh; overflow-y: auto;
    transition: padding 0.28s;
  }

  @media (max-width: 768px) {
    .sidebar { width: 64px; }
    .sb-logo-name, .sb-link-label, .sb-section, .sb-logout-label { opacity: 0; width: 0; }
    .layout-main { padding: 32px 20px; }
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
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.clear();
    toast("Signed out successfully.", "info", "Goodbye");
    setTimeout(() => { window.location.href = "/"; }, 600);
  };

  const clientLinks = [
    { to: "/client",        label: "Dashboard",   icon: "◈" },
    { to: "/videographers", label: "Browse",       icon: "▶" },
    { to: "/home",          label: "My Bookings",  icon: "◷" },
  ];
  const videographerLinks = [
    { to: "/videographer",   label: "Dashboard",  icon: "◈" },
    { to: "/create-profile", label: "My Profile", icon: "◉" },
    { to: "/portfolio",      label: "Portfolio",  icon: "▣" },
  ];
  const links = role === "client" ? clientLinks : videographerLinks;

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

          {/* Toggle button */}
          <button className="sb-toggle" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <span className="sb-toggle-icon">◀</span>
          </button>

          {/* Logo */}
          <div className="sb-logo">
            <LogoSVG />
            <span className="sb-logo-name">FrameCut</span>
          </div>

          {/* Nav section label */}
          <p className="sb-section">Navigation</p>

          {/* Nav links */}
          <nav className="sb-nav">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                data-label={l.label}
                className={`sb-link ${location.pathname === l.to ? "active" : ""}`}
              >
                <span className="sb-link-icon">{l.icon}</span>
                <span className="sb-link-label">{l.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="sb-footer">
            <button className="sb-logout" onClick={logout}>
              <span className="sb-logout-icon">↪</span>
              <span className="sb-logout-label">Logout</span>
            </button>
          </div>

        </aside>

        <main className="layout-main">{children}</main>
      </div>
    </>
  );
}

export default DashboardLayout;