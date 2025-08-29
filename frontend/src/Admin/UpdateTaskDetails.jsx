import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { FaTasks, FaArrowLeft } from 'react-icons/fa';
import FloatingShape from '../components/FloatingShape';
import { toast } from 'react-hot-toast';
import './AddTask.css';

function UpdateTask() {
    const [inputs, setInputs] = useState({
        taskName: '',
        taskDescription: '',
        deadline: '',
        status: '',
        assignedEmployee: ''
    });

    const [employees, setEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [emailStatus, setEmailStatus] = useState(null);
    const history = useNavigate();
    const { id } = useParams();

    // Fetch employees and task details
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch task details by ID
                const taskResponse = await axios.get(`http://localhost:5000/api/tasks/${id}`);
                const taskData = taskResponse.data.task;

                // Fetch all employees
                const employeesResponse = await axios.get('http://localhost:5000/api/employees');
                setEmployees(employeesResponse.data.employees);

                // Set task data to form state
                setInputs({
                    taskName: taskData.taskName || '',
                    taskDescription: taskData.taskDescription || '',
                    deadline: taskData.deadline
                        ? new Date(taskData.deadline).toISOString().split('T')[0]
                        : '',
                    status: taskData.status || '',
                    assignedEmployee: taskData.employee?._id || ''
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                window.alert('Failed to load task details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const validate = () => {
        let formErrors = {};
        const today = new Date();
        const selectedDate = new Date(inputs.deadline);

        if (!inputs.taskName.trim()) {
            formErrors.taskName = 'Task Name is required';
        }

        if (!inputs.taskDescription.trim()) {
            formErrors.taskDescription = 'Task Description is required';
        }

        if (!inputs.deadline) {
            formErrors.deadline = 'Deadline is required';
        } else if (selectedDate < today) {
            formErrors.deadline = 'Deadline must be a future date';
        }

        if (!inputs.status) {
            formErrors.status = 'Status is required';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const sendEmail = async (employeeEmail, employeeName) => {
        try {
            const templateParams = {
                taskName: inputs.taskName,
                employeeName: employeeName,
                taskDescription: inputs.taskDescription,
                deadline: new Date(inputs.deadline).toLocaleDateString(),
                status: inputs.status,
                employee_email: employeeEmail,
            };

            await emailjs.send(
                "service_5lecc09",
                "template_xjx7fsk",
                templateParams,
                "9FexxmDIESDYNd0Ys"
            );
            console.log("Email sent successfully");
            toast.success(`Email notification sent to ${employeeEmail}`, {
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
        setEmailStatus(null);

        if (!validate()) return;

        try {
            const payload = {
                taskName: inputs.taskName.trim(),
                taskDescription: inputs.taskDescription.trim(),
                deadline: inputs.deadline,
                status: inputs.status
            };

            await axios.put(`http://localhost:5000/api/tasks/${id}`, payload);

            // Try to send email notification
            const assignedEmployee = employees.find(emp => emp._id === inputs.assignedEmployee);
            if (assignedEmployee) {
                await sendEmail(assignedEmployee.email, assignedEmployee.name);
            }

            toast.success("Task Details Updated Successfully!", {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#4CAF50",
                    color: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                },
            });
            history('/adminTaskDetails');
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error("Failed to update task. Please try again.", {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#f44336",
                    color: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center">
                <p className="text-gray-300">Loading task details...</p>
            </div>
        );
    }

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
                {/* Header Section with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                                <FaTasks className="text-3xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Update Task</h1>
                                <p className="text-blue-100 mt-1">Edit task details</p>
                            </div>
                        </div>
                        <button
                            onClick={() => history('/adminTaskDetails')}
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
                                min={new Date().toISOString().split('T')[0]}
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
                                <option value="">Select Status...</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            {errors.status && <p className="mt-1 text-sm text-red-400">{errors.status}</p>}
                        </div>

                        {/* Assigned Employee */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Assigned Employee
                            </label>
                            <input
                                type="text"
                                value={employees.find(emp => emp._id === inputs.assignedEmployee)?.name || "Unassigned"}
                                readOnly
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={() => history('/adminTaskDetails')}
                            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Update Task
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default UpdateTask;
