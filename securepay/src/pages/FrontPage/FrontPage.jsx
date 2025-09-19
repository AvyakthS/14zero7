import React, { useState } from "react";
import "./FrontPage.css";

const FrontPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="frontpage-container">
      <header className="navbar">
        <div className="logo">SecurePay</div>
        <div className="navbar-buttons">
          <div className="joinus-dropdown">
            <button className="joinus-btn" onClick={toggleDropdown}>
              Join Us
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <a href="/LoginOrganisation" className="dropdown-item">
                  Organisation
                </a>
                <a href="/LoginUser" className="dropdown-item">
                  User
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* The rest of the JSX remains unchanged */}
      
      <section className="hero-section">
        <div className="text-content">
          <p>It's easy To make Payments with Us.</p>
          <button className="hero-cta-btn">Sign up and start designing</button>
        </div>

        <div className="video-card">
          <img
            src="https://as2.ftcdn.net/v2/jpg/02/80/23/05/1000_F_280230556_JAkW4REfJhMvcwSvcn3IaaRHWtieFVwP.jpg"
            alt="Design Collab"
            className="video-image"
          />
          <div className="video-title">where Security meet's payments</div>
        </div>
      </section>

      <section className="templates-section">
        <h2>How SecurePay processes and secures online payments.</h2>
        <div className="templates-buttons">
          <button className="secondary-btn">Video</button>
          <button className="secondary-btn">Education</button>
        </div>
      </section>
    </div>
  );
};

export default FrontPage;

