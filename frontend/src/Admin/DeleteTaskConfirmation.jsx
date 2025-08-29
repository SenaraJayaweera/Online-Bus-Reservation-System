import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { toast } from "react-hot-toast";
import emailjs from '@emailjs/browser';

emailjs.init("d7J07hDSMa8RBonrp");

function DeleteTaskConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        if (response.data.task.employee) {
          const employeeResponse = await axios.get(`http://localhost:5000/api/employees/${response.data.task.employee}`);
          response.data.task.employee = employeeResponse.data.employee;
        }
        setTask(response.data.task);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to fetch task details");
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleDeleteClick = () => setShowConfirmDialog(true);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (task && task.employee && task.employee.email) {
        const templateParams = {
          taskName: task.taskName,
          employeeName: task.employee.name,
          taskDescription: task.taskDescription,
          deadline: new Date(task.deadline).toLocaleDateString(),
          status: task.status,
          employee_email: task.employee.email,
        };

        const result = await emailjs.send(
          "service_xpztrlq",
          "template_qidj8vs",
          templateParams,
          "d7J07hDSMa8RBonrp"
        );
        console.log("Email send result:", result);
      }

      // Delete task after email
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      console.log("Task deleted successfully");

      toast.success("Task Deleted Successfully! Email notification sent (if available).", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          fontWeight: "500",
        },
      });

      setTimeout(() => {
        navigate("/adminTaskDetails");
      }, 3000);
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("Failed to delete task. Please try again.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#f44336",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => navigate("/adminTaskDetails");
  const handleCloseDialog = () => setShowConfirmDialog(false);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  if (!task) return <div className="flex justify-center items-center min-h-screen text-gray-600">Task not found</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Delete Task</h1>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-700">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Task Name</label>
            <input type="text" value={task.taskName} readOnly className="block w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Description</label>
            <textarea value={task.taskDescription} readOnly className="block w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded"></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button onClick={handleCancel} className="px-4 py-2 rounded bg-gray-300 text-gray-700">Cancel</button>
            <button onClick={handleDeleteClick} disabled={isDeleting} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-700 mb-2">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>

            {task.employee?.email && (
              <p className="text-sm text-gray-600 mb-4">
                The employee will be notified via email. If not, you can also{" "}
                <a
                  href={`mailto:${task.employee.email}?subject=Task Deleted: ${task.taskName}&body=Hello ${task.employee.name},%0A%0AThe task "${task.taskName}" has been deleted.`}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  send it manually
                </a>.
              </p>
            )}

            <div className="flex justify-end space-x-4">
              <button onClick={handleCloseDialog} className="px-4 py-2 rounded bg-gray-300 text-gray-700">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded bg-red-600 text-white">
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DeleteTaskConfirmation;
