import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payments.css";
import profileIcon from "../../../assets/person.png";

const allPayments = [
  { id: "TXN001", paidTo: "SUPRADHEP", amount: "₹69" },
{ id: "TXN001", paidTo: "SUPRADHEP", amount: "₹69" },
  { id: "TXN002", paidTo: "ABC Corp", amount: "₹250" },
  { id: "TXN003", paidTo: "XYZ Ltd", amount: "₹500" },
  { id: "TXN004", paidTo: "John Doe", amount: "₹150" },
  { id: "TXN005", paidTo: "Jane Smith", amount: "₹300" },
  { id: "TXN006", paidTo: "Company A", amount: "₹420" },
  { id: "TXN007", paidTo: "Company B", amount: "₹340" },
];

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const filteredPayments = allPayments.filter((payment) =>
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.amount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (payment) => {
    navigate("/details", { state: { payment } });
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
      <header className="home-header" style={{ display: "flex", justifyContent: "flex-end", position: "relative" }}>
        {/* Removed Sandwich Icon */}
        <div className="profile-icon-container" style={{ position: "relative" }}>
          <img
            src={profileIcon}
            alt="Profile"
            className="profile-icon"
            onClick={toggleDropdown}
            style={{ cursor: "pointer" }}
          />
          {dropdownOpen && (
            <div
              className="dropdown-menu"
              style={{
                position: "absolute",
                top: "45px",
                right: "0",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                width: "180px",
                zIndex: 1000,
                fontSize: "1rem",
              }}
            >
              <div className="dropdown-item" onClick={() => handleDropdownSelect("/manageSubscriptions")} style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                Manage Subscriptions
              </div>
              <div className="dropdown-item" onClick={() => handleDropdownSelect("/settings")} style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                Settings
              </div>
              <div className="dropdown-item" onClick={() => handleDropdownSelect("/profile")} style={{ padding: "12px 16px", cursor: "pointer" }}>
                Profile
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="search-container">
          <input
            type="search"
            placeholder="Search payments"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <section className="prevPayments">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Paid To</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    onClick={() => handleRowClick(payment)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{payment.id}</td>
                    <td>{payment.paidTo}</td>
                    <td>{payment.amount}</td>
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

export default Payments;
