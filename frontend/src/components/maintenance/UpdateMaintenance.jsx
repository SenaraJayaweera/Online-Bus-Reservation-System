import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-hot-toast';

const UpdateMaintenance = ({ id, onClose }) => {
    const maintenanceTypes = [
        "Routine Service",
        "Oil Change",
        "Brake Service",
        "Tire Replacement",
        "Engine Repair",
        "Transmission Service",
        "Air Conditioning",
        "Electrical System",
        "Body Repair",
        "Other"
    ];

    const [form, setForm] = useState({
        busNumber: '',
        maintenanceType: '',
        description: '',
        maintenanceDate: '',
        nextDueDate: '',
        cost: '',
    });
    const [vehicles, setVehicles] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get(`http://localhost:5000/api/maintenance/${id}`),
            axios.get('http://localhost:5000/api/vehicles')
        ]).then(([maintenanceRes, vehiclesRes]) => {
            const data = maintenanceRes.data;
            const formattedData = {
                ...data,
                maintenanceDate: new Date(data.maintenanceDate).toISOString().split('T')[0],
                nextDueDate: new Date(data.nextDueDate).toISOString().split('T')[0],
            };
            setForm(formattedData);
            setVehicles(vehiclesRes.data);
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setErrorMessage('Error fetching data.');
            setLoading(false);
        });
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!form.busNumber.trim()) newErrors.busNumber = 'Bus Number is required';
        if (!form.maintenanceType.trim()) newErrors.maintenanceType = 'Maintenance Type is required';
        if (!form.maintenanceDate) newErrors.maintenanceDate = 'Maintenance Date is required';
        if (!form.nextDueDate) newErrors.nextDueDate = 'Next Due Date is required';
        if (!form.cost || form.cost <= 0) newErrors.cost = 'Cost must be a positive number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!validateForm()) return;

        try {
            await axios.put(`http://localhost:5000/api/maintenance/${id}`, form);
            toast.success('Maintenance record updated successfully!', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#FFFFFF',
                    color: '#000000',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #10B981',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
            });
            onClose();
        } catch (error) {
            setErrorMessage('Failed to update record. Please try again.');
            toast.error('Failed to update maintenance record', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#FFFFFF',
                    color: '#000000',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #EF4444',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
            });
            console.error(error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6">
                    <div className="text-gray-800">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 border border-gray-800 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Update Maintenance Record</h2>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        <IoMdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Bus Number</label>
                        <input
                            type="text"
                            name="busNumber"
                            value={form.busNumber}
                            readOnly
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 opacity-75"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Maintenance Type</label>
                        <select
                            name="maintenanceType"
                            value={form.maintenanceType}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                        >
                            <option value="">Select Maintenance Type</option>
                            {maintenanceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.maintenanceType && <p className="text-red-400 text-sm mt-1">{errors.maintenanceType}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            rows="3"
                            placeholder="Enter description"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Maintenance Date</label>
                            <input
                                type="date"
                                name="maintenanceDate"
                                value={form.maintenanceDate}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            />
                            {errors.maintenanceDate && <p className="text-red-400 text-sm mt-1">{errors.maintenanceDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Next Due Date</label>
                            <input
                                type="date"
                                name="nextDueDate"
                                value={form.nextDueDate}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            />
                            {errors.nextDueDate && <p className="text-red-400 text-sm mt-1">{errors.nextDueDate}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Cost</label>
                        <input
                            type="number"
                            name="cost"
                            value={form.cost}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            placeholder="Enter maintenance cost (Rs.)"
                            min="0"
                            step="0.01"
                        />
                        {errors.cost && <p className="text-red-400 text-sm mt-1">{errors.cost}</p>}
                    </div>

                    {errorMessage && (
                        <div className="text-red-400 text-center">{errorMessage}</div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition duration-200 border border-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Update Maintenance
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateMaintenance;