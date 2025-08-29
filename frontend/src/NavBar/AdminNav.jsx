import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";  // Import useState for dropdown handling
import { toast } from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";  // Add this import
import "./NavBar.css";

const AdminNav = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false); // Manage employee dropdown
  const [showTaskDropdown, setShowTaskDropdown] = useState(false); // Manage task dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Handle mobile menu visibility

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/admindashboard" className="text-xl font-bold text-green-500">
          Admin Panel
         </Link>


          {/* Navigation Links */}
          <div className={`md:flex space-x-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            {isAuthenticated ? (
              <>
                <Link to="/admindashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/admin/vehicles" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Vehicles</Link>
                <Link to="/admin/vehicles/documents" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Documents</Link>
                <Link to="/admin/maintenance" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Maintenance</Link>
                <Link to="/adminaddFAQs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Add FAQs</Link>
                <Link to="/adminDisplayFAQ" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">FAQs</Link>
                <Link to="/admin/feedback" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Feedbacks</Link>

                {/* Employees Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowEmployeeDropdown(true)}
                  onMouseLeave={() => setShowEmployeeDropdown(false)}
                >
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center">
                    Employees
                    <FaChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {showEmployeeDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg z-50">
                      <Link to="/adminAddEmployee" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Add Employee</Link>
                      <Link to="/adminEmployeeDetails" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Employee Details</Link>
                    </div>
                  )}
                </div>

                {/* Tasks Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowTaskDropdown(true)}
                  onMouseLeave={() => setShowTaskDropdown(false)}
                >
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center">
                    Tasks
                    <FaChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {showTaskDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded shadow-lg z-50">
                      <Link to="/adminAddTask" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Add Task</Link>
                      <Link to="/adminTaskDetails" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Task Details</Link>
                    </div>
                  )}
                </div>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">Login</Link>
              
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;