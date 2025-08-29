import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaQuestionCircle, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import FloatingShape from "../components/FloatingShape";

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api/questions"
  : "/api/questions";

function UserUpdateQuestion() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState({ title: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state?.question) {
      setQuestion({ title: state.question.question });
      setLoading(false);
    } else {
      fetchQuestion();
    }
  }, [id, state]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-questions/${id}`);
      setQuestion({ title: response.data.question });
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch question");
      setLoading(false);
      toast.custom((t) => (
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
          <h3 className="text-xl font-bold mb-4">Error</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      ));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.title) {
      toast.custom((t) => (
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
          <h3 className="text-xl font-bold mb-4">Error</h3>
          <p className="text-gray-400 mb-6">Please enter the question title.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      ));
      return;
    }

    // Show a custom confirmation toast before proceeding with the update
    toast.custom((t) => (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
        <h3 className="text-xl font-bold mb-4">Confirm Update</h3>
        <p className="text-gray-400 mb-6">Are you sure you want to update this question?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              toast.dismiss(t.id); // Close the confirmation toast
              toast.success("Update cancelled.");
            }}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
  onClick={async () => {
    try {
      setSubmitting(true);
      await axios.put(`${API_URL}/${id}`, { question: question.title });
      toast.success("Question updated successfully!");

      // After successful update, navigate to the display question page
      navigate("/displayQuestion");
    } catch (error) {
      toast.error("Error updating question. Please try again.");
    } finally {
      setSubmitting(false);
    }

    toast.dismiss(t.id); // Close the confirmation toast
  }}
  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
>
  Confirm
</button>

        </div>
      </div>
    ));
  };

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
          onClick={fetchQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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
        className="max-w-2xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <FaQuestionCircle className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Update Question</h1>
              <p className="text-green-100">Edit your question title</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Question Title</label>
            <input
              type="text"
              value={question.title}
              onChange={(e) => setQuestion({ title: e.target.value })}
              className="w-full p-3 bg-gray-900 text-gray-300 rounded-lg border border-gray-800 focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
              placeholder="Enter question title..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Link
              to="/displayQuestion"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white"
            >
              <FaArrowLeft />
              Back
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg transition ${
                submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"
              }`}
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <FaPaperPlane />
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default UserUpdateQuestion;
