import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link to="/" className="navbar-brand">Framecut</Link>
      <div>
        <Link to="/videographers" className="btn btn-light me-2">
          Browse
        </Link>
        {!role && (
          <Link to="/login" className="btn btn-warning">
            Login
          </Link>
        )}
        {role && (
          <>
           {role === "admin" && (
  <Link to="/admin" className="btn btn-info me-2">
    Dashboard
  </Link>
)}
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
export default Navbar;