import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Profile(){

const { id } = useParams();
const [profile,setProfile] = useState(null);

useEffect(()=>{

axios
.get(`http://localhost:5000/api/profiles/${id}`)
.then(res=>setProfile(res.data))
.catch(err=>console.log(err));

},[id]);

if(!profile){
return <p className="text-center mt-5">Loading profile...</p>;
}

return(

<div className="container mt-5">

<h2>{profile.name}</h2>

<p>{profile.bio}</p>

<p>📍 {profile.location}</p>

<p>💰 ₹{profile.pricing}</p>

</div>

);

}

export default Profile;