import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaComments,
  FaThumbsUp,
  FaThumbsDown,
  FaLightbulb,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import FloatingShape from "../components/FloatingShape";

// Add withCredentials configuration
axios.defaults.withCredentials = true;

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/feedback"
  : "/api/feedback";

function UserMyFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-feedbacks`);
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch feedbacks");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Feedback deleted successfully!");
      setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error("Error deleting feedback");
    }
  };

  const getFeedbackColor = (subject) => {
    switch (subject) {
      case "Positive feedback":
        return "bg-green-900/50 text-green-400 border-green-500";
      case "Negative feedback":
        return "bg-red-900/50 text-red-400 border-red-500";
      case "Suggestion":
        return "bg-blue-900/50 text-blue-400 border-blue-500";
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-500";
    }
  };

  const getFeedbackIcon = (subject) => {
    switch (subject) {
      case "Positive feedback":
        return <FaThumbsUp className="mr-2 text-green-400" />;
      case "Negative feedback":
        return <FaThumbsDown className="mr-2 text-red-400" />;
      case "Suggestion":
        return <FaLightbulb className="mr-2 text-blue-400" />;
      default:
        return <FaComments className="mr-2 text-gray-400" />;
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-red-400">
        <p className="text-lg mb-3">{error}</p>
        <button
          onClick={fetchFeedbacks}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentFeedbacks = feedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

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
                <FaComments className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Feedbacks</h1>
                <p className="text-green-100 mt-1">Manage your submitted feedbacks</p>
              </div>
            </div>
            <Link
              to="/feedback/add"
              className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-md"
            >
              <FaComments />
              <span className="font-semibold">Add Feedback</span>
            </Link>
          </div>
        </div>

        <div className="mb-3 text-sm text-gray-400 flex justify-between">
          <span>Found {feedbacks.length} feedbacks</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {currentFeedbacks.length === 0 ? (
          <div className="text-center py-8">
            <FaComments className="mx-auto text-3xl text-gray-400 mb-3" />
            <p className="text-gray-400 text-sm">You haven't submitted any feedback yet</p>
            <Link
              to="/feedback/add"
              className="mt-3 inline-block text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
            >
              Submit your first feedback
            </Link>
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
                  className={`rounded-lg border p-5 transition-all duration-300 ${getFeedbackColor(feedback.subject)} hover:shadow-lg hover:border-opacity-100`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {getFeedbackIcon(feedback.subject)}
                        <h3 className="text-lg font-semibold">{feedback.subject}</h3>
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
                        {new Date(feedback.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-gray-800/50 rounded-md mb-3">
                    <div className="relative">
                      <p className={`leading-relaxed text-gray-300 break-words ${expandedFeedback === feedback._id ? '' : 'line-clamp-3'}`}>
                        {feedback.message}
                      </p>
                      {feedback.message && feedback.message.length > 150 && (
                        <button
                          onClick={() => setExpandedFeedback(expandedFeedback === feedback._id ? null : feedback._id)}
                          className="mt-1 text-xs font-medium text-blue-400 hover:text-blue-300"
                        >
                          {expandedFeedback === feedback._id ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/feedback/update/${feedback._id}`}
                      className="px-3 py-1.5 bg-blue-900/50 text-blue-400 rounded-md hover:bg-blue-800/50 transition-all transform hover:scale-105 flex items-center text-sm"
                    >
                      
                      Edit
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(feedback._id)}
                      className="px-3 py-1.5 bg-red-900/50 text-red-400 rounded-md hover:bg-red-800/50 transition-all transform hover:scale-105 flex items-center text-sm"
                    >
                     
                      Delete
                    </button>
                  </div>

                  {showDeleteConfirm === feedback._id && (
                    <div className="mt-3 p-3 bg-red-900/50 rounded-md border border-red-500">
                      <p className="text-sm text-red-400 mb-2">Are you sure you want to delete this feedback?</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(feedback._id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-all transform hover:scale-105 text-sm"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 transition-all transform hover:scale-105 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {feedbacks.length > itemsPerPage && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-xs text-gray-400 mb-3 sm:mb-0">
              Showing {Math.min(currentPage * itemsPerPage, feedbacks.length)} of {feedbacks.length} feedbacks
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <FaChevronLeft className="h-3 w-3" />
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <FaChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UserMyFeedbacks;
