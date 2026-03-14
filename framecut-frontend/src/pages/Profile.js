import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .profile-page { min-height: 100vh; background: var(--bg); padding: 52px 40px; font-family: var(--ff-ui); }
  .profile-inner { max-width: 900px; margin: 0 auto; }

  .back-link { font-size: 11px; font-weight: 600; color: var(--muted); text-decoration: none; letter-spacing: 0.12em; text-transform: uppercase; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 36px; transition: color 0.2s; }
  .back-link:hover { color: var(--violet); }

  .profile-hero { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 32px 36px; display: flex; gap: 32px; margin-bottom: 28px; box-shadow: var(--shadow-sm); }
  .ph-img { width: 120px; height: 120px; object-fit: cover; border-radius: 6px; flex-shrink: 0; border: 1.5px solid var(--border); }
  .ph-img-ph { width: 120px; height: 120px; background: var(--bg2); border: 1.5px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ph-img-ph svg { width: 36px; height: 36px; opacity: 0.18; }

  .ph-info { flex: 1; }
  .ph-eyebrow { font-size: 9.5px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--violet); margin-bottom: 6px; }
  .ph-name { font-family: var(--ff-display); font-size: 32px; font-weight: 600; color: var(--plum); margin-bottom: 14px; }
  .ph-meta { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 14px; }
  .ph-meta-item { font-size: 12.5px; color: var(--muted); font-weight: 300; display: flex; align-items: center; gap: 5px; }
  .ph-meta-price { color: var(--terra); font-weight: 600; font-size: 13px; }
  .ph-bio { font-size: 13.5px; color: var(--muted2); font-weight: 300; line-height: 1.75; margin-bottom: 20px; white-space: pre-wrap; word-break: break-word; }

  .ph-events { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
  .ph-event-chip { padding: 3px 10px; background: rgba(124,92,158,0.08); border: 1px solid rgba(124,92,158,0.2); color: var(--violet); border-radius: 99px; font-size: 10.5px; font-weight: 600; }

  .ph-equipment { background: var(--bg2); border-radius: var(--radius); padding: 12px 14px; margin-bottom: 20px; }
  .ph-equipment-label { font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
  .ph-equipment-text { font-size: 12.5px; color: var(--muted2); font-weight: 300; line-height: 1.6; }

  .btn-book-disabled { padding: 12px 26px; background: var(--bg2); color: var(--border2); border: 1.5px solid var(--border); border-radius: var(--radius); font-size: 11.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: not-allowed; display: inline-block; }

  .profile-section { margin-bottom: 44px; }

  .pricing-table { border: 1.5px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--surface); }
  .pt-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border); }
  .pt-row:last-child { border-bottom: none; }
  .pt-name { font-size: 14px; font-weight: 400; color: var(--plum); }
  .pt-price { font-size: 15px; font-weight: 700; color: var(--terra); font-family: var(--ff-display); }

  .portfolio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
  .port-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 18px 20px; box-shadow: var(--shadow-sm); transition: border-color 0.2s, transform 0.2s; }
  .port-card:hover { border-color: var(--violet); transform: translateY(-2px); }
  .port-title { font-family: var(--ff-display); font-size: 15px; font-weight: 600; color: var(--plum); margin-bottom: 5px; }
  .port-desc { font-size: 12px; color: var(--muted); font-weight: 300; margin-bottom: 12px; line-height: 1.6; }
  .port-link { font-size: 10.5px; color: var(--terra); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; transition: color 0.2s; }
  .port-link:hover { color: var(--terra2); }

  /* Review form */
  .avg-rating-bar { display: flex; align-items: center; gap: 16px; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 18px 22px; margin-bottom: 20px; box-shadow: var(--shadow-sm); }
  .avg-score { font-family: var(--ff-display); font-size: 42px; font-weight: 700; color: var(--plum); line-height: 1; }
  .avg-stars { color: var(--terra); font-size: 20px; letter-spacing: 3px; margin-bottom: 4px; }
  .avg-count { font-size: 12px; color: var(--muted); font-weight: 300; }
  .avg-divider { width: 1px; height: 48px; background: var(--border); flex-shrink: 0; } background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 24px 28px; margin-bottom: 24px; box-shadow: var(--shadow-sm); }
  .rf-title { font-family: var(--ff-display); font-size: 17px; font-weight: 600; color: var(--plum); margin-bottom: 16px; }
  .star-row { display: flex; gap: 6px; margin-bottom: 16px; }
  .star-btn { font-size: 26px; background: none; border: none; cursor: pointer; color: var(--border2); transition: color 0.15s, transform 0.15s; line-height: 1; }
  .star-btn:hover, .star-btn.lit { color: var(--terra); }
  .star-btn:hover { transform: scale(1.15); }

  .review-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 18px 22px; margin-bottom: 10px; box-shadow: var(--shadow-sm); }
  .rc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .rc-name { font-size: 14px; font-weight: 600; color: var(--plum); }
  .rc-stars { color: var(--terra); font-size: 14px; letter-spacing: 2px; }
  .rc-comment { font-size: 13px; color: var(--muted2); font-weight: 300; line-height: 1.65; font-style: italic; }

  @media (max-width: 680px) {
    .profile-hero { flex-direction: column; }
  }
