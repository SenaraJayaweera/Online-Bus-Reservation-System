import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { styles } from './styles';
import { decodePolyline, formatDuration } from './utils';
import { MAP_CONFIG } from './config';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBooking = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

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

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const busTypes = ['AC Bus', 'Non-AC Bus'];

  const validateName = (name) => name.trim().length > 0;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateDateOfJourney = (date) => new Date(date) >= new Date();
  const validateNumberOfDays = (days) => days > 0;
  const validateBusType = (busType) => busType.trim().length > 0;
  const validateLocation = (location) => location.trim().length > 0;

  const calculateRoute = async () => {
    try {
      setPath(null);
      setDistance('');
      setDuration('');
      setMapKey(Date.now());

      const response = await axios.post('http://localhost:5000/bookings/directions', {
        origin,
        destination,
      });

      if (response.data.routes[0]) {
        const decodedPath = decodePolyline(response.data.routes[0].overview_polyline.points);
        setPath(decodedPath);
        setDistance(response.data.routes[0].legs[0].distance.text);
        setDuration(formatDuration(response.data.routes[0].legs[0].duration.value));
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Failed to calculate route. Please check the locations.');
    }
  };

  const handleSubmit = async () => {
    const validationErrors = {};

    if (!validateName(name)) validationErrors.name = 'Name is required.';
    if (!validateEmail(email)) validationErrors.email = 'Please enter a valid email address.';
    if (!validateDateOfJourney(dateOfJourney)) validationErrors.dateOfJourney = 'Please select a valid date (today or in the future).';
    if (!validateNumberOfDays(numberOfDays)) validationErrors.numberOfDays = 'Number of days must be greater than 0.';
    if (!validateBusType(busType)) validationErrors.busType = 'Bus type is required.';
    if (!validateLocation(origin)) validationErrors.origin = 'Starting location is required.';
    if (!validateLocation(destination)) validationErrors.destination = 'Destination is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.warning('Please fix validation errors.');
      return;
    }

    setErrors({});

    try {
      const response = await axios.post('http://localhost:5000/bookings', {
        name,
        email,
        dateOfJourney,
        numberOfDays,
        busType,
        departureLocation: origin,
        destination,
      });

      if (response.status === 201) {
        toast.success('Booking saved successfully!');
        setTimeout(() => navigate('/BookingDetails'), 2000);
      } else {
        toast.error('Failed to save booking.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('An error occurred while saving booking.');
    }
  };

  const handleButtonHover = (e, isHover) => {
    e.target.style.backgroundColor = isHover ? '2EB62C' : '2EB62C';
    e.target.style.transform = isHover ? 'translateY(-1px)' : 'translateY(0)';
  };

  return (
    <div className="min-h-screen bg-white">
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.title}>Check Your Route</h1>

        <div>
          <input
            style={styles.input}
            type="text"
            className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
            placeholder="Enter starting location"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div>
          <input
            style={styles.input}
            type="text"
            className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <button
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 font-semibold"
          onClick={calculateRoute}
          
        >
          Check Route
        </button>

        {(distance || duration) && (
          <div style={styles.infoCard}>
            {distance && (
              <p style={styles.infoText}>
                <span role="img" aria-label="road">🛣️</span> Distance: {distance}
              </p>
            )}
            {duration && (
              <p style={styles.infoText}>
                <span role="img" aria-label="time">⏱️</span> Duration: {duration}
              </p>
            )}
          </div>
        )}

        <h1 style={styles.title}>Travel Information</h1>

        <div style={styles.inputGroup}>
          <div>
            <input
              style={styles.input}
              type="text"
              className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
              placeholder="Name"
              value={name}
              readOnly
            />
            {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="email"
              className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
              placeholder="Email"
              value={email}
              readOnly
            />
            {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="date"
              className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
              placeholder="Date of Journey"
              value={dateOfJourney}
              onChange={(e) => setDateOfJourney(e.target.value)}
            />
            {errors.dateOfJourney && <span style={{ color: 'red' }}>{errors.dateOfJourney}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="number"
              className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
              placeholder="Number of Days"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
            />
            {errors.numberOfDays && <span style={{ color: 'red' }}>{errors.numberOfDays}</span>}
          </div>
          <div>
            <select
              style={styles.input}
              value={busType}
              className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
              onChange={(e) => setBusType(e.target.value)}
            >
              <option value="">Select Bus Type</option>
              {busTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.busType && <span style={{ color: 'red' }}>{errors.busType}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="text"
              className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
              placeholder="Enter starting location"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
            {errors.origin && <span style={{ color: 'red' }}>{errors.origin}</span>}
          </div>
          <div>
            <input
              style={styles.input}
              type="text"
              className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            {errors.destination && <span style={{ color: 'red' }}>{errors.destination}</span>}
          </div>
          <button
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 font-semibold"
            onClick={handleSubmit}
            
          >
            Submit
            
          </button>
        </div>
      </div>

      <div style={styles.mapWrapper}>
        <LoadScript googleMapsApiKey={MAP_CONFIG.apiKey}>
          <GoogleMap
            key={mapKey}
            mapContainerStyle={styles.map}
            center={MAP_CONFIG.defaultCenter}
            zoom={MAP_CONFIG.defaultZoom}
          >
            {path && (
              <Polyline
                path={path}
                options={{
                  strokeColor: '#4285f4',
                  strokeWeight: 4,
                  strokeOpacity: 0.8,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
    </div>
  );
};

export default AddBooking;
