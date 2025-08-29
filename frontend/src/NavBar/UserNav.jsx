import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import "./NavBar.css"; 
import { toast } from "react-hot-toast"; 

const UserNav = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#1e1e1e";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.backgroundColor = "#1e1e1e";
  }, []);

  const handleLogout = async () => {
    toast.custom((t) => (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
        <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
        <p className="text-gray-400 mb-6">Are you sure you want to log out? You will need to log in again to access your account.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await logout();
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    ));
  };

  return (
    <nav className="navbar">
      {isAuthenticated ? (
        <div className="nav-links">
          <Link to="/homepage" className="nav-item">Home</Link>
          <Link to="/dashboard" className="nav-item">Profile</Link>
          <Link to="/vehicles" className="nav-item">Vehicles</Link>
          <Link to="/browse-maintenance" className="nav-item">Maintenance</Link>
          <Link to="/AddCard" className="nav-item">Payment Card</Link>
          <Link to="/feedback/view" className="nav-item">Feedbacks</Link>
          <Link to="/faqs" className="nav-item">FAQs</Link>
          <button
  onClick={handleLogout}
  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
>
  Logout
</button>

        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/signup" className="nav-item">Sign Up</Link>

        </div>
      )}
    </nav>

     

  );
};

export default UserNav;