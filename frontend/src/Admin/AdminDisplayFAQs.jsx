import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";
import { FaDownload, FaQuestionCircle, FaListAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import FloatingShape from "../components/FloatingShape";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/faqs"
    : "/api/faqs";

function AdminDisplayFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      toast.error("Error fetching FAQs.");
    }
  };

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
        <p className="text-gray-400 mb-6">Are you sure you want to delete this FAQ? This action is irreversible!</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => confirmDelete(id, t.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    ));
  };

  const confirmDelete = async (id, toastId) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setFaqs(faqs.filter((faq) => faq._id !== id));
      toast.success("FAQ deleted successfully!");
      toast.dismiss(toastId);
    } catch (error) {
      toast.error("Failed to delete FAQ. Please try again.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableStartY = 30;

    doc.setFontSize(18);
    doc.text("MALSHAN MOTORS - FAQ Report", 14, 20);

    autoTable(doc, {
      startY: tableStartY,
      head: [["Question", "Answer"]],
      body: faqs.map((faq) => [faq.question, faq.answer]),
    });

    doc.save("FAQs_Report.pdf");
    toast.success("PDF downloaded successfully!");
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto p-6 space-y-6"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">FAQ Management</h1>
            <div className="flex gap-4">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
              >
                <FaDownload />
                Download PDF
              </button>
              <button
                onClick={() => navigate("/adminDisplayQuestion")}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaListAlt />
                User Questions
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-600 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white text-lg">
                <th className="border border-gray-600 p-3">Question</th>
                <th className="border border-gray-600 p-3">Answer</th>
                <th className="border border-gray-600 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="border border-gray-600 p-4 text-center text-gray-500">
                    No FAQs available
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq._id} className="bg-gray-700 text-gray-300 hover:bg-gray-600 transition">
                    <td className="border border-gray-600 p-3">{faq.question}</td>
                    <td className="border border-gray-600 p-3">{faq.answer}</td>
                    <td className="border border-gray-600 p-3 flex justify-center gap-4">
  <button
    onClick={() => navigate("/adminupdateFAQ", { state: { faq } })}
    className="px-3 py-1.5 bg-blue-900/50 text-blue-400 rounded-md hover:bg-blue-800/50 transition-all transform hover:scale-105 flex items-center text-sm"
  >
    Update
  </button>
  <button
    onClick={() => handleDelete(faq._id)}
    className="px-3 py-1.5 bg-red-900/50 text-red-400 rounded-md hover:bg-red-800/50 transition-all transform hover:scale-105 flex items-center text-sm"
  >
    Delete
  </button>
</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDisplayFAQs;
