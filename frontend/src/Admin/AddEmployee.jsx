import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaArrowLeft } from 'react-icons/fa';
import FloatingShape from '../components/FloatingShape';
import { toast } from 'react-hot-toast';
import './AddEmployee.css';

function AddEmployee() {
  const [inputs, setInputs] = useState({
    name: "",
    age: "",
    gender: "",
    designation: "",
    address: "",
    email: "",
    phone: "",
    nicNo: "",
    date_joined: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Helper to validate Sri Lankan NIC (old and new formats)
  const isValidSriLankanNIC = (nic) => {
    nic = nic.trim().toUpperCase();
    const oldNICPattern = /^\d{9}[V]$/;   // e.g., 123456789V
    const newNICPattern = /^\d{12}$/;      // e.g., 200012345678
    return oldNICPattern.test(nic) || newNICPattern.test(nic);
  };

  // Function to check if NIC is unique
  const checkNICUnique = async (nic) => {
    try {
      console.log('Checking NIC uniqueness for:', nic);
      const response = await axios.get(`http://localhost:5000/api/employees/check-nic?nic=${nic}`);
      console.log('NIC check response:', response.data);
      return !response.data.exists; // returns true if NIC is unique
    } catch (error) {
      console.error("Error checking NIC uniqueness:", error);
      return false; // Assume not unique if there's an error
    }
  };

  const validate = async () => {
    let formErrors = {};

    // Name validation
    if (!inputs.name) {
      formErrors.name = "Name is required";
    }

    // Age validation (25-60)
    if (!inputs.age) {
      formErrors.age = "Age is required";
    } else if (isNaN(inputs.age)) {
      formErrors.age = "Age must be a number";
    } else if (Number(inputs.age) < 25 || Number(inputs.age) > 60) {
      formErrors.age = "Age must be between 25 and 60";
    }

    // Gender validation
    if (!inputs.gender) {
      formErrors.gender = "Gender is required";
    }

    // Designation validation
    if (!inputs.designation) {
      formErrors.designation = "Designation is required";
    }

    // Address validation
    if (!inputs.address) {
      formErrors.address = "Address is required";
    }

    // Email validation
    if (!inputs.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      formErrors.email = "Email is invalid";
    }

    // Phone validation (must start with 0 and must be 10 digits)
    if (!inputs.phone) {
      formErrors.phone = "Phone number is required";
    } else if (inputs.phone.length !== 10) {
      formErrors.phone = "Phone number must be exactly 10 digits";
    } else if (!inputs.phone.startsWith('0')) {
      formErrors.phone = "Phone number must start with 0";
    } else if (!/^\d+$/.test(inputs.phone)) {
      formErrors.phone = "Phone number must contain only digits";
    }

    // NIC No validation (Sri Lankan format)
    if (!inputs.nicNo) {
      formErrors.nicNo = "NIC No is required";
    } else if (!isValidSriLankanNIC(inputs.nicNo)) {
      formErrors.nicNo = "Invalid NIC number (should be 9 digits + V or 12 digits)";
    } else {
      // Check NIC uniqueness only if format is valid
      const isUnique = await checkNICUnique(inputs.nicNo);
      console.log('Is NIC unique:', isUnique);
      if (!isUnique) {
        formErrors.nicNo = "NIC number already exists in employee records";
      }
    }

    // Date Joined validation
    const today = new Date();
    const inputDate = new Date(inputs.date_joined);

    if (!inputs.date_joined) {
      formErrors.date_joined = "Date Joined is required";
    } else if (inputDate > today) {
      formErrors.date_joined = "Future dates are not allowed";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (await validate()) {
      try {
        await sendRequest();
        toast.success("Employee Added Successfully!");
        navigate('/adminEmployeeDetails');
      } catch (error) {
        console.error("Error adding employee:", error);
        if (error.response?.data?.message?.includes('NIC')) {
          setErrors(prev => ({
            ...prev,
            nicNo: "NIC number already exists in employee records"
          }));
        } else {
          toast.error("Failed to add employee. Please try again.");
        }
      }
    }
    setIsSubmitting(false);
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/employees", {
        name: inputs.name,
        age: Number(inputs.age),
        gender: inputs.gender,
        designation: inputs.designation,
        address: inputs.address,
        email: inputs.email,
        phone: String(inputs.phone),
        nicNo: inputs.nicNo,
        date_joined: inputs.date_joined,
      });
      return response.data;
    } catch (error) {
      console.error("Error in sendRequest:", error);
      throw error;
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
                <FaUserPlus className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Add New Employee</h1>
                <p className="text-blue-100 mt-1">Fill in the employee details below</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/adminEmployeeDetails')}
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
                onChange={handleChange}
                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                placeholder="Enter employee name"
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
              <select
                name="gender"
                value={inputs.gender}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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
                <option value="">Select designation</option>
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
                onChange={handleChange}
                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
                placeholder="Enter NIC number"
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
                onChange={handleChange}
                className="block w-full px-4 py-3 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 transition duration-150 ease-in-out"
              />
              {errors.date_joined && <p className="mt-1 text-sm text-red-400">{errors.date_joined}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/adminEmployeeDetails')}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddEmployee;