import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { motion } from 'framer-motion';
import { FaTasks, FaArrowLeft } from 'react-icons/fa';
import FloatingShape from '../components/FloatingShape';
import { toast } from 'react-hot-toast';
import "./AddTask.css";

function AddTask() {
    const [inputs, setInputs] = useState({
        taskName: "",
        taskDescription: "",
        deadline: "",
        status: "Pending", // Set default status
        assignedEmployee: "",
    });

    const [employees, setEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/employees");
                setEmployees(response.data.employees);
            } catch (err) {
                console.error("Error fetching employees:", err);
                window.alert("Failed to load employees. Please try again.");
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        let formErrors = {};
        const today = new Date();
        const selectedDate = new Date(inputs.deadline);

        if (!inputs.taskName.trim()) formErrors.taskName = "Task Name is required";
        if (!inputs.taskDescription.trim()) formErrors.taskDescription = "Description is required";
        if (!inputs.deadline) formErrors.deadline = "Deadline is required";
        if (selectedDate < today) formErrors.deadline = "Deadline cannot be in the past";
        if (!inputs.assignedEmployee) formErrors.assignedEmployee = "Assigned Employee is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const sendEmail = async (selectedEmployee) => {
        try {
            const templateParams = {
                taskName: inputs.taskName,
                employeeName: selectedEmployee.name,
                taskDescription: inputs.taskDescription,
                deadline: new Date(inputs.deadline).toLocaleDateString(),
                status: inputs.status,
                employee_email: selectedEmployee.email,
            };

            await emailjs.send(
                "service_5lecc09",
                "template_wjmnvbt",
                templateParams,
                "9FexxmDIESDYNd0Ys"
            );
            console.log("Email sent successfully!");
            toast.success(`Email notification sent to ${selectedEmployee.email}`, {
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
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email notification", {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate() || isSubmitting) return;
        
        setIsSubmitting(true);

        try {
            const selectedEmployee = employees.find(emp => emp._id === inputs.assignedEmployee);
            
            const payload = {
                taskName: inputs.taskName.trim(),
                taskDescription: inputs.taskDescription.trim(),
                deadline: inputs.deadline,
                status: inputs.status,
                id: inputs.assignedEmployee,
            };

            const response = await axios.post("http://localhost:5000/api/tasks", payload);
            
            if (response.data.task) {
                // Try to send email notification
                if (selectedEmployee) {
                    await sendEmail(selectedEmployee);
                }
                
                toast.success("Task Added Successfully!", {
                    duration: 3000,
                    position: "top-center",
                    style: {
                        background: "#4CAF50",
                        color: "#fff",
                        padding: "16px",
                        borderRadius: "8px",
                    },
                });
                navigate("/adminTaskDetails");
            }
        } catch (err) {
            console.error("Error adding task:", err);
            const errorMessage = err.response?.data?.message || "An error occurred while adding the task. Please try again.";
            toast.error(errorMessage, {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#f44336",
                    color: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                },
            });
        } finally {
            setIsSubmitting(false);
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
                className="max-w-4xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
            >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                                <FaTasks className="text-3xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Add New Task</h1>
                                <p className="text-blue-100 mt-1">Fill in the task details below</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/adminTaskDetails')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all"
                        >
                            <FaArrowLeft />
                            <span>Back to Tasks</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {/* Task Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Task Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="taskName"
                                value={inputs.taskName}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                placeholder="Enter task name"
                            />
                            {errors.taskName && <p className="mt-1 text-sm text-red-400">{errors.taskName}</p>}
                        </div>

                        {/* Task Description */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="taskDescription"
                                value={inputs.taskDescription}
                                onChange={handleChange}
                                rows="4"
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                placeholder="Enter task description"
                            />
                            {errors.taskDescription && <p className="mt-1 text-sm text-red-400">{errors.taskDescription}</p>}
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Deadline <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={inputs.deadline}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                            />
                            {errors.deadline && <p className="mt-1 text-sm text-red-400">{errors.deadline}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={inputs.status}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        {/* Assigned Employee */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Assigned Employee <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="assignedEmployee"
                                value={inputs.assignedEmployee}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                            >
                                <option value="">Select Employee</option>
                                {employees.map((employee) => (
                                    <option key={employee._id} value={employee._id}>
                                        {employee.name} - {employee.designation}
                                    </option>
                                ))}
                            </select>
                            {errors.assignedEmployee && <p className="mt-1 text-sm text-red-400">{errors.assignedEmployee}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/adminTaskDetails')}
                            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default AddTask;
