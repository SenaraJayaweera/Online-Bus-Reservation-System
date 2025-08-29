import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FloatingShape from '../../components/FloatingShape';

const ViewCard = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cvvVisibility, setCvvVisibility] = useState({});
  const [cardToDelete, setCardToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/paymentCards');
      setCards(response.data.paymentCards);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch cards', error);
      setError('Failed to load cards. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleDelete = (card) => {
    setCardToDelete(card);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/paymentCards/${cardToDelete._id}`);
      toast.success('Card deleted successfully!');
      setCards(cards.filter((c) => c._id !== cardToDelete._id));
      setCardToDelete(null);
    } catch (err) {
      toast.error('Failed to delete card.');
      console.error(err);
    }
  };

  const toggleCVV = (cardId) => {
    setCvvVisibility((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const getMaskedCardNumber = (cardNumber) => `•••• ${cardNumber.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {cardToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
            <h2 className="text-xl font-semibold">Delete Card</h2>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this card?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                onClick={() => setCardToDelete(null)}
                

              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full mx-auto p-8 mt-10 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <FontAwesomeIcon icon={faCcVisa} className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Saved Cards</h1>
                <p className="text-green-100 mt-1">Manage your stored payment methods</p>
              </div>
            </div>
            <button
              className="bg-white text-green-700 px-6 py-3 rounded-xl shadow-md hover:bg-green-100 transition flex items-center gap-2 font-semibold"
              onClick={() => navigate('/AddCard')}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add New Card
            </button>
          </div>
        </div>

        {/* Cards Display */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-8 text-gray-300">No cards found. Add your first card!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card) => (
              <div
                key={card._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transition-transform transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <FontAwesomeIcon
                    icon={card.cardType === 'Visa' ? faCcVisa : faCcMastercard}
                    className="text-3xl text-emerald-700"
                  />
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete"
                    onClick={() => handleDelete(card)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>

                <div className="space-y-4 text-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Card Number</span>
                    <span className="font-mono font-semibold">
                      {getMaskedCardNumber(card.cardNumber)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Card Holder</span>
                    <span className="font-semibold">{card.cardHolderName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expiry Date</span>
                    <span className="font-semibold">{card.expiryDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ViewCard;
