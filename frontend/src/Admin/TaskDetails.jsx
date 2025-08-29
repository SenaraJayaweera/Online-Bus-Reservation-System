import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import "./TaskDetails.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload, FaPlus, FaTasks } from 'react-icons/fa';
import FloatingShape from "../components/FloatingShape";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import emailjs from '@emailjs/browser';

const URL = "http://localhost:5000/api/tasks";

// Initialize EmailJS with your public key
emailjs.init("EQKdGMwFDy9jgBp8D");

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { tasks: [] };
  }
};

function TaskDetails() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHandler();
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = (taskId) => {
    setShowDeleteConfirm(taskId);
  };

  const sendCancellationEmail = async (task) => {
    if (!task.employee?.email) {
      console.warn("No employee email associated with this task");
      return;
    }

    try {
      const templateParams = {
        to_name: task.employee.name,
        to_email: task.employee.email,
        task_name: task.taskName,
        task_description: task.taskDescription,
        deadline: new Date(task.deadline).toLocaleDateString(),
        status: task.status,
        cancellation_date: new Date().toLocaleDateString()
      };

      console.log("Sending email with params:", templateParams);

      const result = await emailjs.send(
        "service_5lecc09",
        "template_wjmnvbt",
        templateParams,
        "9FexxmDIESDYNd0Ys"  // Your EmailJS public key
      );

      console.log("Email sent successfully:", result);
      
      toast.success(`Task cancellation email sent to ${task.employee.email}`, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      return true;
    } catch (emailError) {
      console.error("Failed to send cancellation email:", emailError);
      toast.error(`Failed to send email to ${task.employee.email}`, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#f44336",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      return false;
    }
  };

  const confirmDelete = async (taskId) => {
    try {
      // Delete the task (backend will handle email sending)
      const deleteResponse = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      
      if (deleteResponse.status === 200) {
        // Update local state
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        
        // Show success messages
        toast.success("Task cancelled successfully!", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#4CAF50",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
        });

        // If email was sent, show email notification
        if (deleteResponse.data.emailSent) {
          toast.success(`Notification email sent to ${deleteResponse.data.employee.email}`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#4CAF50",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
            },
          });
        }
        
        // Close the confirmation modal
        setShowDeleteConfirm(null);
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error("Error in deletion process:", error);
      
      // Show error message
      toast.error("Failed to cancel task. Please try again.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#f44336",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
      
      // Close the confirmation modal
      setShowDeleteConfirm(null);
    }
  };

  const generatePDF = (tasks) => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Add business logo to the PDF
    const img = new Image();
  img.src = '/buisness-logo.png';

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 30, 30);
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('MALSHAN MOTORS', 50, 25);
      doc.setFontSize(16);
      doc.text('Task Management Report', 50, 35);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

      const columns = ["Task Name", "Description", "Deadline", "Status", "Assigned Employee"];
      const rows = tasks.map((task) => [
        task.taskName,
        task.taskDescription,
        new Date(task.deadline).toLocaleDateString(),
        task.status,
        task.employee ? task.employee.name : "Unassigned",
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 50,
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      doc.save("Task_Report.pdf");
    };

    img.onerror = () => {
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('MALSHAN MOTORS', 14, 25);
      doc.setFontSize(16);
      doc.text('Task Management Report', 14, 35);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

      const columns = ["Task Name", "Description", "Deadline", "Status", "Assigned Employee"];
      const rows = tasks.map((task) => [
        task.taskName,
        task.taskDescription,
        new Date(task.deadline).toLocaleDateString(),
        task.status,
        task.employee ? task.employee.name : "Unassigned",
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 50,
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      doc.save("Task_Report.pdf");
    };
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHandler();
      const filteredTasks = data.tasks.filter((task) =>
        Object.values(task).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      setTasks(filteredTasks);
      setNoResults(filteredTasks.length === 0);
      setError(null);
    } catch (err) {
      console.error("Error searching tasks:", err);
      setError("Failed to search tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

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
                <FaTasks className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Task Management</h1>
                <p className="text-blue-100 mt-1">Manage all your tasks in one place</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => generatePDF(tasks)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
              >
                <FaDownload />
                <span className="font-semibold">Download Report</span>
              </button>
              <button
                onClick={() => navigate("/adminAddTask")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md"
              >
                <FaPlus />
                <span className="font-semibold">Add New Task</span>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search tasks..."
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
            No tasks found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-900/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Task Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/60 backdrop-blur-sm divide-y divide-gray-800">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-600 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{task.taskName}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{task.taskDescription}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(task.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{task.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{task.employee ? task.employee.name : "Unassigned"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <Link 
                        to={`/adminTaskDetails/${task._id}`}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Cancel
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
              <h3 className="text-xl font-bold text-gray-300 mb-4">Confirm Task Cancellation</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to cancel this task? This action cannot be undone.</p>
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
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default TaskDetails;