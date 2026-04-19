import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .cp-wrap { max-width: 620px; font-family: var(--ff-ui); }

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 32px; transition: color 0.2s; font-family: var(--ff-ui); }
  .back-btn:hover { color: var(--violet); }
  .back-btn-arrow { font-size: 14px; transition: transform 0.2s; }
  .back-btn:hover .back-btn-arrow { transform: translateX(-3px); }

  .cp-avatar-section { display: flex; align-items: center; gap: 24px; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 24px 28px; margin-bottom: 28px; box-shadow: var(--shadow-sm); }
  .cp-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--border); background: var(--bg2); display: flex; align-items: center; justify-content: center; font-size: 32px; color: var(--border2); flex-shrink: 0; overflow: hidden; }
  .cp-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .cp-avatar-info { flex: 1; }
  .cp-avatar-name { font-family: var(--ff-display); font-size: 22px; font-weight: 600; color: var(--plum); margin-bottom: 4px; }
  .cp-avatar-email { font-size: 12.5px; color: var(--muted); font-weight: 300; margin-bottom: 8px; }
  .cp-avatar-role { display: inline-block; padding: 3px 12px; background: rgba(124,92,158,0.1); border: 1px solid rgba(124,92,158,0.25); border-radius: 99px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--violet); }

  .cp-section { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 24px 28px; margin-bottom: 20px; box-shadow: var(--shadow-sm); }
  .cp-section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--violet); margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }

  .cp-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 520px) { .cp-info-grid { grid-template-columns: 1fr; } }
  .cp-info-item { display: flex; flex-direction: column; gap: 4px; }
  .cp-info-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .cp-info-val { font-size: 13.5px; color: var(--plum); font-weight: 400; }

  .pwd-section-title { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--terra); margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
  .pwd-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 520px) { .pwd-row { grid-template-columns: 1fr; } }

  .cp-stat-row { display: flex; gap: 12px; margin-bottom: 28px; }
  .cp-stat { flex: 1; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 16px 18px; text-align: center; box-shadow: var(--shadow-sm); }
  .cp-stat-num { font-family: var(--ff-display); font-size: 28px; font-weight: 700; color: var(--plum); }
  .cp-stat-label { font-size: 9.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 4px; }
