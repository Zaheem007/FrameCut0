import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
function VideographerDashboard() {
const [bookings, setBookings] = useState([]);
const videographerId = localStorage.getItem("userId");
useEffect(() => {
axios
.get(`http://localhost:5000/api/bookings/videographer/${videographerId}`)
.then(res => setBookings(res.data))
.catch(err => console.log(err));
}, [videographerId]);
const updateStatus = (id, status) => {
axios
.put(`http://localhost:5000/api/bookings/update/${id}`, { status })
.then(res => {
setBookings(
bookings.map(b => {
if (b._id === id) {
return { ...b, status };
}
return b;
})
);
})
.catch(err => console.log(err));
};
return (
<DashboardLayout role="videographer">
<h2 className="mb-4">Booking Requests</h2>
{bookings.length === 0 && (
<p>No booking requests yet.</p>
)}
<div className="row">
{bookings.map(booking => (
<div className="col-md-6" key={booking._id}>
<div className="card shadow mb-4">
<div className="card-body">
<h5 className="card-title">Event Booking</h5>
<p>
<strong>Client:</strong> {booking.clientEmail}
</p>
<p>
<strong>Event:</strong> {booking.eventType}
</p>
<p>
<strong>Date:</strong> {booking.eventDate}
</p>
<p>
<strong>Location:</strong> {booking.eventLocation}
</p>
<p>
<strong>Status:</strong>{" "}
<span
className={
booking.status === "Approved"
? "text-success"
: booking.status === "Rejected"
? "text-danger"
: "text-warning"
}>
{booking.status}
</span>
</p>
{booking.status === "Pending" && (
<div>
<button
className="btn btn-success me-2"
onClick={() => updateStatus(booking._id, "Approved")}
>
Approve
</button>
<button
className="btn btn-danger"
onClick={() => updateStatus(booking._id, "Rejected")}
>
Reject
</button>
</div>
)}
</div>
</div>
</div>
))}
</div>
</DashboardLayout>
);
}
export default VideographerDashboard;