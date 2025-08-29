import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Employee from './Employee';
import { motion } from 'framer-motion';
import './EmployeeDetails.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaDownload, FaUserPlus, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const URL = "http://localhost:5000/api/employees";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

// ✅ Move this OUTSIDE the component
const generatePDF = (employees) => {
  const doc = new jsPDF({ orientation: "landscape" });

  const img = new Image();
  img.src = '/buisness-logo.png';

  img.onload = () => {
    doc.addImage(img, 'PNG', 14, 10, 30, 30);

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('MALSHAN MOTORS', 50, 25);
    doc.setFontSize(16);
    doc.text('Employee Report', 50, 35);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 50);

    const columns = ["Name", "Age", "Gender", "Designation", "Email", "Phone", "NIC_No", "Date_Joined"];
    const rows = employees.map(emp => [
      emp.name, emp.age, emp.gender, emp.designation, emp.email, emp.phone, emp.nicNo, emp.date_joined
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 55,
      styles: { fontSize: 10, overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
      bodyStyles: { valign: 'middle' }
    });

    doc.save("Employee_Report.pdf");
  };
};

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchHandler();
        setEmployees(data.employees);
        setAllEmployees(data.employees);
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setEmployees(allEmployees);
      setNoResults(false);
      return;
    }

    const filtered = allEmployees.filter((employee) => {
      const searchFields = [
        employee.name,
        employee.age?.toString(),
        employee.gender,
        employee.designation,
        employee.address,
        employee.email,
        employee.phone?.toString(),
        employee.nicNo,
        employee.date_joined
      ];

      return searchFields.some(field =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setEmployees(filtered);
    setNoResults(filtered.length === 0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setEmployees(allEmployees);
      setNoResults(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Handle employee deletion
  const handleDelete = (employeeId) => {
    setShowDeleteConfirm(employeeId);
  };

  const confirmDelete = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
      setEmployees(employees.filter(employee => employee._id !== employeeId));
      toast.success("Employee deleted successfully!");
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <FaUsers className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Employee Management</h1>
                <p className="text-blue-100 mt-1">Manage all your employees in one place</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => generatePDF(employees)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
              >
                <FaDownload />
                <span className="font-semibold">Download Report</span>
              </button>
              <button
                onClick={() => navigate("/adminaddEmployee")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md"
              >
                <FaUserPlus />
                <span className="font-semibold">Add Employee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder="Search employees..."
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md bg-gray-700 text-gray-300 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-400 bg-red-900/50 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : noResults ? (
          <div className="text-center py-8 text-gray-400">
            No employees found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-900/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">NIC No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/60 backdrop-blur-sm divide-y divide-gray-800">
                {employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-600 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{employee.nicNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(employee.date_joined).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <Link 
                        to={`/adminEmployeeDetails/${employee._id}`}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-300 mb-4">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default EmployeeDetails;
