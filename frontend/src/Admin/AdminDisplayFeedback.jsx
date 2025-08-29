import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaComments,
  FaThumbsUp,
  FaThumbsDown,
  FaLightbulb,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import FloatingShape from "../components/FloatingShape";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/feedback"
    : "/api/feedback";

function AdminDisplayFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch feedback");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (!filters.type) return true;
    return feedback.subject === filters.type;
  });

  const currentFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const getFeedbackColor = (subject) => {
    switch (subject) {
      case "Positive feedback":
        return "bg-green-50 text-green-700 border-green-200";
      case "Negative feedback":
        return "bg-red-50 text-red-700 border-red-200";
      case "Suggestion":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getFeedbackIcon = (subject) => {
    switch (subject) {
      case "Positive feedback":
        return <FaThumbsUp className="mr-2 text-green-600" />;
      case "Negative feedback":
        return <FaThumbsDown className="mr-2 text-red-600" />;
      case "Suggestion":
        return <FaLightbulb className="mr-2 text-blue-600" />;
      default:
        return <FaComments className="mr-2 text-gray-600" />;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 w-4 h-4 inline-block" />
        ) : (
          <FaRegStar key={i} className="text-yellow-300 w-4 h-4 inline-block" />
        )
      );
    }
    return stars;
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
    doc.text('Customer Feedback Report', 50, 35);

    // Add generation date and filter info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);
    
    // Add filter information if a filter is active
    if (filters.type) {
      doc.text(`Filter: ${filters.type}`, 14, 50);
    }

    // Use filteredFeedbacks instead of all feedbacks
    const tableData = filteredFeedbacks.map((feedback) => [
      feedback.name,
      feedback.email,
      feedback.subject,
      feedback.message,
      new Date(feedback.createdAt).toLocaleDateString(),
      feedback.rating || "N/A",
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Subject", "Message", "Date", "Rating"]],
      body: tableData,
      startY: filters.type ? 55 : 50, // Adjust startY based on whether there's a filter
      theme: "striped",
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: 255,
        fontStyle: "bold"
      },
      margin: { top: filters.type ? 55 : 50 }
    });

    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 55;
    doc.text(`Total Records: ${filteredFeedbacks.length}`, 14, finalY + 10);

    // Generate filename based on filter
    const filename = filters.type 
      ? `passenger_feedback_${filters.type.toLowerCase().replace(/\s+/g, '_')}.pdf`
      : 'passenger_feedback_all.pdf';

    doc.save(filename);
    setShowDownloadPopup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-500">
        <p className="text-lg mb-3">{error}</p>
        <button
          onClick={fetchFeedback}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
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
                <FaComments className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Passenger Feedback</h1>
                <p className="text-blue-100 mt-1">View and manage passenger feedback</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
              >
                <FaDownload />
                <span className="font-semibold">
                  {filters.type ? `Download ${filters.type} Report` : 'Download All Report'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-300">Filter Feedbacks</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Feedback Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="block w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2.5 appearance-none hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="Positive feedback">Positive</option>
                <option value="Negative feedback">Negative</option>
                <option value="Suggestion">Suggestion</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-3 text-sm text-gray-400 flex justify-between">
          <span>Found {filteredFeedbacks.length} feedbacks</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {currentFeedbacks.length === 0 ? (
          <div className="text-center py-8">
            <FaComments className="mx-auto text-3xl text-gray-400 mb-3" />
            <p className="text-gray-400 text-sm">No feedback available yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {currentFeedbacks.map((feedback) => (
                <motion.div
                  key={feedback._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`rounded-lg border p-5 transition-all duration-300 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm border-gray-700 hover:shadow-lg hover:border-green-500`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {getFeedbackIcon(feedback.subject)}
                        <h3 className="text-lg font-semibold text-gray-200">
                          {feedback.subject}
                        </h3>
                      </div>
                      {typeof feedback.rating === 'number' && (
                        <div className="mt-1 text-sm">
                          <span className="mr-2 font-medium text-gray-400">Rating:</span>
                          {renderStars(feedback.rating)}
                          <span className="ml-1 text-xs text-gray-500">({feedback.rating}/5)</span>
                        </div>
                      )}
                    </div>
                    {feedback.createdAt && (
                      <div className="text-xs text-gray-400 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(feedback.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-gray-700 bg-opacity-30 rounded-md mb-3">
                    <div className="space-y-1 mb-2 pb-2 border-b border-gray-600">
                      <p className="text-xs font-medium text-gray-400">
                        From: <span className="font-semibold text-gray-200">{feedback.name}</span>
                      </p>
                      <p className="text-xs font-medium text-gray-400">
                        Email: <span className="font-semibold text-gray-200">{feedback.email}</span>
                      </p>
                    </div>
                    <p className="text-gray-300">{feedback.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      </motion.div>
      {showDownloadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Download Report
            </h3>
            <p className="text-gray-600 mb-4">Generate a PDF report of all customer feedbacks</p>
            <div className="space-y-3">
              <button
                onClick={handleDownloadReport}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download PDF Report</span>
              </button>
              <button
                onClick={() => setShowDownloadPopup(false)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDisplayFeedback;