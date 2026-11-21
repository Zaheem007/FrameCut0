import { GLOBAL_CSS } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .footer { background: var(--surface); border-top: 1.5px solid var(--border); padding: 28px 48px; font-family: var(--ff-ui); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
  .footer-brand { display: flex; align-items: center; gap: 10px; }
  .footer-logo-svg { width: 28px; height: 28px; }
  .footer-brand-name { font-family: var(--ff-display); font-size: 15px; font-weight: 700; color: var(--plum); }
  .footer-copy { font-size: 11.5px; color: var(--border2); font-weight: 300; }
  .footer-copy span { color: var(--muted); }
  .footer-stack { font-size: 10px; color: var(--border2); letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; }
`;

const LogoSVG = () => (
  <svg className="footer-logo-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="footer">
        <div className="footer-brand"><LogoSVG /><span className="footer-brand-name">FrameCut</span></div>
        <p className="footer-copy">© 2025 <span>FrameCut</span> — All rights reserved</p>
        <p className="footer-stack">MERN Stack</p>
      </footer>
    </>
  );
}

export default Footer;