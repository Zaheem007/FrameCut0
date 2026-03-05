import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Videographers() {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch]= useState("");

  useEffect(() => {
  axios.get(`http://localhost:5000/api/profiles?location=${search}`)
    .then(res => setProfiles(res.data))
    .catch(err => console.log(err));
}, [search]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Available Videographers</h2>
      <input
  type="text"
  className="form-control mb-4"
  placeholder="Search by location..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}/>
      <div className="row">
        {profiles.map(profile => (
          <div className="col-md-4" key={profile._id}>
           <div className="card mb-4 shadow">
  {profile.profileImage && (
    <img 
      src={profile.profileImage} 
      className="card-img-top"
      alt="Profile"
      style={{ height: "200px", objectFit: "cover" }}
    />
  )}
  <div className="card-body">
    <h5 className="card-title">{profile.name}</h5>
    <p className="card-text">
      📍 {profile.location} <br />
      💰 ₹{profile.pricing}
    </p>
    <Link 
      to={`/profile/${profile._id}`} 
      className="btn btn-dark w-100"
    >
      View Profile
    </Link>
  </div>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Videographers;