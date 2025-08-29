import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { styles } from './styles';
import { decodePolyline, formatDuration } from './utils';
import { MAP_CONFIG } from './config';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfJourney, setDateOfJourney] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [busType, setBusType] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [path, setPath] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [mapKey, setMapKey] = useState(Date.now());
  const [errors, setErrors] = useState({});

  const busTypes = ['AC Bus', 'Non-AC Bus'];

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/bookings/${id}`);
        const booking = response.data;

        setName(booking.name);
        setEmail(booking.email);
        setDateOfJourney(booking.dateOfJourney);
        setNumberOfDays(booking.numberOfDays);
        setBusType(booking.busType);
        setOrigin(booking.departureLocation);
        setDestination(booking.destination);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to fetch booking data.');
      }
    };

    fetchBooking();
  }, [id]);

  const validateName = (name) => name.trim().length > 0;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateDateOfJourney = (date) => new Date(date) >= new Date();
  const validateNumberOfDays = (days) => days > 0;
  const validateLocation = (location) => location.trim().length > 0;

  const calculateRoute = async () => {
    try {
      setPath(null);
      setDistance('');
      setDuration('');
      setMapKey(Date.now());

      const response = await axios.post('http://localhost:5000/bookings/directions', {
        origin,
        destination
      });

      if (response.data.routes[0]) {
        const decodedPath = decodePolyline(response.data.routes[0].overview_polyline.points);
        setPath(decodedPath);
        setDistance(response.data.routes[0].legs[0].distance.text);
        setDuration(formatDuration(response.data.routes[0].legs[0].duration.value));
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      setPath(null);
      setDistance('');
      setDuration('');
      toast.error('Failed to calculate route.');
    }
  };

  const handleUpdate = async () => {
    const validationErrors = {};
    if (!validateName(name)) validationErrors.name = 'Name is required.';
    if (!validateEmail(email)) validationErrors.email = 'Please enter a valid email address.';
    if (!validateDateOfJourney(dateOfJourney)) validationErrors.dateOfJourney = 'Select a valid future date.';
    if (!validateNumberOfDays(numberOfDays)) validationErrors.numberOfDays = 'Days must be greater than 0.';
    if (!validateLocation(origin)) validationErrors.origin = 'Starting location is required.';
    if (!validateLocation(destination)) validationErrors.destination = 'Destination is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const journeyDate = new Date(dateOfJourney);
    const currentDate = new Date();
    const diffDays = Math.ceil((journeyDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 5) {
      toast.error('You cannot update booking within 5 days of the journey.', {
        onClose: () => navigate('/BookingDetails'),
        autoClose: 3000
      });
      return;
    }
    

    setErrors({});
    try {
      const response = await axios.put(`http://localhost:5000/bookings/${id}`, {
        name,
        email,
        dateOfJourney,
        numberOfDays,
        busType,
        departureLocation: origin,
        destination
      });

      if (response.status === 200) {
        toast.success('Booking updated successfully!');
        setTimeout(() => navigate('/BookingDetails'), 1500);
      } else {
        toast.error('Failed to update booking.');
      }
    } catch (error) {
      console.error('Error updating booking:', error.response ? error.response.data : error.message);
      toast.error('An error occurred while updating booking.');
    }
  };

  const handleButtonHover = (e, isHover) => {
    e.target.style.backgroundColor = isHover ? '#3367d6' : '#4285f4';
    e.target.style.transform = isHover ? 'translateY(-1px)' : 'translateY(0)';
  };

  return (
    <div className="min-h-screen bg-white">

    <div style={styles.container}>
      
      <div style={styles.form}>
        <h1 style={styles.title}>Check Your Route</h1>

        <input
          style={styles.input}
          type="text"
          placeholder="Enter starting location"
          className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button
         className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 font-semibold"
          onClick={calculateRoute}
         
        >
          Check Route
        </button>

        {(distance || duration) && (
          <div style={styles.infoCard}>
            {distance && <p style={styles.infoText}>🛣️ Distance: {distance}</p>}
            {duration && <p style={styles.infoText}>⏱️ Duration: {duration}</p>}
          </div>
        )}

        <h1 style={styles.title}>Update Travel Information</h1>

        <div style={styles.inputGroup}>
          <input style={styles.input} type="text"
          
          className={`w-full px-4 py-3 rounded-md border border-gray-300 placeholder-gray-500 ${
            true ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-black'
          }`}
           placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} readOnly />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}

          <input style={styles.input} type="email"
          className={`w-full px-4 py-3 rounded-md border border-gray-300 placeholder-gray-500 ${
            true ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-black'
          }`} 
          placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}

          <input style={styles.input} type="date"
          className={`w-full px-4 py-3 rounded-md border border-gray-300 placeholder-gray-500 ${
            true ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-black'
          }`}
           value={dateOfJourney} onChange={(e) => setDateOfJourney(e.target.value)} readOnly />
          {errors.dateOfJourney && <span style={{ color: 'red' }}>{errors.dateOfJourney}</span>}

          <input style={styles.input} type="number"
          className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
           placeholder="Number of Days" value={numberOfDays} onChange={(e) => setNumberOfDays(e.target.value)} />
          {errors.numberOfDays && <span style={{ color: 'red' }}>{errors.numberOfDays}</span>}

          <input style={styles.input} type="text" 
          className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
          placeholder="Enter starting location" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          {errors.origin && <span style={{ color: 'red' }}>{errors.origin}</span>}

          <input style={styles.input} type="text"
          className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
           placeholder="Enter destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
          {errors.destination && <span style={{ color: 'red' }}>{errors.destination}</span>}

          <button
           className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 font-semibold"
            onClick={handleUpdate}
           
          >
            Update Booking
          </button>
        </div>
      </div>

      <div style={styles.mapWrapper}>
        <LoadScript googleMapsApiKey={MAP_CONFIG.apiKey}>
          <GoogleMap key={mapKey} mapContainerStyle={styles.map} center={MAP_CONFIG.defaultCenter} zoom={MAP_CONFIG.defaultZoom}>
            {path && <Polyline path={path} options={{ strokeColor: '#4285f4', strokeWeight: 4, strokeOpacity: 0.8 }} />}
          </GoogleMap>
        </LoadScript>
      </div>
      
      <ToastContainer position="top-center" autoClose={3000} />

    </div>
    </div>
  );
};

export default UpdateBooking;
