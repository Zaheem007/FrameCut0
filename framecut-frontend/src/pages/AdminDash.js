import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/profiles")
      .then(res => setProfiles(res.data));

    axios.get("http://localhost:5000/api/bookings")
      .then(res => setBookings(res.data));
  }, []);

  const deleteProfile = (id) => {
    axios.delete(`http://localhost:5000/api/profiles/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(() => {
      alert("Profile Deleted");
      setProfiles(profiles.filter(p => p._id !== id));
    })
    .catch(() => alert("Only Admin Allowed"));
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      <hr />

      <h4>All Videographer Profiles</h4>
      {profiles.map(profile => (
        <div key={profile._id} className="card p-3 mb-2">
          <strong>{profile.name}</strong>
          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={() => deleteProfile(profile._id)}
          >
            Delete
          </button>
        </div>
      ))}

      <hr />

      <h4>All Bookings</h4>
      {bookings.map(booking => (
        <div key={booking._id} className="card p-3 mb-2">
          <p><strong>Client:</strong> {booking.clientName}</p>
          <p><strong>Status:</strong> {booking.status}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;