// App.js — add ToastProvider at the top level so toasts work everywhere

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./theme";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDash";
import ClientDashboard from "./pages/ClientDash";
import VideographerDashboard from "./pages/VideographerDash";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import Videographers from "./pages/Videographers";
import MyBookings from "./pages/Home";
import Portfolio from "./pages/Portfolio";

function App() {
  return (
    <Router>
      {/* Mount the toast system once at the root — all pages can now call toast() */}
      <ToastProvider />

      <Routes>
        <Route path="/"               element={<Login />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/admin"          element={<AdminDashboard />} />
        <Route path="/client"         element={<ClientDashboard />} />
        <Route path="/videographer"   element={<VideographerDashboard />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/profile/:id"    element={<Profile />} />
        <Route path="/book/:id"       element={<Booking />} />
        <Route path="/videographers"  element={<Videographers />} />
        <Route path="/home"           element={<MyBookings />} />
        <Route path="/portfolio"      element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;