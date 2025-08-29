import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
    const savedSelections = JSON.parse(localStorage.getItem("selectedQuestions")) || [];
    setSelectedQuestions(savedSelections);
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch questions");
      setLoading(false);
    }
  };

  const handleCheckboxChange = (questionId) => {
    let updatedSelections;

    if (selectedQuestions.includes(questionId)) {
      updatedSelections = selectedQuestions.filter((id) => id !== questionId);
    } else {
      updatedSelections = [...selectedQuestions, questionId];
    }

    setSelectedQuestions(updatedSelections);
    localStorage.setItem("selectedQuestions", JSON.stringify(updatedSelections));
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold">All Questions</h1>
  </div>
</div>

        {currentQuestions.length === 0 ? (
          <div className="text-center py-8">
            <FaQuestionCircle className="mx-auto text-3xl text-gray-400 mb-3" />
            <p className="text-gray-400">No questions found</p>
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
                  className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 hover:border-gray-600 transition flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{question.question}</h3>
                    <div className="text-sm text-gray-400 mt-2">
                      <p><strong>User:</strong> {question.name}</p>
                      <p><strong>Email:</strong> {question.email}</p>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(question.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Checkbox After Question */}
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question._id)}
                    onChange={() => handleCheckboxChange(question._id)}
                    className="w-5 h-5 text-green-600 bg-gray-800 border-gray-700 rounded focus:ring-green-500 ml-3"
                  />
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
