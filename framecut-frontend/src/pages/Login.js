import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
function Login(){
const navigate = useNavigate();
const [form,setForm] = useState({
email:"",
password:""
});
const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};
const login = ()=>{
axios.post("http://localhost:5000/api/auth/login",form)
.then(res=>{
localStorage.setItem("token",res.data.token);
localStorage.setItem("role",res.data.role);
localStorage.setItem("userId",res.data.id);
localStorage.setItem("email",form.email);
if(res.data.role === "admin"){
navigate("/admin");
}
if(res.data.role === "client"){
navigate("/client");
}
if(res.data.role === "videographer"){
navigate("/videographer");
}
})
.catch((err)=>{
  console.log(err.response);
  alert(err.response?.data?.message || "Login failed");
});
};
return(
<div className="container mt-5">
<h2>Login</h2>
<input
className="form-control mb-3"
name="email"
placeholder="Email"
onChange={handleChange}/>
<input
type="password"
className="form-control mb-3"
name="password"
placeholder="Password"
onChange={handleChange}/>
<button className="btn btn-dark" onClick={login}>
Login
</button>
<p className="mt-3">
Don't have an account? <Link to="/register">Register</Link>
</p>
</div>
);
}
export default Login;