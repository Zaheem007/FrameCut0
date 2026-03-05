import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { Link } from "react-router-dom";

function ClientDashboard(){

const [profiles,setProfiles] = useState([]);

useEffect(()=>{

axios.get("http://localhost:5000/api/profiles")
.then(res=>setProfiles(res.data));

},[]);

return(

<DashboardLayout role="client">

<h2>Browse Videographers</h2>

<div className="row mt-4">

{profiles.map(profile=>(

<div className="col-md-4" key={profile._id}>

<div className="card shadow mb-4">

{profile.profileImage && (
<img
src={profile.profileImage}
className="card-img-top"
alt="profile"
style={{height:"200px",objectFit:"cover"}}
/>
)}

<div className="card-body">

<h5>{profile.name}</h5>

<p>
📍 {profile.location} <br/>
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

</DashboardLayout>

);

}

export default ClientDashboard;