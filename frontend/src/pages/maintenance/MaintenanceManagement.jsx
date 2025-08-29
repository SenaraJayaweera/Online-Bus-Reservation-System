import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import AddMaintenance from '../../components/maintenance/AddMaintenance';
import UpdateMaintenance from '../../components/maintenance/UpdateMaintenance';
import { FaTools, FaFilePdf, FaPlus } from 'react-icons/fa';
import FloatingShape from '../../components/FloatingShape';
import { toast } from 'react-hot-toast';

const MaintenanceManagement = () => {
    const navigate = useNavigate();
    const { records, filteredRecords, loading, error, fetchRecords, deleteRecord, filterRecords } = useMaintenanceStore();
    const maintenanceTypes = [
        'Routine Service',
        'Oil Change',
        'Brake Service',
        'Tire Replacement',
        'Engine Repair',
        'Body Repair',
        'AC Service',
        'Battery Service',
        'Other'
    ];

    const [showDownloadPopup, setShowDownloadPopup] = useState(false);
    const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
    const [filters, setFilters] = useState({
        busNumber: '',
        maintenanceType: '',
        costMin: '',
        costMax: '',
    });
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

    // Handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        filterRecords(filters);
    }, [filters]);

    const handleDelete = async (id) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = async (id) => {
        try {
            await deleteRecord(id);
            toast.success("Maintenance record deleted successfully!");
            setShowDeleteConfirm(null);
        } catch (error) {
            toast.error("Error deleting maintenance record");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            busNumber: '',
            maintenanceType: '',
            costMin: '',
            costMax: '',
        });
    };

    const handleDownloadReport = () => {
        downloadAsPDF();
    };

    const downloadAsPDF = () => {
        const doc = new jsPDF();
        
        // Add logo
        const img = new Image();
        img.src = '/buisness-logo.png';
        doc.addImage(img, 'PNG', 14, 10, 30, 30);
        
        // Add header
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text('MALSHAN MOTORS', 50, 25);
        doc.setFontSize(16);
        doc.text('Maintenance Management Report', 50, 35);
        
        // Add generation date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

        const tableData = filteredRecords.map(record => [
            record.busNumber,
            record.maintenanceType,
            new Date(record.maintenanceDate).toLocaleDateString(),
            new Date(record.nextDueDate).toLocaleDateString(),
            record.description,
            `Rs. ${record.cost}`
        ]);

        autoTable(doc, {
            head: [['Bus Number', 'Type', 'Date', 'Next Due', 'Description', 'Cost']],
            body: tableData,
            startY: 55,
            theme: 'striped',
            headStyles: {
                fillColor: [51, 51, 51],
                textColor: 255,
                fontStyle: 'bold'
            },
            margin: { top: 55 }
        });

        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 55;
        doc.text(`Total Records: ${filteredRecords.length}`, 14, finalY + 10);

        doc.save('maintenance_report.pdf');
        setShowDownloadPopup(false);
    };

    const handleEdit = (id) => {
        setSelectedMaintenanceId(id);
        setShowUpdatePopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setShowUpdatePopup(false);
        setSelectedMaintenanceId(null);
        fetchRecords(); // Refresh the records after closing popup
        toast.success("Maintenance record updated successfully!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Loading maintenance records...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={fetchRecords}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
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
                className="max-w-7xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
            >
                {/* Header Section with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                                <FaTools className="text-3xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Maintenance Management</h1>
                                <p className="text-blue-100 mt-1">Manage all your vehicle maintenance records in one place</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDownloadReport}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
                            >
                                <FaFilePdf />
                                <span className="font-semibold">Download Report</span>
                            </button>
                            <button
                                onClick={() => setShowAddPopup(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md"
                            >
                                <FaPlus />
                                <span className="font-semibold">Add New Record</span>
                            </button>
                        </div>
                    </div>
                </div>

                <button 
                    className="mb-4 text-gray-300 hover:text-white flex items-center transition duration-200"
                    onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                >
                    <span className={`transform transition-transform ${isFilterCollapsed ? '' : 'rotate-180'} inline-block mr-2`}>▼</span>
                    {isFilterCollapsed ? 'Show Filters' : 'Hide Filters'}
                </button>

                {!isFilterCollapsed && (
                    <div className="p-6 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-300">Filter Maintenance Records</h3>
                            <button
                                onClick={handleResetFilters}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Reset Filters</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                name="busNumber"
                                value={filters.busNumber}
                                onChange={handleFilterChange}
                                placeholder="Search Bus Number"
                                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400"
                            />

                            <select
                                name="maintenanceType"
                                value={filters.maintenanceType}
                                onChange={handleFilterChange}
                                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            >
                                <option value="">All Types</option>
                                {maintenanceTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                name="costMin"
                                value={filters.costMin}
                                onChange={handleFilterChange}
                                placeholder="Min Cost"
                                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400"
                            />

                            <input
                                type="number"
                                name="costMax"
                                value={filters.costMax}
                                onChange={handleFilterChange}
                                placeholder="Max Cost"
                                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400"
                            />
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900/80 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bus Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Next Due</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900/60 backdrop-blur-sm divide-y divide-gray-800">
                            {currentItems.map((record) => (
                                <tr key={record._id} className="hover:bg-gray-600 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.busNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.maintenanceType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(record.maintenanceDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(record.nextDueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{record.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Rs. {record.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <button
                                            onClick={() => handleEdit(record._id)}
                                            className="text-blue-400 hover:text-blue-300 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record._id)}
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

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {showAddPopup && <AddMaintenance onClose={() => {
                setShowAddPopup(false);
                fetchRecords();
            }} />}
            {showUpdatePopup && <UpdateMaintenance id={selectedMaintenanceId} onClose={() => {
                setShowUpdatePopup(false);
                setSelectedMaintenanceId(null);
                fetchRecords();
            }} />}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-300 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-400 mb-6">Are you sure you want to delete this maintenance record? This action cannot be undone.</p>
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
        </div>
    );
};

export default MaintenanceManagement;