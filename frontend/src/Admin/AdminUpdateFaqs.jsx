import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaQuestionCircle, FaCommentAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import FloatingShape from "../components/FloatingShape";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

const confirmationToast = (message, onConfirm, onCancel) => {
  return toast.custom((t) => (
    <div
      className={`bg-gray-900 text-white p-6 rounded-xl shadow-xl border border-gray-700 max-w-sm w-full transform ${
        t.visible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      <h3 className="text-xl font-bold mb-2">Confirmation</h3>
      <p className="text-gray-400 mb-4">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onCancel && onCancel();
          }}
          className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  ));
};

function UpdateFaqs() {
  const location = useLocation();
  const navigate = useNavigate();
  const faq = location.state?.faq || {};

  const [question, setQuestion] = useState(faq.question || "");
  const [answer, setAnswer] = useState(faq.answer || "");

  const handleUpdate = (e) => {
    e.preventDefault();

    confirmationToast("Are you sure you want to update this FAQ?", async () => {
      try {
        await axios.put(`${API_URL}/${faq._id}`, { question, answer });
        toast.success("FAQ updated successfully!");
        navigate("/adminDisplayFAQ");
      } catch (error) {
        toast.error("Error updating FAQ");
      }
    });
  };

  const handleDelete = () => {
    confirmationToast("Are you sure you want to delete this FAQ?", async () => {
      try {
        await axios.delete(`${API_URL}/${faq._id}`);
        toast.success("FAQ deleted successfully!");
        navigate("/adminDisplayFAQ");
      } catch (error) {
        toast.error("Error deleting FAQ");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      
      {/* Floating Shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Update FAQ
        </h2>

        <form onSubmit={handleUpdate}>
          <div className="text-gray-100">
            {/* Question Field */}
            <div className="mb-4 flex items-start gap-3">
              <FaQuestionCircle className="text-emerald-300 mt-3" />
              <div className="flex flex-col w-full">
                <label className="font-semibold mb-1">Question:</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-transparent text-white border border-gray-600 rounded-md outline-none w-full py-2 px-3"
                  placeholder="Enter question"
                  required
                />
              </div>
            </div>

            {/* Answer Field */}
            <div className="mb-4 flex items-start gap-3">
              <FaCommentAlt className="text-emerald-300 mt-3" />
              <div className="flex flex-col w-full">
                <label className="font-semibold mb-1">Answer:</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="bg-transparent text-white border border-gray-600 rounded-md outline-none w-full py-2 px-3 resize-none h-28"
                  placeholder="Enter the answer"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Update
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleDelete}
                className="w-full py-3 px-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700"
              >
                Delete
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate("/adminDisplayFAQ")}
                className="w-full py-3 px-4 bg-gray-400 text-gray-800 font-bold rounded-lg shadow-lg hover:bg-gray-500"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default UpdateFaqs;
