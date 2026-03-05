import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Booking() {
  const { id } = useParams();

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    eventDate: "",
    eventType: "",
    eventLocation: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios.post("http://localhost:5000/api/bookings/create", {
      ...form,
      videographerId: id
    })
    .then(res => alert("Booking Request Sent Successfully"))
    .catch(err => console.log(err));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Book Videographer</h2>

      <div className="card p-4 shadow">
        <input 
          className="form-control mb-3"
          name="clientName"
          placeholder="Your Name"
          onChange={handleChange}
        />

        <input 
          className="form-control mb-3"
          name="clientEmail"
          placeholder="Your Email"
          onChange={handleChange}
        />

        <input 
          className="form-control mb-3"
          name="eventDate"
          type="date"
          onChange={handleChange}
        />

        <input 
          className="form-control mb-3"
          name="eventType"
          placeholder="Event Type"
          onChange={handleChange}
        />

        <input 
          className="form-control mb-3"
          name="eventLocation"
          placeholder="Event Location"
          onChange={handleChange}
        />

        <button 
          className="btn btn-dark"
          onClick={handleSubmit}
        >
          Submit Booking
        </button>
      </div>
    </div>
  );
}

export default Booking;