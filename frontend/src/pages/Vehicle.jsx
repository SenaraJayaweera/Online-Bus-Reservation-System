import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import FloatingShape from "../components/FloatingShape";
import VehicleFormModal from "../components/vehicle/VehicleFormModal";
import { FaCar, FaDownload, FaPlus, FaFilter } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Vehicle = () => {
  const busModels = {
    '': [],
    Leyland: ["Olympian", "Titan", "Atlantean", "Tiger", "Royal Tiger"],
    Isuzu: ["Journey", "Erga", "Gala", "Elga", "Citibus"],
    Volvo: ["9700", "9900", "7900", "8900", "B8R"],
    "Mercedes-Benz": ["Citaro", "Tourismo", "Intouro", "Sprinter", "Conecto"]
  };

  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minSeatCount: '',
    maxSeatCount: '',
    status: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, vehicles]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
      setFilteredVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Apply make filter
    if (filters.make) {
      filtered = filtered.filter((vehicle) => vehicle.make === filters.make);
    }

    // Apply model filter only if make is selected and model is selected
    if (filters.make && filters.model) {
      filtered = filtered.filter((vehicle) => vehicle.model === filters.model);
    }

    // Apply seat count filters
    if (filters.minSeatCount || filters.maxSeatCount) {
      filtered = filtered.filter((vehicle) => {
        const seatCount = vehicle.seatCount;
        const minSeatCount = parseInt(filters.minSeatCount) || 0;
        const maxSeatCount = parseInt(filters.maxSeatCount) || Number.MAX_SAFE_INTEGER;
        return seatCount >= minSeatCount && seatCount <= maxSeatCount;
      });
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((vehicle) => vehicle.status === filters.status);
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // If make changes, reset model selection
    if (name === 'make') {
      setFilters({ 
        ...filters, 
        [name]: value,
        model: '' // Reset model when make changes
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
        fetchVehicles(); // Refresh the list after deleting
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleDownloadReport = () => {
    setShowDownloadPopup(true);
  };

  // Removed CSV download in favor of PDF only

  const downloadAsPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Vehicle Management Report', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generated on: ${dateStr}`, 14, 30);
      
      const tableColumn = ["Vehicle Number", "Type", "Make", "Model", "Seats", "Status", "Created Date"];
      const tableRows = filteredVehicles.map(vehicle => [
        vehicle.vehicleNumber,
        vehicle.vehicleType,
        vehicle.make,
        vehicle.model,
        vehicle.seatCount,
        vehicle.status,
        vehicle.createdDate ? new Date(vehicle.createdDate).toLocaleDateString() : 'N/A'
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'striped',
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { top: 35 }
      });
      
      const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 35;
      doc.text(`Total Vehicles: ${filteredVehicles.length}`, 14, finalY + 10);
      
      doc.save('vehicle_report.pdf');
      setShowDownloadPopup(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please check console for details.");
      setShowDownloadPopup(false);
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
                <FaCar className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Vehicle Management</h1>
                <p className="text-blue-100 mt-1">Manage and track your vehicle fleet</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
              >
                <FaPlus />
                <span className="font-semibold">Add Vehicle</span>
              </button>
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
              >
                <FaDownload />
                <span className="font-semibold">Download Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <select
              name="make"
              value={filters.make}
              onChange={handleFilterChange}
              className="bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
            >
              <option value="">All Makes</option>
              <option value="Leyland">Leyland</option>
              <option value="Isuzu">Isuzu</option>
              <option value="Volvo">Volvo</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
            </select>

            <select
              name="model"
              value={filters.model}
              onChange={handleFilterChange}
              disabled={!filters.make}
              className="bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
            >
              <option value="">All Models</option>
              {filters.make && busModels[filters.make] && 
                busModels[filters.make].map(model => (
                  <option key={model} value={model}>{model}</option>
                ))
              }
            </select>

            <input
              type="number"
              name="minSeatCount"
              value={filters.minSeatCount}
              onChange={handleFilterChange}
              placeholder="Min Seats"
              className="bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
            />

            <input
              type="number"
              name="maxSeatCount"
              value={filters.maxSeatCount}
              onChange={handleFilterChange}
              placeholder="Max Seats"
              className="bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
            />

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 text-gray-300">
                <th className="p-4 text-left">Vehicle Number</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Make</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-left">Seats</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <motion.tr
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-gray-700 hover:bg-gray-800/50 transition duration-200"
                >
                  <td className="p-4 text-gray-300">{vehicle.vehicleNumber}</td>
                  <td className="p-4 text-gray-300">{vehicle.vehicleType}</td>
                  <td className="p-4 text-gray-300">{vehicle.make}</td>
                  <td className="p-4 text-gray-300">{vehicle.model}</td>
                  <td className="p-4 text-gray-300">{vehicle.seatCount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      vehicle.status === 'Available' 
                        ? 'bg-green-900/50 text-green-400' 
                        : 'bg-red-900/50 text-red-400'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {modalOpen && (
        <VehicleFormModal
          vehicle={editingVehicle}
          onClose={() => {
            setModalOpen(false);
            setEditingVehicle(null);
          }}
          onSave={() => {
            fetchVehicles();
            setModalOpen(false);
            setEditingVehicle(null);
            toast.success(editingVehicle ? "Vehicle updated successfully!" : "Vehicle added successfully!");
          }}
        />
      )}

      {showDownloadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Download Report</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDownloadPopup(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={downloadAsPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Download PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;