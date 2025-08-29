import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuestionCircle, FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FloatingShape from "../components/FloatingShape";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/questions"
  : "/api/questions";

function UserMyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-questions`);
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch questions");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Question deleted successfully!");
      setQuestions(questions.filter((q) => q._id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error("Error deleting question");
    }
  };

  const currentQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-red-400">
        <p className="text-lg mb-3">{error}</p>
        <button
          onClick={fetchQuestions}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Questions</h1>
            <Link
              to="/addQuestion"
              className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition"
            >
              Ask Question
            </Link>
          </div>
        </div>

        {currentQuestions.length === 0 ? (
          <div className="text-center py-8">
            <FaQuestionCircle className="mx-auto text-3xl text-gray-400 mb-3" />
            <p className="text-gray-400">You haven't asked any questions yet</p>
            <Link to="/questions/add" className="text-blue-400 hover:text-blue-300">
              Ask your first question
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {currentQuestions.map((question) => (
                <motion.div
                  key={question._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 hover:border-gray-600 transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">{question.question}</h3>
                    <div className="text-xs text-gray-400">
                      <FaCalendarAlt className="inline mr-1" />
                      {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/updateQuestion/${question._id}`}
                      className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded hover:bg-blue-800/50 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => setShowDeleteConfirm(question._id)}
                      className="px-3 py-1 bg-red-900/50 text-red-400 rounded hover:bg-red-800/50 transition"
                    >
                      Delete
                    </button>
                  </div>

                  {showDeleteConfirm === question._id && (
                    <div className="mt-3 p-3 bg-red-900/50 rounded border border-red-500">
                      <p className="text-sm text-red-400">Are you sure you want to delete this question?</p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleDelete(question._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-800 text-gray-400 rounded hover:bg-gray-700"
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

        {questions.length > itemsPerPage && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-800 text-gray-400 hover:bg-gray-700"
            >
              <FaChevronLeft />
            </button>

            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-800 text-gray-400 hover:bg-gray-700"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UserMyQuestions;
