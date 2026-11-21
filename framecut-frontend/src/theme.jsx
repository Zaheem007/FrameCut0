import { useState, useEffect } from "react";

// ─── FrameCut Design System ───────────────────────────────────────────────────

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Epilogue:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #f2edf7;
    --bg2:       #ece5f5;
    --surface:   #faf7fd;
    --surface2:  #f5f0fa;
    --border:    #ddd4ec;
    --border2:   #cfc3e0;
    --plum:      #3d1f4e;
    --plum2:     #2a1436;
    --violet:    #7c5c9e;
    --violet2:   #9b7dbf;
    --terra:     #c47a52;
    --terra2:    #a8613e;
    --muted:     #8a7a9a;
    --muted2:    #6b5c7a;
    --green:     #4a8c6e;
    --red:       #b84040;
    --amber:     #b07830;
    --ff-display: 'Playfair Display', Georgia, serif;
    --ff-ui:      'Epilogue', sans-serif;
    --radius:    4px;
    --shadow-sm: 0 2px 8px rgba(61,31,78,0.07);
    --shadow-md: 0 4px 20px rgba(61,31,78,0.1);
    --shadow-lg: 0 8px 40px rgba(61,31,78,0.13);
  }

  body {
    background: var(--bg);
    color: var(--plum);
    font-family: var(--ff-ui);
    -webkit-font-smoothing: antialiased;
  }

  #fc-toast-root {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .fc-toast {
    pointer-events: all;
    min-width: 280px;
    max-width: 380px;
    padding: 14px 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 4px solid var(--violet);
    box-shadow: var(--shadow-lg);
    font-family: var(--ff-ui);
    font-size: 13.5px;
    font-weight: 400;
    color: var(--plum);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
    position: relative;
    overflow: hidden;
  }

  .fc-toast.success { border-left-color: var(--green); }
  .fc-toast.error   { border-left-color: var(--red); }
  .fc-toast.warning { border-left-color: var(--amber); }

  .fc-toast-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .fc-toast-body { flex: 1; }
  .fc-toast-title { font-weight: 600; font-size: 13px; margin-bottom: 2px; }
  .fc-toast-msg   { font-weight: 300; font-size: 12.5px; color: var(--muted); line-height: 1.5; }

  .fc-toast-close {
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 16px; line-height: 1;
    padding: 0; flex-shrink: 0; transition: color 0.2s;
  }
  .fc-toast-close:hover { color: var(--plum); }

  .fc-toast-progress {
    position: absolute; bottom: 0; left: 0; height: 2px;
    background: var(--violet); animation: toastBar 3.5s linear forwards;
  }
  .fc-toast.success .fc-toast-progress { background: var(--green); }
  .fc-toast.error   .fc-toast-progress { background: var(--red); }
  .fc-toast.warning .fc-toast-progress { background: var(--amber); }

  .fc-toast.leaving { animation: toastOut 0.25s ease forwards; }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(60px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateX(0) scale(1); max-height: 120px; margin-bottom: 10px; }
    to   { opacity: 0; transform: translateX(60px) scale(0.9); max-height: 0; margin-bottom: 0; padding: 0; }
  }
  @keyframes toastBar {
    from { width: 100%; }
    to   { width: 0%; }
  }

  .fc-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 26px;
    font-family: var(--ff-ui); font-size: 12px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
    border: none; cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.2s;
    -webkit-tap-highlight-color: transparent;
    border-radius: var(--radius);
  }
  .fc-btn:active { transform: scale(0.97) !important; }

  .fc-btn-primary { background: var(--plum); color: var(--bg); box-shadow: 0 2px 10px rgba(61,31,78,0.25); }
  .fc-btn-primary:hover { background: var(--plum2); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(61,31,78,0.3); }

  .fc-btn-terra { background: var(--terra); color: #fff; box-shadow: 0 2px 10px rgba(196,122,82,0.3); }
  .fc-btn-terra:hover { background: var(--terra2); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(196,122,82,0.35); }

  .fc-btn-outline { background: transparent; color: var(--plum); border: 1.5px solid var(--border2); }
  .fc-btn-outline:hover { border-color: var(--violet); color: var(--violet); background: rgba(124,92,158,0.05); transform: translateY(-1px); }

  .fc-btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .fc-btn-ghost:hover { color: var(--plum); border-color: var(--border2); background: var(--surface2); }

  .fc-btn-danger { background: transparent; color: var(--red); border: 1px solid rgba(184,64,64,0.3); }
  .fc-btn-danger:hover { background: rgba(184,64,64,0.06); border-color: rgba(184,64,64,0.5); }

  .fc-btn-sm { padding: 7px 16px; font-size: 10.5px; }
  .fc-btn-lg { padding: 14px 36px; font-size: 13px; }
  .fc-btn-full { width: 100%; }

  .fc-ripple {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
  @keyframes ripple { to { transform: scale(4); opacity: 0; } }

  .fc-field { margin-bottom: 20px; }
  .fc-label { display: block; font-size: 10.5px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 7px; }

  .fc-input, .fc-textarea, .fc-select {
    width: 100%; background: var(--surface); border: 1.5px solid var(--border);
    color: var(--plum); padding: 11px 14px;
    font-family: var(--ff-ui); font-size: 13.5px; font-weight: 300;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    border-radius: var(--radius);
  }
  .fc-input::placeholder, .fc-textarea::placeholder { color: #c4bace; }
  .fc-input:focus, .fc-textarea:focus, .fc-select:focus { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(124,92,158,0.12); }
  .fc-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
  .fc-select { appearance: none; cursor: pointer; }

  .fc-page-header { padding-bottom: 28px; border-bottom: 1px solid var(--border); margin-bottom: 36px; }
  .fc-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--violet); margin-bottom: 8px; }
  .fc-title { font-family: var(--ff-display); font-size: 34px; font-weight: 600; color: var(--plum); letter-spacing: -0.01em; margin: 0; }
  .fc-subtitle { margin-top: 6px; font-size: 13px; color: var(--muted); font-weight: 300; }

  .fc-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s; }
  .fc-card:hover { border-color: var(--border2); box-shadow: var(--shadow-md); }

  .fc-section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .fc-section-label { font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
  .fc-section-line { flex: 1; height: 1px; background: var(--border); }
  .fc-section-count { font-size: 10px; color: var(--border2); letter-spacing: 0.08em; }

  .fc-badge { display: inline-block; padding: 3px 9px; border-radius: 99px; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .fc-badge-approved { background: rgba(74,140,110,0.1); color: var(--green); border: 1px solid rgba(74,140,110,0.25); }
  .fc-badge-rejected { background: rgba(184,64,64,0.08); color: var(--red); border: 1px solid rgba(184,64,64,0.2); }
  .fc-badge-pending  { background: rgba(176,120,48,0.1); color: var(--amber); border: 1px solid rgba(176,120,48,0.25); }

  .fc-empty { text-align: center; padding: 60px 20px; color: var(--border2); font-family: var(--ff-display); font-style: italic; font-size: 15px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-fadeup { animation: fadeUp 0.45s ease forwards; opacity: 0; }
  .anim-d1 { animation-delay: 0.05s; }
  .anim-d2 { animation-delay: 0.1s; }
  .anim-d3 { animation-delay: 0.15s; }
  .anim-d4 { animation-delay: 0.2s; }
  .anim-d5 { animation-delay: 0.25s; }
  .anim-d6 { animation-delay: 0.3s; }
`;

// ─── Toast API ────────────────────────────────────────────────────────────────
let _mountToast = null;
export function setToastMount(fn) { _mountToast = fn; }

export function toast(msg, type = "info", title = "") {
  if (_mountToast) _mountToast({ msg, type, title });
}

// ─── Ripple Button ────────────────────────────────────────────────────────────
export function RippleButton({ children, className = "", onClick, type = "button", disabled = false, style }) {
  const handleClick = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.className = "fc-ripple";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
    if (onClick) onClick(e);
  };

  return (
    <button type={type} className={`fc-btn ${className}`} onClick={handleClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}

// ─── Toast Provider ───────────────────────────────────────────────────────────
export function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setToastMount(({ msg, type, title }) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, msg, type, title }]);
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 260);
      }, 3500);
    });
  }, []);

  const icons  = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };
  const titles = { success: "Success", error: "Error", warning: "Warning", info: "Notice" };
  return (
    <div id="fc-toast-root">
      {toasts.map(t => (
        <div key={t.id} className={`fc-toast ${t.type || "info"} ${t.leaving ? "leaving" : ""}`}>
          <span className="fc-toast-icon">{icons[t.type] || icons.info}</span>
          <div className="fc-toast-body">
            <div className="fc-toast-title">{t.title || titles[t.type] || titles.info}</div>
            <div className="fc-toast-msg">{t.msg}</div>
          </div>
          <button className="fc-toast-close" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>×</button>
          <div className="fc-toast-progress" />
        </div>
      ))}
    </div>
  );
}