import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaCar, FaBus, FaFilter } from 'react-icons/fa';
import { useVehicleStore } from '../../store/vehicleStore';
import { useNavigate } from 'react-router-dom';
import FloatingShape from '../../components/FloatingShape';

const VehicleCardView = () => {
    const { vehicles, loading, error, fetchVehicles } = useVehicleStore();
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const vehiclesPerPage = 9;
    const [filters, setFilters] = useState({
        type: '',
        seatCount: '',
        status: ''
    });

    const navigate = useNavigate();

    const handleBookNow = () => {
        navigate('/AddBooking');
    }
  

    useEffect(() => {
        fetchVehicles();
    }, []);

    const openVehicleDetails = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowModal(true);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            type: '',
            seatCount: '',
            status: ''
        });
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        return (
            (!filters.type || vehicle.vehicleType === filters.type) &&
            (!filters.seatCount || vehicle.seatCount === parseInt(filters.seatCount)) &&
            (!filters.status || vehicle.status === filters.status)
        );
    });

    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
    const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const VehicleSkeleton = () => (
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 animate-pulse">
            <div className="h-48 bg-gray-200"/>
            <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"/>
                <div className="h-4 bg-gray-200 rounded w-1/2"/>
                <div className="h-4 bg-gray-200 rounded w-2/3"/>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <VehicleSkeleton key={i}/>)}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchVehicles}
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
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                                <FaBus className="text-3xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Browse Vehicles</h1>
                                <p className="text-green-100 mt-1">View and manage your vehicle fleet</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
                    <div className="mb-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium text-gray-300">Filter Vehicles</h3>
                            <p className="text-sm text-gray-400">Use the filters below to find specific vehicles</p>
                        </div>
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                        >
                            <FaFilter />
                            Reset Filters
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle Type</label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="">All Types</option>
                                <option value="AC Bus">AC Bus</option>
                                <option value="Non-AC Bus">Non-AC Bus</option>
                            </select>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Seat Count</label>
                            <input
                                type="number"
                                name="seatCount"
                                value={filters.seatCount}
                                onChange={handleFilterChange}
                                placeholder="Enter seat count"
                                min="1"
                                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="">All Statuses</option>
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                    {/* Results Count */}
                    <motion.div
                        key={filteredVehicles.length}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-300 mb-6 flex items-center gap-2"
                    >
                        Found <span className="font-semibold text-white">{filteredVehicles.length}</span> vehicles
                    </motion.div>

                    {/* Vehicle Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentVehicles.map(vehicle => (
                            <motion.div
                                key={vehicle._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer"
                                onClick={() => openVehicleDetails(vehicle)}
                            >
                                <div className="relative">
                                    <div className="h-48 bg-gray-100">
                                        {vehicle.image ? (
                                            <img
                                                src={vehicle.image}
                                                alt={`${vehicle.make} ${vehicle.model}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaCar className="text-gray-400 text-4xl" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            vehicle.status === 'Available'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-red-100 text-red-700 border border-red-200'
                                        }`}>
                                            {vehicle.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                                            {vehicle.make} {vehicle.model}
                                        </h3>
                                        <p className="text-sm text-gray-500">{vehicle.vehicleNumber}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {vehicle.vehicleType}
                                            </span>
                                            <span className="inline-flex items-center bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {vehicle.seatCount} Seats
                                            </span>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Added: {new Date(vehicle.createdDate).toLocaleDateString()}
                                            </span>
                                            <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                                                View Details →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredVehicles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-600 py-12"
                        >
                            <FaCar className="mx-auto text-4xl mb-4 text-gray-400" />
                            <p className="text-lg">No vehicles found.</p>
                        </motion.div>
                    )}

                    {/* Add Pagination Controls */}
                    {filteredVehicles.length > 0 && (
                        <div className="mt-8 flex justify-center items-center gap-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-300 hover:text-gray-800"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-3 py-1 rounded-lg border ${
                                        currentPage === index + 1
                                            ? 'bg-green-600 border-green-500 text-white'
                                            : 'border-gray-300 hover:bg-gray-50 text-gray-300 hover:text-gray-800'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-300 hover:text-gray-800"
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Enhanced Modal */}
                    <AnimatePresence>
                        {showModal && selectedVehicle && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                                onClick={() => setShowModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    className="bg-white rounded-xl max-w-2xl w-full p-2 shadow-2xl max-h-[55vh] overflow-y-auto"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* Modal Header */}
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-base font-bold text-gray-800">Vehicle Details</h2>
                                                <span className="bg-blue-50 text-blue-700 px-2 rounded text-xs font-medium">
                                                    {selectedVehicle.vehicleNumber}
                                                </span>
                                                <span className={`px-2 rounded text-xs font-medium ${
                                                    selectedVehicle.status === 'Available'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-red-50 text-red-700'
                                                }`}>
                                                    {selectedVehicle.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="p-0.5"
                                        >
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Modal Content */}
                                    <div className="space-y-2">
                                        <div className="h-96 rounded-lg overflow-hidden bg-gray-100">
                                            {selectedVehicle.image ? (
                                                <img
                                                    src={selectedVehicle.image}
                                                    alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FaCar className="text-gray-400 text-3xl" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Make & Model</h3>
                                                <p className="text-base font-semibold text-gray-800">
                                                    {selectedVehicle.make} {selectedVehicle.model}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Vehicle Type</h3>
                                                <p className="text-base font-semibold text-gray-800">
                                                    {selectedVehicle.vehicleType}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Seat Capacity</h3>
                                                <p className="text-base font-semibold text-gray-800">
                                                    {selectedVehicle.seatCount} Seats
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Added Date</h3>
                                                <p className="text-base font-semibold text-gray-800">
                                                    {selectedVehicle.createdDate ? new Date(selectedVehicle.createdDate).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-200">
                                            {selectedVehicle.status === 'Available' && (
                                                <button
                                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
                                                onClick={handleBookNow}
                                              >
                                                Book Now
                                              </button>
                                            )}

                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default VehicleCardView