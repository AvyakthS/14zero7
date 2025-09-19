import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./details.css";

const allPayments = [
  { id: "TXN009", paidTo: "SUPRADHEP", amount: "₹69", date: "2023-09-01" },
  { id: "TXN001", paidTo: "SUPRADHEP", amount: "₹69", date: "2023-08-01" },
  { id: "TXN002", paidTo: "ABC Corp", amount: "₹250", date: "2023-08-15" },
  { id: "TXN003", paidTo: "XYZ Ltd", amount: "₹500", date: "2023-09-05" },
  { id: "TXN004", paidTo: "John Doe", amount: "₹150", date: "2023-07-18" },
  { id: "TXN005", paidTo: "Jane Smith", amount: "₹300", date: "2023-09-11" },
  { id: "TXN006", paidTo: "Company A", amount: "₹420", date: "2023-08-21" },
  { id: "TXN007", paidTo: "Company B", amount: "₹340", date: "2023-08-28" },
];

const Details = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const currentPayment = state?.payment;

  // Include all payments for current recipient including the selected one
  const relatedPayments = allPayments.filter(
    (payment) => payment.paidTo === currentPayment?.paidTo
  );

  // Sort payments by date descending (most recent first)
  const sortedPayments = relatedPayments.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="details-container">
      <header className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <span className="details-title">
          Payment History with {currentPayment?.paidTo}
        </span>
      </header>

      <main className="details-content">
        <section className="prevPayments">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Paid To</th>
                <th>Amount Paid</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No payments found.
                  </td>
                </tr>
              ) : (
                sortedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className={
                      payment.id === currentPayment?.id ? "current-payment-row" : ""
                    }
                  >
                    <td>{payment.id}</td>
                    <td>{payment.paidTo}</td>
                    <td>{payment.amount}</td>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="details-footer">
        <span
          className="terms-link"
          onClick={() => navigate("/TermsConditions")}
          style={{ cursor: "pointer" }}
        >
          Terms and Conditions
        </span>
      </footer>
    </div>
  );
};

export default Details;

