import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaComments,
    FaUser,
    FaThumbsUp,
    FaThumbsDown,
    FaLightbulb,
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaStar,
    FaRegStar,
    FaFilter,
} from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import FloatingShape from "../components/FloatingShape";

const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000/api/feedback"
        : "/api/feedback";

function UserViewFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuthStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
    const [expandedFeedback, setExpandedFeedback] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");

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

    const filteredFeedbacks = feedbacks.filter(feedback => {
        if (activeFilter === "all") return true;
        return feedback.subject === activeFilter;
    });

    const currentFeedbacks = filteredFeedbacks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setCurrentPage(1);
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
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                                <FaComments className="text-3xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Community Feedback</h1>
                                <p className="text-green-100 mt-1">See what others are saying</p>
                            </div>
                        </div>
                        {isAuthenticated && (
                            <div className="flex gap-4">
                                <Link
                                    to="/feedback/my-feedbacks"
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-md"
                                >
                                    <FaUser />
                                    <span className="font-semibold">My Feedbacks</span>
                                </Link>
                                <Link
                                    to="/feedback/add"
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-md"
                                >
                                    <FaComments />
                                    <span className="font-semibold">Add Feedback</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Replace Filter Buttons with Dropdown */}
                <div className="mb-6 flex justify-end">
                    <div className="relative">
                        <select
                            value={activeFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="appearance-none bg-gray-800 text-gray-300 px-4 py-2 pr-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="all">All Feedbacks</option>
                            <option value="Positive feedback">Positive Feedbacks</option>
                            <option value="Negative feedback">Negative Feedbacks</option>
                            <option value="Suggestion">Suggestions</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <FaFilter />
                        </div>
                    </div>
                </div>

                <div className="mb-3 text-sm text-gray-400 flex justify-between">
                    <span>Found {filteredFeedbacks.length} feedbacks</span>
                    <span>Page {currentPage} of {totalPages}</span>
                </div>

                {currentFeedbacks.length === 0 ? (
                    <div className="text-center py-8">
                        <FaComments className="mx-auto text-3xl text-gray-400 mb-3" />
                        <p className="text-gray-400 text-sm">No feedback available yet</p>
                        {isAuthenticated && (
                            <Link
                                to="/feedback/add"
                                className="mt-3 inline-block text-green-400 hover:text-green-300 transition-colors duration-200 text-sm"
                            >
                                Be the first to give feedback
                            </Link>
                        )}
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
                                        <div className="space-y-1 mb-2 pb-2 border-b border-gray-700">
                                            <p className="text-xs font-medium text-gray-400">
                                                From: <span className="font-semibold text-gray-300">{feedback.name}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">{feedback.email}</p>
                                        </div>

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
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {filteredFeedbacks.length > itemsPerPage && (
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-xs text-gray-400 mb-3 sm:mb-0">
                            Showing {Math.min(currentPage * itemsPerPage, filteredFeedbacks.length)} of {filteredFeedbacks.length} feedbacks
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

export default UserViewFeedback;
