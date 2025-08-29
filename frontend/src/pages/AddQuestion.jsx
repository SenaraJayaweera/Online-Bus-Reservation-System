import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaQuestionCircle, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import FloatingShape from "../components/FloatingShape";

axios.defaults.withCredentials = true;

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/questions"
    : "/api/questions";

function AddQuestion() {
  const { user } = useAuthStore();
  const [question, setQuestion] = useState("");  // Changed title to question
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a question.");
      return;
    }

    if (!question) {  // Changed from title to question
      toast.error("Please fill in the question.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        API_URL,
        {
          question,  // Send the question as part of the request
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,  // Ensure token is sent in the header
          },
        }
      );

      if (response.status === 201) {
        toast.success("Your question has been submitted!");
        setQuestion("");  // Reset question field
        navigate("/displayQuestion");  // Navigate to the /displayQuestion route
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || "Error submitting question."}`
        );
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error submitting question. Please check your connection.");
      }
      console.error(error);
    } finally {
      setLoading(false);
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
        className="max-w-2xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <FaQuestionCircle className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ask a Question</h1>
              <p className="text-green-100 mt-1">We’re here to help! Ask your question below.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Your Name</label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Your Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Question Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
              placeholder="Type your question here"
              required
            />
          </div>

          {/* Back Button and Submit Button */}
          <div className="flex items-center justify-between pt-6">
            <Link
              to="/displayQuestion"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-all transform hover:scale-105"
            >
              <FaArrowLeft />
              <span>Back to My Questions</span>
            </Link>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg transition-all duration-200 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-green-600 transform hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Submit Question</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddQuestion;
