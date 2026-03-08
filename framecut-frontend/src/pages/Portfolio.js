import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}

  .port-wrap { max-width: 680px; font-family: var(--ff-ui); }

  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); background: none; border: none; cursor: pointer;
    padding: 0; margin-bottom: 32px; transition: color 0.2s; font-family: var(--ff-ui);
  }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .add-form {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 28px 30px;
    margin-bottom: 44px;
    box-shadow: var(--shadow-sm);
  }
  .add-form-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--violet); margin-bottom: 20px; display: block;
  }

  .port-item {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 22px;
    margin-bottom: 10px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 20px;
    box-shadow: var(--shadow-sm);
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .port-item:hover { border-color: var(--violet); box-shadow: var(--shadow-md); transform: translateX(3px); }

  .port-item-info { flex: 1; }
  .port-item-title { font-family: var(--ff-display); font-size: 15px; font-weight: 600; color: var(--plum); margin-bottom: 5px; }
  .port-item-desc { font-size: 12.5px; color: var(--muted); font-weight: 300; margin-bottom: 10px; line-height: 1.6; }
  .port-item-link {
    font-size: 10.5px; color: var(--terra); text-decoration: none;
    letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; transition: color 0.2s;
  }
  .port-item-link:hover { color: var(--terra2); }
`;

function Portfolio() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState({ title: "", videoUrl: "", description: "" });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/profiles/user/${userId}`)
      .then(res => {
        setProfileId(res.data._id);
        return axios.get(`http://localhost:5000/api/portfolio/${res.data._id}`);
      })
      .then(res => setItems(res.data))
      .catch(() => toast("Please create your profile before adding portfolio items.", "warning"));
  }, [userId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addItem = () => {
    if (!form.title || !form.videoUrl) { toast("Title and video URL are required.", "warning"); return; }
    if (!profileId) { toast("Please create your profile first.", "warning"); return; }
    axios.post("http://localhost:5000/api/portfolio/add", { videographerId: profileId, ...form })
      .then(res => {
        setItems([...items, res.data.portfolio]);
        setForm({ title: "", videoUrl: "", description: "" });
        toast("Portfolio item added!", "success");
      })
      .catch(() => toast("Failed to add item.", "error"));
  };

  const deleteItem = (id) => {
    if (!window.confirm("Remove this item?")) return;
    axios.delete(`http://localhost:5000/api/portfolio/${id}`)
      .then(() => { setItems(items.filter(i => i._id !== id)); toast("Item removed.", "info"); })
      .catch(() => toast("Failed to delete.", "error"));
  };

  return (
    <DashboardLayout role="videographer">
      <style>{styles}</style>
      <div className="port-wrap">

        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="back-btn-arrow">←</span> Back
        </button>

        <div className="fc-page-header">
          <p className="fc-eyebrow">My Work</p>
          <h2 className="fc-title">Portfolio</h2>
          <p className="fc-subtitle">{items.length} item{items.length !== 1 ? "s" : ""} published</p>
        </div>

        <div className="add-form">
          <span className="add-form-label">Add New Item</span>
          <div className="fc-field">
            <label className="fc-label">Title</label>
            <input className="fc-input" name="title" placeholder="e.g. Wedding Highlight Reel" onChange={handleChange} value={form.title} />
          </div>
          <div className="fc-field">
            <label className="fc-label">Video URL</label>
            <input className="fc-input" name="videoUrl" placeholder="https://youtube.com/..." onChange={handleChange} value={form.videoUrl} />
          </div>
          <div className="fc-field">
            <label className="fc-label">Description (optional)</label>
            <textarea className="fc-textarea" name="description" placeholder="Brief description of this piece..." onChange={handleChange} value={form.description} />
          </div>
          <RippleButton className="fc-btn-terra" onClick={addItem}>Add to Portfolio</RippleButton>
        </div>

        <div className="fc-section-header">
          <span className="fc-section-label">Your Items</span>
          <div className="fc-section-line" />
          <span className="fc-section-count">{items.length}</span>
        </div>

        {items.length === 0
          ? <p className="fc-empty">No items yet. Add your first one above.</p>
          : items.map((item, i) => (
            <div className={`port-item anim-fadeup anim-d${Math.min(i + 1, 6)}`} key={item._id}>
              <div className="port-item-info">
                <p className="port-item-title">{item.title}</p>
                {item.description && <p className="port-item-desc">{item.description}</p>}
                <a href={item.videoUrl} target="_blank" rel="noreferrer" className="port-item-link">Watch Video →</a>
              </div>
              <RippleButton className="fc-btn-danger fc-btn-sm" onClick={() => deleteItem(item._id)}>Remove</RippleButton>
            </div>
          ))
        }
      </div>
    </DashboardLayout>
  );
}

export default Portfolio;