`;

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hoverStar, setHoverStar] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "", clientName: "" });
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios.get(`https://framecut-rqms.onrender.com/api/profiles/${id}`).then(r => setProfile(r.data));
    axios.get(`https://framecut-rqms.onrender.com/api/portfolio/${id}`).then(r => setPortfolio(r.data));
    axios.get(`https://framecut-rqms.onrender.com/api/reviews/${id}`).then(r => setReviews(r.data));
  }, [id]);

  const submitReview = () => {
    if (!reviewForm.clientName) { toast("Please enter your name.", "warning"); return; }
    if (!reviewForm.rating) { toast("Please select a rating.", "warning"); return; }
    axios.post("https://framecut-rqms.onrender.com/api/reviews/add", {
      videographerId: id,
      bookingId: id, // simplified — ideally link to actual booking
      clientName: reviewForm.clientName,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    })
      .then(res => {
        setReviews([...reviews, res.data.review]);
        setReviewForm({ rating: 0, comment: "", clientName: "" });
        setHoverStar(0);
        toast("Review submitted! Thank you.", "success");
      })
      .catch(() => toast("Failed to submit review.", "error"));
  };

  if (!profile) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontFamily: "var(--ff-ui)", fontSize: "13px" }}>
      <style>{`${GLOBAL_CSS}`}</style>Loading...
    </div>
  );

  const stars = (r) => "★".repeat(r) + "☆".repeat(5 - r);
  const lowestPrice = profile.servicePricing?.length
    ? Math.min(...profile.servicePricing.map(s => Number(s.price) || 0))
    : profile.pricing;

  const URL_REGEX = /(https?:\/\/[^\s]+)/g;
  const renderBio = (text) => text.split("\n").map((line, i) => (
    <span key={i} style={{ display: "block" }}>
      {line.split(URL_REGEX).map((part, j) =>
        URL_REGEX.test(part)
          ? <a key={j} href={part} target="_blank" rel="noreferrer" style={{ color: "var(--terra)", textDecoration: "underline", wordBreak: "break-all" }}>{part}</a>
          : part
      )}
      {i < text.split("\n").length - 1 && line === "" && <br />}
    </span>
  ));

  return (
    <>
      <style>{styles}</style>
      <div className="profile-page">
        <div className="profile-inner">
         <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
                <div className="profile-hero">
            {profile.profileImage
              ? <img className="ph-img" src={profile.profileImage} alt={profile.name} />
              : <div className="ph-img-ph"><svg viewBox="0 0 24 24" fill="none" stroke="var(--plum)" strokeWidth="1"><path d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg></div>
            }
            <div className="ph-info">
              <p className="ph-eyebrow">Videographer</p>
              <h2 className="ph-name">{profile.name}</h2>
              <div className="ph-meta">
                <span className="ph-meta-item">📍 {profile.location}</span>
                {profile.experience && <span className="ph-meta-item">🎬 {profile.experience}</span>}
                {lowestPrice ? <span className="ph-meta-item ph-meta-price">From ₹{Number(lowestPrice).toLocaleString()}</span> : null}
              </div>
              {profile.selectedEvents?.length > 0 && (
                <div className="ph-events">
                  {profile.selectedEvents.map(ev => <span key={ev} className="ph-event-chip">{ev}</span>)}
                </div>
              )}
              {profile.bio && <p className="ph-bio">{renderBio(profile.bio)}</p>}
              {profile.equipment && (
                <div className="ph-equipment">
                  <p className="ph-equipment-label">Equipment</p>
                  <p className="ph-equipment-text">{profile.equipment}</p>
                </div>
              )}
              {role === "client"
                ? <Link to={`/book/${id}`}><RippleButton className="fc-btn-terra fc-btn-lg">Book Now</RippleButton></Link>
                : <span className="btn-book-disabled">{role ? "Login as client to book" : "Sign in to book"}</span>
              }
            </div>
          </div>

          {/* Pricing table */}
          {profile.servicePricing?.length > 0 && (
            <div className="profile-section">
              <div className="fc-section-header">
                <span className="fc-section-label">Packages & Pricing</span>
                <div className="fc-section-line" />
                <span className="fc-section-count">{profile.servicePricing.length} packages</span>
              </div>
              <div className="pricing-table">
                {profile.servicePricing.map((s, i) => (
                  <div className="pt-row" key={i}>
                    <span className="pt-name">{s.name}</span>
                    <span className="pt-price">₹{Number(s.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          <div className="profile-section">
            <div className="fc-section-header">
              <span className="fc-section-label">Portfolio</span>
              <div className="fc-section-line" />
              <span className="fc-section-count">{portfolio.length} item{portfolio.length !== 1 ? "s" : ""}</span>
            </div>
            {portfolio.length === 0 ? <p className="fc-empty">No portfolio items yet.</p> : (
              <div className="portfolio-grid">
                {portfolio.map((item, i) => (
                  <div className={`port-card anim-fadeup anim-d${Math.min(i + 1, 6)}`} key={item._id}>
                    {item.videoFile ? (
                      <video style={{ width: "100%", borderRadius: "6px", marginBottom: "12px", maxHeight: "180px", background: "#000" }} controls preload="metadata">
                        <source src={item.videoFile} />
                      </video>
                    ) : null}
                    <p className="port-title">{item.title}</p>
                    {item.description && <p className="port-desc">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="profile-section">
            <div className="fc-section-header">
              <span className="fc-section-label">Reviews</span>
              <div className="fc-section-line" />
              <span className="fc-section-count">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
            </div>

            {reviews.length > 0 && (() => {
              const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length);
              const rounded = Math.round(avg * 10) / 10;
              const fullStars = Math.round(avg);
              return (
                <div className="avg-rating-bar">
                  <div className="avg-score">{rounded.toFixed(1)}</div>
                  <div className="avg-divider" />
                  <div>
                    <div className="avg-stars">{"★".repeat(fullStars)}{"☆".repeat(5 - fullStars)}</div>
                    <div className="avg-count">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              );
            })()}

            {/* Write a review — visible to clients only */}
            {role === "client" && (
              <div className="review-form">
                <p className="rf-title">Write a Review</p>
                <div className="fc-field">
                  <label className="fc-label">Your Name</label>
                  <input className="fc-input" placeholder="Full name" value={reviewForm.clientName} onChange={e => setReviewForm({ ...reviewForm, clientName: e.target.value })} />
                </div>
                <div className="fc-field">
                  <label className="fc-label">Rating</label>
                  <div className="star-row">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} className={`star-btn ${(hoverStar || reviewForm.rating) >= n ? "lit" : ""}`}
                        onMouseEnter={() => setHoverStar(n)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() => setReviewForm({ ...reviewForm, rating: n })}>★</button>
                    ))}
                  </div>
                </div>
                <div className="fc-field">
                  <label className="fc-label">Comment (optional)</label>
                  <textarea className="fc-textarea" placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} style={{ minHeight: "80px" }} />
                </div>
                <RippleButton className="fc-btn-terra" onClick={submitReview}>Submit Review</RippleButton>
              </div>
            )}

            {reviews.length === 0 ? <p className="fc-empty">No reviews yet — be the first!</p> : (
              reviews.map(r => (
                <div className="review-card" key={r._id}>
                  <div className="rc-top">
                    <span className="rc-name">{r.clientName}</span>
                    <span className="rc-stars">{stars(r.rating)}</span>
                  </div>
                  {r.comment && <p className="rc-comment">"{r.comment}"</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;