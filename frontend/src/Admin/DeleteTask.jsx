import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import "./DeleteTask.css";

emailjs.init("d7J07hDSMa8RBonrp"); // Replace with your actual public key

function DeleteTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch task and employee
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        const fetchedTask = res.data.task;
        setTask(fetchedTask);

        if (fetchedTask.employee) {
          const empRes = await axios.get(`http://localhost:5000/api/employees/${fetchedTask.employee}`);
          setEmployee(empRes.data.employee);
        }
      } catch (err) {
        toast.error("Failed to fetch task.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const sendEmailNotification = async () => {
    if (!employee || !employee.email) return;

    const emailParams = {
      taskName: task.taskName,
      employeeName: employee.name,
      taskDescription: task.taskDescription,
      deadline: new Date(task.deadline).toLocaleDateString(),
      status: task.status,
      employee_email: employee.email,
    };

    try {
      await emailjs.send(
        "service_xpztrlq",      // Replace with your service ID
        "template_qidj8vs",     // Replace with your template ID
        emailParams,
        "d7J07hDSMa8RBonrp"     // Your public key
      );
      toast.success("Email notification sent.");
    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error("Failed to send email.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await sendEmailNotification();
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      toast.success("Task deleted.");
      navigate("/adminTaskDetails");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <p>Loading task...</p>;
  if (!task) return <p>Task not found.</p>;

  return (
    <div className="delete-task-container">
      <motion.div
        className="delete-task-box"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Delete Task</h2>
        <p><strong>Task Name:</strong> {task.taskName}</p>
        <p><strong>Description:</strong> {task.taskDescription}</p>
        <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Employee:</strong> {employee?.name || "Not Assigned"}</p>

        {!confirmDelete ? (
          <button className="delete-btn" onClick={() => setConfirmDelete(true)}>
            Delete Task
          </button>
        ) : (
          <>
            <p>Are you sure you want to delete this task?</p>
            <button className="delete-btn" onClick={handleDelete} disabled={isDeleting}>
              Yes, Delete
            </button>
            <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default DeleteTask;
