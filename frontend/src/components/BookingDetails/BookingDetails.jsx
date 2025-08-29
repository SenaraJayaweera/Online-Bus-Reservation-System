import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const URL = "http://localhost:5000/bookings";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function BookingDetails() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler();
        setBookings(data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load bookings. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!reason.trim()) {
      toast.warn('Please provide a reason for the cancellation.', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/bookings/${selectedBookingId}`, {
        data: { reason },
      });

      toast.success('Booking deleted successfully!', {
        position: 'top-center',
        autoClose: 2000,
      });

      setBookings(bookings.filter((b) => b._id !== selectedBookingId));
      setSelectedBookingId(null);
      setReason('');
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to delete booking.', {
        position: 'top-center',
        autoClose: 3000,
      });
      console.error(error);
    }
  };

  const generatePDF = (booking, bookingIndex) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = "/buisness-logo.png";

    img.onload = () => {
      doc.addImage(img, "PNG", 14, 10, 30, 30);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("MALSHAN MOTORS", 50, 25);
      doc.setFontSize(20);
      doc.text("Bus Booking Report", 105, 40, { align: "center" });
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);

      doc.setFontSize(14);
      doc.text("Customer Information", 20, 55);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Booking ID:", 20, 65);
      doc.text(`B${String(bookingIndex + 1).padStart(3, '0')}`, 60, 65);

      doc.text("Name:", 20, 75);
      doc.text(`${booking.name}`, 60, 75);
      doc.text("Email:", 20, 85);
      doc.text(`${booking.email}`, 60, 85);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Trip Details", 20, 105);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      doc.text("Date of Journey:", 20, 115);
      doc.text(`${new Date(booking.dateOfJourney).toLocaleDateString()}`, 60, 115);
      doc.text("Number of Days:", 20, 125);
      doc.text(`${booking.numberOfDays}`, 60, 125);
      doc.text("Bus Type:", 20, 135);
      doc.text(`${booking.busType}`, 60, 135);
      doc.text("Departure Location:", 20, 145);
      doc.text(`${booking.departureLocation}`, 60, 145);
      doc.text("Destination:", 20, 155);
      doc.text(`${booking.destination}`, 60, 155);
      doc.text("Distance:", 20, 165);
      doc.text(`${booking.distance} km`, 60, 165);
      doc.text("Duration:", 20, 175);
      doc.text(`${booking.duration}`, 60, 175);

      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Generated on: " + new Date().toLocaleString(), 20, 285);

      doc.save(`Booking_${bookingIndex + 1}.pdf`);
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center py-10 px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 p-8"
      >
        <div className="bg-gradient-to-r from-green-600 text-white p-6 rounded-xl mb-8 shadow-lg flex justify-between items-center">
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <Link
            to="/AddBooking"
            className="bg-white text-green-800 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            + Add New Booking
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 text-gray-300">
            No bookings found. Add your first booking!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="min-w-full table-auto border-collapse text-sm text-gray-200">
              <thead className="bg-gray-900/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Journey Date</th>
                  <th className="px-6 py-3">Days</th>
                  <th className="px-6 py-3">Bus Type</th>
                  <th className="px-6 py-3">From</th>
                  <th className="px-6 py-3">To</th>
                  <th className="px-6 py-3">Distance</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/60 divide-y divide-gray-800">
                {bookings.map((booking, index) => (
                  <tr key={booking._id} className="hover:bg-gray-600 transition">
                    <td className="px-6 py-4">{`B${String(index + 1).padStart(3, '0')}`}</td>
                    <td className="px-6 py-4">{booking.name}</td>
                    <td className="px-6 py-4">{booking.email}</td>
                    <td className="px-6 py-4">{new Date(booking.dateOfJourney).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{booking.numberOfDays}</td>
                    <td className="px-6 py-4">{booking.busType}</td>
                    <td className="px-6 py-4">{booking.departureLocation}</td>
                    <td className="px-6 py-4">{booking.destination}</td>
                    <td className="px-6 py-4">{booking.distance} km</td>
                    <td className="px-6 py-4">{booking.duration}</td>
                    <td className="px-6 py-4 flex flex-col gap-2">
                      <Link
                        to={`/BookingDetails/${booking._id}`}
                        state={booking}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedBookingId(booking._id);
                          setShowModal(true);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => generatePDF(booking, index)}
                        className="text-green-400 hover:text-green-300"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-gray-800">
              <h3 className="text-lg font-semibold mb-2">Confirm Cancel Booking</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to cancel this booking?</p>
              <p className="text-gray-400 mb-6">Please provide a reason for cancellation:</p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full border p-2 rounded mb-4 text-gray-800 mb-6"
                
              />
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowModal(false)}  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                >Cancel</button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes, Cancel booking</button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </motion.div>
    </motion.div>
  );
}

export default BookingDetails;
