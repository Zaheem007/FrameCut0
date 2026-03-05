import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Register(){
const navigate = useNavigate();
const [form,setForm] = useState({
name:"",
email:"",
password:"",
role:"client"
});
const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};
const register=()=>{
axios.post("http://localhost:5000/api/auth/register",form)
.then(()=>{
alert("Registration successful");
navigate("/");
})
.catch(()=>alert("Error registering"));
};
return(
<div className="container mt-5">
<h2>Register</h2>
<input
className="form-control mb-2"
name="name"
placeholder="Name"
onChange={handleChange}
/>
<input
className="form-control mb-2"
name="email"
placeholder="Email"
onChange={handleChange}
/>
<input
type="password"
className="form-control mb-2"
name="password"
placeholder="Password"
onChange={handleChange}
/>
<select
className="form-control mb-3"
name="role"
onChange={handleChange}>
<option value="client">Client</option>
<option value="videographer">Videographer</option>
</select>
<button className="btn btn-dark" onClick={register}>
Register
</button>
</div>
);
}
export default Register;