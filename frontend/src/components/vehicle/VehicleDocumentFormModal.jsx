import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useVehicleStore } from '../../store/vehicleStore';
import { FaTimes, FaCloudUploadAlt, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const VehicleDocumentFormModal = ({ isOpen, onClose, editingDocument, onSubmit }) => {
  const { vehicles, fetchVehicles } = useVehicleStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    busNumber: '',
    documentType: 'insurance',
    expiryDate: '',
    documentFile: null,
    status: 'active'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (editingDocument) {
      setForm({
        busNumber: editingDocument.busNumber,
        documentType: editingDocument.documentType,
        expiryDate: new Date(editingDocument.expiryDate).toISOString().split('T')[0],
        status: editingDocument.status
      });
    } else {
      setForm({
        busNumber: '',
        documentType: 'insurance',
        expiryDate: '',
        documentFile: null,
        status: 'active'
      });
    }
  }, [editingDocument]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (editingDocument && ['busNumber', 'documentType', 'expiryDate', 'documentFile'].includes(name)) {
      return;
    }
    if (name === 'documentFile') {
      setForm(prev => ({ ...prev, documentFile: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (editingDocument) {
        formData.append('status', form.status);
      } else {
        Object.keys(form).forEach(key => {
          if (form[key] !== null) {
            formData.append(key, form[key]);
          }
        });
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to save document');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </motion.button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {editingDocument ? 'Update Document Details' : 'Add New Document'}
                </h2>
                <p className="text-gray-400 mt-1">
                  {editingDocument ? 'Modify the document information below' : 'Fill in the document details below'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-900/50 flex items-start gap-3"
                  >
                    <FaExclamationCircle className="text-red-400 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Bus Number Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Bus Number
                  </label>
                  <select
                    name="busNumber"
                    value={form.busNumber}
                    onChange={handleChange}
                    required
                    disabled={editingDocument}
                    className={`w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow bg-gray-800 text-white ${editingDocument ? 'bg-gray-700 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select Bus</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle._id} value={vehicle.vehicleNumber}>
                        {vehicle.vehicleNumber} - {vehicle.make} {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Document Type
                  </label>
                  <select
                    name="documentType"
                    value={form.documentType}
                    onChange={handleChange}
                    required
                    disabled={editingDocument}
                    className={`w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow bg-gray-800 text-white ${editingDocument ? 'bg-gray-700 cursor-not-allowed' : ''}`}
                  >
                    <option value="insurance">Insurance</option>
                    <option value="service">Service Documents</option>
                    <option value="licence">Vehicle License</option>
                    <option value="emissions">Emissions Test</option>
                  </select>
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    required
                    disabled={editingDocument}
                    className={`w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow bg-gray-800 text-white ${editingDocument ? 'bg-gray-700 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* File Upload */}
                {!editingDocument && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Document File
                    </label>
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg group-hover:border-green-500 transition-colors">
                        <div className="space-y-2 text-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors" />
                          </motion.div>
                          <div className="flex text-sm text-gray-400">
                            <label className="relative cursor-pointer rounded-md font-medium text-green-500 hover:text-green-400 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="documentFile"
                                type="file"
                                accept=".pdf"
                                required
                                className="sr-only"
                                onChange={handleChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF up to 10MB</p>
                        </div>
                      </div>
                      {form.documentFile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-gray-400 flex items-center justify-center gap-2"
                        >
                          <span className="text-green-500">✓</span>
                          Selected: {form.documentFile.name}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow bg-gray-800 text-white"
                  >
                    <option value="active">Active</option>
                    {editingDocument && <option value="expired">Expired</option>}
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-6">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                      isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      'Save Document'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VehicleDocumentFormModal;