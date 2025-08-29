import React from "react";
import "./Footer.css"; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>About Us</h3>
          <p>
            Malshan Motors provides efficient bus services with real-time tracking, 
            online booking, and optimized routes for improved passenger experience.
          </p>
          <div className="footer-social">
            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/homepage">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/vehicle">Vehicles</a></li>
            <li><a href="/faqs">FAQs</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Contact Us</h3>
          <div className="footer-contact">
            <p><i className="fas fa-map-marker-alt"></i> 123 Street Name, City, Country</p>
            <p><i className="fas fa-phone"></i> +1 234 567 890</p>
            <p><i className="fas fa-envelope"></i> info@malshanmotors.com</p>
          </div>
        </div>
        
        <div className="footer-column">
          <h3>Newsletter</h3>
          <div className="footer-newsletter">
            <p>Subscribe to our newsletter for updates and news.</p>
            <form className="newsletter-form">
              <input type="email" className="newsletter-input" placeholder="Your email address" />
              <button type="submit" className="newsletter-button">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2023 Malshan Motors. All Rights Reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </div>
    </footer>
  );
};

export default Footer;
