import React, { useState } from 'react';
import axios from 'axios';
import './AddCard.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import FloatingShape from '../FloatingShape';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCard = () => {
    const navigate = useNavigate();

    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: ''
    });

    const [errors, setErrors] = useState({});

    const validateCardNumber = (cardNumber) => /^\d{16}$/.test(cardNumber);

    const validateExpiryDate = (expiryDate) => {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(expiryDate)) return false;

        const [month, year] = expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (parseInt(year) < currentYear) return false;
        if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;

        return true;
    };

    const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardDetails({ ...cardDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!validateCardNumber(cardDetails.cardNumber)) {
            validationErrors.cardNumber = 'Card number must be 16 digits.';
        }
        if (!validateExpiryDate(cardDetails.expiryDate)) {
            validationErrors.expiryDate = 'Expiry date must be in MM/YY format and not expired.';
        }
        if (!validateCVV(cardDetails.cvv)) {
            validationErrors.cvv = 'CVV must be 3 or 4 digits.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        const maskedCardNumber = `**** **** **** ${cardDetails.cardNumber.slice(-4)}`;

        try {
            await axios.post('http://localhost:5000/paymentCards', {
                ...cardDetails,
                cardNumber: maskedCardNumber,
            });

            toast.success('Card added successfully!', {
                position: 'top-center',
                autoClose: 3000,
            });

            setTimeout(() => navigate('/ViewCard'), 3000);
        } catch (error) {
            toast.error('Failed to add card', {
                position: 'top-center',
                autoClose: 3000,
            });
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
            <ToastContainer />
            <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
            <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
            <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full mx-auto p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <FaCreditCard className="text-3xl" />
                        <div>
                            <h1 className="text-2xl font-bold">Add New Card</h1>
                            <p className="text-blue-100 text-sm">Fill in your card details below</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/ViewCard')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Card Number</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleChange}
                            placeholder="1234567812345678"
                            maxLength="16"
                            required
                            className="w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.cardNumber && <p className="text-sm text-red-400 mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Card Holder Name</label>
                        <input
                            type="text"
                            name="cardHolderName"
                            value={cardDetails.cardHolderName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Expiry Date (MM/YY)</label>
                        <input
                            type="text"
                            name="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            required
                            className="w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.expiryDate && <p className="text-sm text-red-400 mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">CVV</label>
                        <input
                            type="password"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            maxLength="4"
                            required
                            className="w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.cvv && <p className="text-sm text-red-400 mt-1">{errors.cvv}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 font-semibold"
                    >
                        Add Card
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddCard;
