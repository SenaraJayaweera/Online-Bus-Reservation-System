import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaQuestionCircle, FaRegCommentDots } from "react-icons/fa";
import { motion } from "framer-motion"; 
import FloatingShape from "../components/FloatingShape"; 

function AddFAQ() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/faqs", {
        question,
        answer,
      });

      if (response.status === 201) {
        toast.success("FAQ added successfully!");
        setQuestion("");
        setAnswer("");
        navigate("/adminDisplayFAQ");
      }
    } catch (error) {
      toast.error("Error adding FAQ.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      
      {/* Floating Shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Add FAQ
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="text-gray-100">
            
            {/* Question Field */}
            <div className="mb-4 flex items-start gap-3">
              <FaQuestionCircle className="text-emerald-300 mt-3" />
              <div className="flex flex-col w-full">
                <label htmlFor="question" className="font-semibold mb-1">Question:</label>
                <input
                  id="question"
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
              <FaRegCommentDots className="text-emerald-300 mt-3" />
              <div className="flex flex-col w-full">
                <label htmlFor="answer" className="font-semibold mb-1">Answer:</label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="bg-transparent text-white border border-gray-600 rounded-md outline-none w-full py-2 px-3 resize-none h-28"
                  placeholder="Enter the answer"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
              >
                {loading ? "Adding..." : "Add FAQ"}
              </motion.button>

              {/* View FAQ link */}
              <p className="text-center text-sm text-gray-400">
                View all FAQs?{" "}
                <Link to="/adminDisplayFAQ" className="text-green-400 hover:underline">
                  Click here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddFAQ;
