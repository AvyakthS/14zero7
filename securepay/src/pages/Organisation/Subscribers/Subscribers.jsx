import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Subscribers.css";
import profileIcon from "../../../assets/person.png";

const allSubscribers = [
  { id: "SUB001", name: "Alice Patel", plan: "Premium" },
  { id: "SUB002", name: "Bob Kumar", plan: "Basic" },
  { id: "SUB003", name: "Charlie Singh", plan: "Standard" },
  { id: "SUB004", name: "Diana Reddy", plan: "Premium" },
  { id: "SUB005", name: "Esha Gupta", plan: "Basic" },
];

const Subscribers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredSubscribers = allSubscribers.filter(
    (subscriber) =>
      subscriber.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (subscriber) => {
    // Navigate to details page. Pass subscriber data if needed.
    navigate("/details", { state: { subscriber } });
  };

  const handleTermsClick = () => {
    navigate("/TermsConditions");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownSelect = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <div className="home-container">
      {/* Profile icon fixed to top right */}
      <div className="profile-menu" ref={dropdownRef}>
        <img
          src={profileIcon}
          alt="Profile"
          className="profile-icon"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => handleDropdownSelect("/manageSubscriptions")}
            >
              Manage Subscriptions
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleDropdownSelect("/settings")}
            >
              Settings
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleDropdownSelect("/profile")}
            >
              Profile
            </div>
          </div>
        )}
      </div>

      <main className="main-content">
        <div className="search-container">
          <input
            type="search"
            placeholder="Search subscribers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <section className="subscriberList">
          <table>
            <thead>
              <tr>
                <th>Subscriber ID</th>
                <th>Name</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    onClick={() => handleRowClick(subscriber)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{subscriber.id}</td>
                    <td>{subscriber.name}</td>
                    <td>{subscriber.plan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="home-footer">
        <span className="terms-link" onClick={handleTermsClick}>
          Terms and Conditions
        </span>
      </footer>
    </div>
  );
};

export default Subscribers;
