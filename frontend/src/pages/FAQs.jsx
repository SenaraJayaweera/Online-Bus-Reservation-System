import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaQuestionCircle } from "react-icons/fa";
import image13 from "./image13.png";
import FloatingShape from "../components/FloatingShape";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // 🔑 Link to route

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(API_URL);
      setFaqs(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch FAQs");
      setLoading(false);
    }
  };

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Floating Shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      {/* Motion Div for Animated Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 z-10"
      >
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            <FaQuestionCircle className="inline mr-3" />
            Frequently Asked Questions
          </h2>

          {/* FAQ List */}
          <div className="faq-list">
            {faqs.length === 0 ? (
              <p className="text-gray-500">No FAQs available.</p>
            ) : (
              faqs.map((faq, index) => (
                <div key={faq._id} className="faq-item mb-4 bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition">
                  <div
                    className={`faq-question flex justify-between items-center text-lg font-semibold cursor-pointer ${
                      activeIndex === index ? "bg-green-600 text-white" : "text-gray-300"
                    } p-4 rounded-lg`}
                    onClick={() => toggleAnswer(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle text-2xl font-bold">
                      {activeIndex === index ? "-" : "+"}
                    </span>
                  </div>

                  {activeIndex === index && (
                    <div className="faq-answer mt-4 bg-gray-800 p-4 rounded-lg text-gray-200">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Question Button */}
          <div className="mt-8">
            <Link
              to="/addQuestion" // Navigate to add question page
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
            >
              Any Question?
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Floating image */}
      <div className="absolute top-[10%] left-[5%] opacity-20 z-0">
        <img src={image13} alt="FAQ Illustration" className="w-80 h-80" />
      </div>
    </div>
  );
}

export default FAQs;
