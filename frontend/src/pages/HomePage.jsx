import React from 'react';
import './HomePage.css';
import { FaBus, FaMapMarkerAlt, FaClock, FaUsers, FaWifi, FaSnowflake } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="homepage-container">

      {/* Hero Section (Move this UP) */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Journey Begins Here</h1>
          <p>Book your perfect bus tour with comfort and ease</p>
          <div className="hero-buttons">
            <a href="/AddBooking" className="btn-primary">Book Now</a>
            <a href="/vehicles" className="btn-secondary">Explore Tours</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <FaBus className="feature-icon" />
            <h3>Modern Fleet</h3>
            <p>Travel in comfort with our state-of-the-art buses</p>
          </div>
          <div className="feature-card">
            <FaWifi className="feature-icon" />
            <h3>Free WiFi</h3>
            <p>Stay connected throughout your journey</p>
          </div>
          <div className="feature-card">
            <FaSnowflake className="feature-icon" />
            <h3>AC Comfort</h3>
            <p>Climate-controlled environment for your comfort</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Expert Drivers</h3>
            <p>Professional and experienced drivers</p>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="routes-section">
        <h2>Popular <span>Routes</span></h2>
        <div className="routes-grid">
          <div className="route-card">
            <div className="route-info">
              <FaMapMarkerAlt className="route-icon" />
              <div className="route-details">
                <h3>Matara - Jaffna</h3>
                <span className="route-time"><FaClock /> 8h 30m</span>
              </div>
            </div> 
            <a href="/AddBooking" className="route-book-btn">Book Now</a>
          </div>
          <div className="route-card">
            <div className="route-info">
              <FaMapMarkerAlt className="route-icon" />
              <div className="route-details">
                <h3>Matara - Ella</h3>
                <span className="route-time"><FaClock /> 5h 45m</span>
              </div>
            </div>
            <a href="/AddBooking" className="route-book-btn">Book Now</a>
          </div>
          <div className="route-card">
            <div className="route-info">
              <FaMapMarkerAlt className="route-icon" />
              <div className="route-details">
                <h3>Matara - Kandy</h3>
                <span className="route-time"><FaClock /> 4h 15m</span>
              </div>
            </div>
            <a href="/AddBooking" className="route-book-btn">Book Now</a>
          </div>
        </div>
      </section>

      {/* Favorite Destinations Section */}
      <section className="destinations-section">
        <h2>Popular <span>Destinations</span></h2>
        <div className="destinations-grid">
          <div className="destination-card">
            <div className="destination-image">
              <img src="kandy.jpg" alt="Kandy" />
              <div className="destination-overlay">
                <h3>Kandy</h3>
                <p>The Cultural Capital</p>
              </div>
            </div>
            <div className="destination-info">
              <p>Home to the Temple of the Sacred Tooth Relic and beautiful botanical gardens</p>
              <a href="/AddBooking" className="destination-btn">Book Now</a>
            </div>
          </div>

          <div className="destination-card">
            <div className="destination-image">
              <img src="nuwara.jpg" alt="Ella" />
              <div className="destination-overlay">
                <h3>Ella</h3>
                <p>Mountain Paradise</p>
              </div>
            </div>
            <div className="destination-info">
              <p>Scenic hill station with stunning views, waterfalls, and famous Nine Arch Bridge</p>
              <a href="/AddBooking" className="destination-btn">Book Now</a>
            </div>
          </div>

          <div className="destination-card">
            <div className="destination-image">
              <img src="galle.jpg" alt="Galle" />
              <div className="destination-overlay">
                <h3>Galle</h3>
                <p>Historic Fort City</p>
              </div>
            </div>
            <div className="destination-info">
              <p>UNESCO World Heritage site with Dutch colonial architecture and beautiful beaches</p>
              <a href="/AddBooking" className="destination-btn">Book Now</a>
            </div>
          </div>

          <div className="destination-card">
            <div className="destination-image">
              <img src="jaffna.jpg" alt="Jaffna" />
              <div className="destination-overlay">
                <h3>Jaffna</h3>
                <p>The Northern Pearl</p>
              </div>
            </div>
            <div className="destination-info">
              <p>Rich cultural heritage, historic temples, and unique Tamil cuisine</p>
              <a href="/AddBooking" className="destination-btn">Book Now</a>
            </div>
          </div>

          <div className="destination-card">
            <div className="destination-image">
              <img src="kurunagala.jpg" alt="Kurunegala" />
              <div className="destination-overlay">
                <h3>Kurunegala</h3>
                <p>The Rock City</p>
              </div>
            </div>
            <div className="destination-info">
              <p>Ancient kingdom with elephant rock, historic temples, and scenic landscapes</p>
              <a href="/AddBooking" className="destination-btn">Book Now</a>
            </div>
          </div>

          <div className="destination-card">
            <div className="destination-image">
              <img src="anuradhapura.jpg" alt="Anuradhapura" />
              <div className="destination-overlay">
                <h3>Anuradhapura</h3>
                <p>Ancient Capital</p>
              </div>
            </div>
            <div className="destination-info">
              <p>UNESCO World Heritage site with ancient stupas, temples, and sacred Bodhi tree</p>
              <a href="/AddBooking" className="destination-btn">Book Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Section */}
      <div className="service-boxes">
        <div className="service-box">
          <h2>Online Booking</h2>
          <p>Book your bus online – fast, easy & hassle-free travel on your preferred route!</p>
          <div className="hero-buttons">
            <a href="/AddBooking" className="btn-primary">Book Now</a>
          </div>
        </div>

        <div className="service-box">
          <h2>Feedback</h2>
          <p>Share your experience! 🚍✨ Add feedback for your route & help us improve your journey!</p>
          <div className="hero-buttons">
            <a href="/feedback/add" className="btn-primary">Give Feedback</a>
          </div>
        </div>

        <div className="service-box">
          <h2>See FAQs</h2>
          <p>Got questions? 🚍 Check out our FAQs for everything you need to know about bus routes!</p>
          <div className="hero-buttons">
            <a href="/faqs" className="btn-primary">See FAQs</a>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <h2>What Our <span>Customers Say</span></h2>
        <p className="subtitle">Real experiences from our valued passengers</p>

        <div className="testimonials">
          <div className="testimonial">
            <p>"The online booking system is so convenient! I can book my tickets in advance and avoid the long queues."</p>
            <div className="customer-info">
              <div>
                <h4>Rajitha Perera</h4>
                <p>Regular Passenger</p>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <p>"The buses are always clean and well-maintained. The drivers are professional and the journey is comfortable."</p>
            <div className="customer-info">
              <div>
                <h4>Dinesh Silva</h4>
                <p>Business Traveler</p>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <p>"Customer service is excellent! They helped me with my booking issue immediately. Highly recommended!"</p>
            <div className="customer-info">
              <div>
                <h4>Malini Fernando</h4>
                <p>Family Traveler</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
       {/* Footer */}
       <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>About Us</h3>
            <ul className="footer-links">
              <li><a href="#">Our Story</a></li>
              <li><a href="/faqs">FAQs</a></li>
              <li><a href="/feedback/view">Feedback</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/AddBooking">Booking</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Us</h3>
            <div className="footer-contact">
              <p><i className="fas fa-map-marker-alt"></i> Dewndara, Matara, Sri Lanka</p>
              <p><i className="fas fa-phone"></i> 070 2343455</p>
              <p><i className="fas fa-envelope"></i> malshanmotors@gmail.com</p>
            </div>
            <div className="footer-social">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Newsletter</h3>
            <div className="footer-newsletter">
              <p>Subscribe to our newsletter for updates and news.</p>
              <form className="newsletter-form">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Your email address"
                  required
                />
                <button type="submit" className="newsletter-button">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Malshan Motors. All Rights Reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