`;

function ClientProfile() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem("userId");
  const name     = localStorage.getItem("name");
  const email    = localStorage.getItem("email");

  const [bookings, setBookings]   = useState([]);
  const [reviews, setReviews]     = useState([]);
  const [pwdForm, setPwdForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [editForm, setEditForm]   = useState({ name: name || "" });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (!email) return;
    // Fetch client bookings by email
    axios.get(`https://framecut-rqms.onrender.com/api/bookings`)
      .then(res => setBookings(res.data.filter(b => b.clientEmail === email)))
      .catch(() => {});
    // Fetch all reviews by clientName (approximate)
    axios.get(`https://framecut-rqms.onrender.com/api/reviews/client/${userId}`)
      .then(res => setReviews(res.data))
      .catch(() => {});
  }, [email, userId]);

  const advancePaid = bookings.filter(b => b.paymentStatus === "Advance Paid").length;

  const handlePwdChange = (e) => setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const updateName = () => {
    if (!editForm.name.trim()) { toast("Name cannot be empty.", "warning"); return; }
    setEditLoading(true);
    axios.put(`https://framecut-rqms.onrender.com/api/auth/update-name`, { userId, name: editForm.name })
      .then(() => {
        localStorage.setItem("name", editForm.name);
        toast("Name updated successfully!", "success");
      })
      .catch(() => toast("Failed to update name.", "error"))
      .finally(() => setEditLoading(false));
  };

  const changePassword = () => {
    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      toast("Please fill all password fields.", "warning"); return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast("New passwords do not match.", "warning"); return;
    }
    if (pwdForm.newPassword.length < 6) {
      toast("Password must be at least 6 characters.", "warning"); return;
    }
    setPwdLoading(true);
    axios.post(`https://framecut-rqms.onrender.com/api/auth/change-password`, {
      userId,
      currentPassword: pwdForm.currentPassword,
      newPassword: pwdForm.newPassword,
    })
      .then(() => {
        toast("Password changed successfully!", "success");
        setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch(err => toast(err.response?.data?.message || "Failed to change password.", "error"))
      .finally(() => setPwdLoading(false));
  };

  return (
    <DashboardLayout role="client">
      <style>{styles}</style>
      <div className="cp-wrap">

        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="back-btn-arrow">←</span> Back
        </button>

        <div className="fc-page-header">
          <p className="fc-eyebrow">Account</p>
          <h2 className="fc-title">My Profile</h2>
          <p className="fc-subtitle">Manage your account details</p>
        </div>

        {/* Avatar + info card */}
        <div className="cp-avatar-section">
          <div className="cp-avatar">👤</div>
          <div className="cp-avatar-info">
            <p className="cp-avatar-name">{name || "Client"}</p>
            <p className="cp-avatar-email">{email}</p>
            <span className="cp-avatar-role">Client</span>
          </div>
        </div>

        {/* Stats */}
        <div className="cp-stat-row">
          <div className="cp-stat">
            <p className="cp-stat-num">{bookings.length}</p>
            <p className="cp-stat-label">Bookings Made</p>
          </div>
          <div className="cp-stat">
            <p className="cp-stat-num">{advancePaid}</p>
            <p className="cp-stat-label">Advance Paid</p>
          </div>
          <div className="cp-stat">
            <p className="cp-stat-num">{reviews.length}</p>
            <p className="cp-stat-label">Reviews Given</p>
          </div>
        </div>

        {/* Account details */}
        <div className="cp-section">
          <p className="cp-section-title">Account Details</p>
          <div className="cp-info-grid">
            <div className="cp-info-item">
              <span className="cp-info-label">Full Name</span>
              <span className="cp-info-val">{name || "—"}</span>
            </div>
            <div className="cp-info-item">
              <span className="cp-info-label">Email Address</span>
              <span className="cp-info-val">{email || "—"}</span>
            </div>
            <div className="cp-info-item">
              <span className="cp-info-label">Role</span>
              <span className="cp-info-val">Client</span>
            </div>
            <div className="cp-info-item">
              <span className="cp-info-label">Member Since</span>
              <span className="cp-info-val">2024</span>
            </div>
          </div>
        </div>

        {/* Edit name */}
        <div className="cp-section">
          <p className="cp-section-title">Edit Name</p>
          <div className="fc-field">
            <label className="fc-label">Full Name</label>
            <input className="fc-input" name="name" value={editForm.name} onChange={handleEditChange} placeholder="Your full name" />
          </div>
          <RippleButton className="fc-btn-primary" onClick={updateName} disabled={editLoading}>
            {editLoading ? "Saving..." : "Update Name"}
          </RippleButton>
        </div>

        {/* Change password */}
        <div className="cp-section">
          <p className="pwd-section-title">Change Password</p>
          <div className="fc-field">
            <label className="fc-label">Current Password</label>
            <input className="fc-input" type="password" name="currentPassword" value={pwdForm.currentPassword} onChange={handlePwdChange} placeholder="Enter current password" />
          </div>
          <div className="pwd-row">
            <div className="fc-field">
              <label className="fc-label">New Password</label>
              <input className="fc-input" type="password" name="newPassword" value={pwdForm.newPassword} onChange={handlePwdChange} placeholder="Min 6 characters" />
            </div>
            <div className="fc-field">
              <label className="fc-label">Confirm Password</label>
              <input className="fc-input" type="password" name="confirmPassword" value={pwdForm.confirmPassword} onChange={handlePwdChange} placeholder="Repeat new password" />
            </div>
          </div>
          <RippleButton className="fc-btn-terra" onClick={changePassword} disabled={pwdLoading}>
            {pwdLoading ? "Changing..." : "Change Password"}
          </RippleButton>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default ClientProfile;