import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import VehicleFormModal from '../../components/vehicle/VehicleFormModal';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useVehicleStore } from '../../store/vehicleStore';
import { FaBus, FaFilePdf, FaPlus } from 'react-icons/fa';
import FloatingShape from '../../components/FloatingShape';
import { toast } from 'react-hot-toast';

const VehicleManagement = () => {
  const { vehicles, filteredVehicles, loading, error, fetchVehicles, deleteVehicle, filterVehicles } = useVehicleStore();
  
  // Define available bus models for the form
  const busModels = {
    Leyland: ["Olympian", "Titan", "Atlantean", "Tiger", "Royal Tiger"],
    Isuzu: ["Journey", "Erga", "Gala", "Elga", "Citibus"],
    Volvo: ["9700", "9900", "7900", "8900", "B8R"],
    "Mercedes-Benz": ["Citaro", "Tourismo", "Intouro", "Sprinter", "Conecto"]
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    minSeatCount: '',
    maxSeatCount: '',
    status: '',
  });

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDelete = async (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id) => {
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted successfully!");
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error("Error deleting vehicle");
    }
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
    doc.text('Vehicle Management Report', 50, 35);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

    const tableData = filteredVehicles.map(vehicle => [
      vehicle.vehicleNumber,
      vehicle.vehicleType,
      vehicle.make,
      vehicle.model,
      vehicle.seatCount,
      vehicle.status,
      vehicle.createdDate ? new Date(vehicle.createdDate).toLocaleDateString() : 'N/A'
    ]);

    autoTable(doc, {
      head: [['Vehicle Number', 'Type', 'Make', 'Model', 'Seats', 'Status', 'Created Date']],
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
    doc.text(`Total Vehicles: ${filteredVehicles.length}`, 14, finalY + 10);

    doc.save('vehicle_report.pdf');
    setShowDownloadPopup(false);
  };

  const handleClosePopup = (action) => {
    setModalOpen(false);
    setEditingVehicle(null);
    fetchVehicles(); // Refresh the vehicles after closing popup
    if (action === "update") {
        toast.success("Vehicle details updated successfully!");
    } else if (action === "add") {
        toast.success("New vehicle added successfully!");
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
                <FaBus className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Vehicle Management</h1>
                <p className="text-blue-100 mt-1">Manage all your vehicles in one place</p>
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
                onClick={() => { setEditingVehicle(null); setModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md"
              >
                <FaPlus />
                <span className="font-semibold">Add Vehicle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md mb-6">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Filter Vehicles</h3>
              <p className="text-sm text-gray-400">Use the filters below to find specific vehicles</p>
            </div>
            <button
              onClick={() => setFilters({
                make: '',
                minSeatCount: '',
                maxSeatCount: '',
                status: ''
              })}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">Make</label>
              <select
                name="make"
                value={filters.make}
                onChange={handleFilterChange}
                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Makes</option>
                <option value="Leyland">Leyland</option>
                <option value="Isuzu">Isuzu</option>
                <option value="Volvo">Volvo</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
              </select>
              <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Seats</label>
              <div className="relative">
                <input
                  type="number"
                  name="minSeatCount"
                  value={filters.minSeatCount}
                  onChange={handleFilterChange}
                  placeholder="Enter minimum"
                  className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Seats</label>
              <div className="relative">
                <input
                  type="number"
                  name="maxSeatCount"
                  value={filters.maxSeatCount}
                  onChange={handleFilterChange}
                  placeholder="Enter maximum"
                  className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Make</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900/60 backdrop-blur-sm divide-y divide-gray-800">
              {currentItems.map((vehicle) => (
                <tr key={vehicle._id} className="hover:bg-gray-600 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.vehicleNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.vehicleType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.make}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.seatCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle._id)}
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

        {modalOpen && (
          <VehicleFormModal
            setModalOpen={setModalOpen}
            fetchVehicles={fetchVehicles}
            editingVehicle={editingVehicle}
            busModels={busModels}
            onClose={handleClosePopup}
          />
        )}

        {/* Download Options Popup */}
        {showDownloadPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Download Report</h3>
              <p className="text-gray-600 mb-4">Choose download format:</p>
              <div className="space-y-3">
                <button 
                  onClick={downloadAsPDF}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download as PDF</span>
                </button>
                <button 
                  onClick={() => setShowDownloadPopup(false)}
                  className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-300 mb-4">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this vehicle? This action cannot be undone.</p>
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
    </div>
  );
};

export default VehicleManagement;