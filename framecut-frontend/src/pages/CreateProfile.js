import { useState } from "react";
import axios from "axios";

function CreateProfile(){

const [form,setForm] = useState({
name:"",
location:"",
pricing:"",
bio:"",
experience:"",
profileImage:""
});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const createProfile=()=>{

axios.post("http://localhost:5000/api/profiles/create",{
...form,
userId: localStorage.getItem("userId")
})
.then(()=>{
alert("Profile created successfully");
})
.catch(err=>console.log(err));

};

return(

<div className="container mt-5">

<h2>Create Videographer Profile</h2>

<input
className="form-control mb-2"
name="name"
placeholder="Studio Name"
onChange={handleChange}
/>

<input
className="form-control mb-2"
name="location"
placeholder="Location"
onChange={handleChange}
/>

<input
className="form-control mb-2"
name="pricing"
placeholder="Pricing"
onChange={handleChange}
/>

<input
className="form-control mb-2"
name="experience"
placeholder="Years of Experience"
onChange={handleChange}
/>

<textarea
className="form-control mb-3"
name="bio"
placeholder="About yourself"
onChange={handleChange}
/>

<input
className="form-control mb-3"
name="profileImage"
placeholder="Profile image URL"
onChange={handleChange}
/>

<button className="btn btn-dark" onClick={createProfile}>
Save Profile
</button>

</div>

);

}

export default CreateProfile;