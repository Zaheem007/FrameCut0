import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDash";
import ClientDashboard from "./pages/ClientDash";
import VideographerDashboard from "./pages/VideographerDash";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/videographer" element={<VideographerDashboard />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </Router>
  );
}
export default App;