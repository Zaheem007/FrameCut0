import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .port-wrap { max-width: 700px; font-family: var(--ff-ui); }

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 32px; transition: color 0.2s; font-family: var(--ff-ui); }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .add-form { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 28px 30px; margin-bottom: 44px; box-shadow: var(--shadow-sm); }
  .add-form-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--violet); margin-bottom: 20px; display: block; }

  .video-upload-zone {
    border: 2px dashed var(--border2); border-radius: var(--radius);
    padding: 36px 20px; text-align: center; cursor: pointer;
    transition: border-color 0.2s, background 0.2s; position: relative;
    background: var(--surface2);
  }
  .video-upload-zone:hover { border-color: var(--violet); background: rgba(124,92,158,0.04); }
  .video-upload-zone.has-file { padding: 0; border-style: solid; border-color: var(--border); overflow: hidden; }
  .video-upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .video-upload-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.35; }
  .video-upload-label { font-size: 13px; color: var(--muted); margin-bottom: 5px; font-weight: 400; }
  .video-upload-hint { font-size: 11px; color: var(--border2); }
  .video-preview { width: 100%; max-height: 220px; display: block; background: #000; }
  .video-file-name { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(124,92,158,0.06); border-top: 1px solid var(--border); }
  .video-file-name span { font-size: 12px; color: var(--plum); font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .video-file-clear { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 18px; padding: 0 4px; transition: color 0.2s; flex-shrink: 0; line-height: 1; }
  .video-file-clear:hover { color: var(--red); }

  .port-item { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 14px; box-shadow: var(--shadow-sm); transition: border-color 0.2s, box-shadow 0.2s; }
  .port-item:hover { border-color: var(--violet); box-shadow: var(--shadow-md); }
  .port-item-video { width: 100%; max-height: 260px; display: block; background: #000; }
  .port-item-body { padding: 16px 20px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .port-item-info { flex: 1; }
  .port-item-title { font-family: var(--ff-display); font-size: 15px; font-weight: 600; color: var(--plum); margin-bottom: 4px; }
  .port-item-desc { font-size: 12px; color: var(--muted); font-weight: 300; line-height: 1.6; }
`;

const EMPTY_FORM = { title: "", description: "" };

function Portfolio() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [videoFile, setVideoFile] = useState(null);
  const [videoFilePreview, setVideoFilePreview] = useState("");
  const [videoFileName, setVideoFileName] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast("Video must be under 50MB.", "warning"); return; }
    setVideoFilePreview(URL.createObjectURL(file));
    setVideoFileName(file.name);
    setVideoFile(file);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setVideoFile(null);
    setVideoFilePreview("");
    setVideoFileName("");
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setVideoFile(null);
    setVideoFilePreview("");
    setVideoFileName("");
  };

  const addItem = () => {
    if (!form.title) { toast("Title is required.", "warning"); return; }
    if (!videoFile) { toast("Please select a video to upload.", "warning"); return; }
    if (!profileId) { toast("Please create your profile first.", "warning"); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      axios.post("http://localhost:5000/api/portfolio/add", {
        videographerId: profileId,
        title: form.title,
        description: form.description,
        videoFile: reader.result,
        videoUrl: "",
        mediaType: "file",
      })
        .then(res => {
          setItems(prev => [...prev, res.data.portfolio]);
          resetForm();
          toast("Portfolio item added!", "success");
        })
        .catch(() => toast("Failed to add item.", "error"))
        .finally(() => setUploading(false));
    };
    reader.readAsDataURL(videoFile);
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
            <label className="fc-label">Description (optional)</label>
            <textarea className="fc-textarea" name="description" placeholder="Brief description of this piece..." onChange={handleChange} value={form.description} />
          </div>

          <div className="fc-field">
            <label className="fc-label">Video File</label>
            <div className={`video-upload-zone ${videoFilePreview ? "has-file" : ""}`}>
              <input type="file" accept="video/*" onChange={handleFileChange} />
              {videoFilePreview ? (
                <>
                  <video className="video-preview" controls preload="metadata">
                    <source src={videoFilePreview} />
                  </video>
                  <div className="video-file-name">
                    <span>🎬 {videoFileName}</span>
                    <button className="video-file-clear" onClick={clearFile}>×</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="video-upload-icon">🎬</div>
                  <p className="video-upload-label">Click to upload a video</p>
                  <p className="video-upload-hint">MP4, MOV, WEBM — max 50MB</p>
                </>
              )}
            </div>
          </div>

          <RippleButton className="fc-btn-terra" onClick={addItem} disabled={uploading} style={{ marginTop: "8px" }}>
            {uploading ? "Uploading…" : "Add to Portfolio"}
          </RippleButton>
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
              {item.videoFile && (
                <video className="port-item-video" controls preload="metadata">
                  <source src={item.videoFile} />
                </video>
              )}
              <div className="port-item-body">
                <div className="port-item-info">
                  <p className="port-item-title">{item.title}</p>
                  {item.description && <p className="port-item-desc">{item.description}</p>}
                </div>
                <RippleButton className="fc-btn-danger fc-btn-sm" onClick={() => deleteItem(item._id)}>Remove</RippleButton>
              </div>
            </div>
          ))
        }
      </div>
    </DashboardLayout>
  );
}

export default Portfolio;