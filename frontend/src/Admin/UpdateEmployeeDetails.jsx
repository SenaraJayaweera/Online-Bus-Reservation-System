import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserEdit, FaArrowLeft } from 'react-icons/fa';
import FloatingShape from '../components/FloatingShape';
import { toast } from 'react-hot-toast';
import './AddEmployee.css';

function UpdateEmployee() {
    const [inputs, setInputs] = useState({
        name: '',
        age: '',
        gender: '',
        designation: '',
        address: '',
        email: '',
        phone: '',
        nicNo: '',
        date_joined: ''
    });

    const [errors, setErrors] = useState({});
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
                const employeeData = response.data.employee;

                setInputs({
                    ...employeeData,
                    date_joined: employeeData.date_joined
                        ? new Date(employeeData.date_joined).toISOString().split('T')[0]
                        : ''
                });
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };

        fetchHandler();
    }, [id]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const validate = () => {
        let formErrors = {};

        if (!inputs.name) {
            formErrors.name = "Name is required";
        }

        if (!inputs.age) {
            formErrors.age = "Age is required";
        } else if (isNaN(inputs.age)) {
            formErrors.age = "Age must be a number";
        } else if (Number(inputs.age) < 18) {
            formErrors.age = "Age must be greater than 18";
        }

        if (!inputs.gender) {
            formErrors.gender = "Gender is required";
        }

        if (!inputs.designation) {
            formErrors.designation = "Designation is required";
        }

        if (!inputs.address) {
            formErrors.address = "Address is required";
        }

        if (!inputs.email) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
            formErrors.email = "Email is invalid";
        }

        if (!inputs.phone) {
            formErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(inputs.phone)) {
            formErrors.phone = "Phone number must be 10 digits";
        }

        if (!inputs.nicNo) {
            formErrors.nicNo = "NIC No is required";
        }

        if (!inputs.date_joined) {
            formErrors.date_joined = "Date Joined is required";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/api/employees/${id}`, {
            name: String(inputs.name),
            age: Number(inputs.age),
            gender: String(inputs.gender),
            designation: String(inputs.designation),
            address: String(inputs.address),
            email: String(inputs.email),
            phone: String(inputs.phone),
            nicNo: String(inputs.nicNo),
            date_joined: String(inputs.date_joined)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            sendRequest()
                .then(() => {
                    toast.success("Employee Details Updated Successfully!", {
                        duration: 3000,
                        position: "top-center",
                        style: {
                            background: "#4CAF50",
                            color: "#fff",
                            padding: "16px",
                            borderRadius: "8px",
                        },
                    });
                    history('/adminEmployeeDetails');
                })
                .catch((error) => {
                    console.error("Error updating employee:", error);
                    toast.error("Failed to update employee. Please try again.", {
                        duration: 3000,
                        position: "top-center",
                        style: {
                            background: "#f44336",
                            color: "#fff",
                            padding: "16px",
                            borderRadius: "8px",
                        },
                    });
                });
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
                {/* Header Section with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                                <FaUserEdit className="text-3xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Update Employee</h1>
                                <p className="text-blue-100 mt-1">Edit employee details</p>
                            </div>
                        </div>
                        <button
                            onClick={() => history('/adminEmployeeDetails')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all"
                        >
                            <FaArrowLeft />
                            <span>Back to Employees</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {/* Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={inputs.name}
                                readOnly
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg cursor-not-allowed"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Age <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={inputs.age}
                                onChange={handleChange}
                                min="25"
                                max="60"
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                placeholder="Enter age (25-60)"
                            />
                            {errors.age && <p className="mt-1 text-sm text-red-400">{errors.age}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="gender"
                                value={inputs.gender}
                                readOnly
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg cursor-not-allowed"
                            />
                            {errors.gender && <p className="mt-1 text-sm text-red-400">{errors.gender}</p>}
                        </div>

                        {/* Designation */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Designation <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="designation"
                                value={inputs.designation}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                            >
                                <option value="">Select Designation</option>
                                <option value="Driver">Driver</option>
                                <option value="Conductor">Conductor</option>
                            </select>
                            {errors.designation && <p className="mt-1 text-sm text-red-400">{errors.designation}</p>}
                        </div>

                        {/* Address */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={inputs.address}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                placeholder="Enter address"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={inputs.email}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                placeholder="Enter email address"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={inputs.phone}
                                onChange={handleChange}
                                pattern="^0\d{9}$"
                                maxLength="10"
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                                placeholder="Enter phone number (0XXXXXXXXX)"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                        </div>

                        {/* NIC No */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                NIC No <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nicNo"
                                value={inputs.nicNo}
                                readOnly
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg cursor-not-allowed"
                            />
                            {errors.nicNo && <p className="mt-1 text-sm text-red-400">{errors.nicNo}</p>}
                        </div>

                        {/* Date Joined */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Date Joined <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date_joined"
                                value={inputs.date_joined}
                                readOnly
                                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg cursor-not-allowed"
                            />
                            {errors.date_joined && <p className="mt-1 text-sm text-red-400">{errors.date_joined}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={() => history('/adminEmployeeDetails')}
                            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Update Employee
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default UpdateEmployee;
