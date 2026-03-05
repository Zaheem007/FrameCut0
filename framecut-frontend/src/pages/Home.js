import { useEffect, useState } from "react";
import axios from "axios";
function ClientDashboard(){
const [bookings,setBookings] = useState([]);
const clientEmail = localStorage.getItem("clientEmail");
useEffect(()=>{
axios.get("http://localhost:5000/api/bookings")
.then(res=>{
const clientBookings = res.data.filter(
b => b.clientEmail === clientEmail
);
setBookings(clientBookings);
})
.catch(err=>console.log(err));
},[clientEmail]);
return(
<div className="container mt-5">
<h2>My Bookings</h2>
<hr/>
{bookings.map(booking=>(
<div key={booking._id} className="card p-3 mb-3">
<p><strong>Videographer:</strong> {booking.videographerId?.name}</p>
<p><strong>Event:</strong> {booking.eventType}</p>
<p><strong>Date:</strong> {booking.eventDate}</p>
<p><strong>Location:</strong> {booking.eventLocation}</p>
<p>
<strong>Status:</strong>
<span className={
booking.status === "Approved"
? "text-success"
: booking.status === "Rejected"
? "text-danger"
: "text-warning"
}>
{" "}{booking.status}
</span>
</p>
</div>
))}
</div>
);
}
export default ClientDashboard;