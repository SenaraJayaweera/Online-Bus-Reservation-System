import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useVehicleDocumentStore } from '../../store/vehicleDocumentStore';
import VehicleDocumentFormModal from '../../components/vehicle/VehicleDocumentFormModal';
import { FaFileAlt, FaPlus, FaDownload, FaEdit, FaTrash, FaFilter, FaSearch, FaFilePdf } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import FloatingShape from '../../components/FloatingShape';

const VehicleDocumentManagement = () => {
  const { 
    documents, 
    filteredDocuments, 
    loading, 
    error, 
    fetchDocuments, 
    addDocument, 
    updateDocument, 
    deleteDocument,
    filterDocuments 
  } = useVehicleDocumentStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [filters, setFilters] = useState({
    busNumber: '',
    documentType: '',
    status: ''
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments(filters);
  }, [filters]);

  const handleAddDocument = async (formData) => {
    try {
      await addDocument(formData);
      toast.success('Document added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add document');
      throw error;
    }
  };

  const handleUpdateDocument = async (formData) => {
    try {
      await updateDocument(editingDocument._id, formData);
      toast.success('Document updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update document');
      throw error;
    }
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
        toast.success('Document deleted successfully');
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const handleDownload = (document) => {
    try {
      window.open(`http://localhost:5000/${document.documentFile}`, '_blank');
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to start download');
    }
  };

  const handleDownloadPDF = () => {
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
    doc.text('Vehicle Documents Report', 50, 35);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

    // Define the table columns and data
    const tableData = filteredDocuments.map(doc => [
      doc.busNumber,
      getDocumentTypeLabel(doc.documentType),
      new Date(doc.expiryDate).toLocaleDateString(),
      doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
    ]);

    // Generate the table using autoTable
    autoTable(doc, {
      head: [['Bus Number', 'Document Type', 'Expiry Date', 'Status']],
      body: tableData,
      startY: 55,
      headStyles: { 
        fillColor: [51, 51, 51],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 55;
    doc.text(`Total Documents: ${filteredDocuments.length}`, 14, finalY + 10);

    doc.save('vehicle-documents-report.pdf');
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
      busNumber: '',
      documentType: '',
      status: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeLabel = (type) => {
    const types = {
      insurance: 'Insurance',
      service: 'Service Documents',
      licence: 'Vehicle License',
      emissions: 'Emissions Test'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <button
          onClick={fetchDocuments}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                <FaFileAlt className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Vehicle Documents</h1>
                <p className="text-blue-100 mt-1">Manage and track vehicle documents</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
              >
                <FaFilePdf />
                <span className="font-semibold">Download Report</span>
              </button>
              <button
                onClick={() => {
                  setEditingDocument(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md"
              >
                <FaPlus />
                <span className="font-semibold">Add Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Filter Documents</h3>
              <p className="text-sm text-gray-400">Use the filters below to find specific documents</p>
            </div>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset Filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">Bus Number</label>
              <select
                name="busNumber"
                value={filters.busNumber}
                onChange={handleFilterChange}
                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Buses</option>
                {documents.map(doc => doc.busNumber)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map(busNumber => (
                    <option key={busNumber} value={busNumber}>
                      {busNumber}
                    </option>
                  ))
                }
              </select>
              <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">Document Type</label>
              <select
                name="documentType"
                value={filters.documentType}
                onChange={handleFilterChange}
                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Document Types</option>
                <option value="insurance">Insurance</option>
                <option value="service">Service Documents</option>
                <option value="licence">Vehicle License</option>
                <option value="emissions">Emissions Test</option>
              </select>
              <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
              <div className="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-gray-800/50 rounded-xl shadow-md border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Bus Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Document Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                {currentItems.map((document, index) => (
                  <motion.tr
                    key={document._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {document.busNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {getDocumentTypeLabel(document.documentType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(document.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleDownload(document)}
                          className="text-green-400 hover:text-green-300 transition-colors p-1"
                          title="Download"
                        >
                          PDF
                        </button>

                        <button
                          onClick={() => {
                            setEditingDocument(document);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900 rounded-md transition-all duration-200 space-x-1"
                        >
                          
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredDocuments.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-gray-400"
              >
                <FaFileAlt className="text-4xl mb-4" />
                <p className="text-lg">No documents found</p>
                <p className="text-sm mt-2">Try adjusting your filters or add a new document</p>
              </motion.div>
            )}

            {/* Pagination Controls */}
            {filteredDocuments.length > 0 && (
              <div className="flex items-center justify-center border-t border-gray-700 bg-gray-800 px-4 py-3 sm:px-6">
                <div className="flex items-center justify-center">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pageNumber === currentPage
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-300 ring-1 ring-inset ring-gray-700 hover:bg-gray-700 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>

        <VehicleDocumentFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDocument(null);
          }}
          editingDocument={editingDocument}
          onSubmit={editingDocument ? handleUpdateDocument : handleAddDocument}
        />
      </motion.div>
    </div>
  );
};

export default VehicleDocumentManagement;