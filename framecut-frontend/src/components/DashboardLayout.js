import { Link } from "react-router-dom";

function DashboardLayout({ children, role }) {

const logout = () => {
localStorage.clear();
window.location.href = "/";
};

return (
<div className="d-flex">

{/* Sidebar */}
<div className="bg-dark text-white p-4" style={{width:"250px",minHeight:"100vh"}}>

<h4 className="mb-4">Framecut</h4>

{role === "client" && (
<>
<Link className="d-block text-white mb-3" to="/client">Dashboard</Link>
<Link className="d-block text-white mb-3" to="/videographers">Browse Videographers</Link>
</>
)}

{role === "videographer" && (
<>
<Link className="d-block text-white mb-3" to="/videographer">Dashboard</Link>
<Link className="d-block text-white mb-3" to="/portfolio">My Portfolio</Link>
</>
)}

<button className="btn btn-danger mt-4" onClick={logout}>
Logout
</button>

</div>

{/* Main content */}
<div className="flex-grow-1 p-4 bg-light">
{children}
</div>

</div>
);
}

export default DashboardLayout;