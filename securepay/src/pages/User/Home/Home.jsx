import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import profileIcon from '../../../assets/person.png' // Profile icon

const sampleTransactions = [
  { id: 'TXN101', name: 'Alice Patel', amount: '₹450' },
  { id: 'TXN102', name: 'Bob Kumar', amount: '₹850' },
  { id: 'TXN103', name: 'Charlie Singh', amount: '₹250' },
  { id: 'TXN104', name: 'Diana Reddy', amount: '₹1200' },
  { id: 'TXN105', name: 'Esha Gupta', amount: '₹700' },
]

const HomeUser = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredTransactions = sampleTransactions.filter(txn =>
    txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.amount.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDropdownClick = (to) => {
    setDropdownOpen(false)
    switch (to) {
      case 'manage':
        navigate('/subscribers') // Manage subscriptions path (if applies)
        break
      case 'profile':
        navigate('/profile')
        break
      case 'settings':
        navigate('/settings')
        break
      default:
        break
    }
  }

  return (
    <div className="home-user-container">
      {/* Top Bar */}
      <header className="top-bar">
        {/* Search bar center */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search payments by ID, name or amount"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Profile menu toggle */}
        <div className="profile-menu" ref={dropdownRef}>
          <img
            src={profileIcon}
            alt="Profile"
            className="profile-icon"
            onClick={() => setDropdownOpen(prev => !prev)}
          />
          {dropdownOpen && (
            <ul className="dropdown-list">
              <li onClick={() => handleDropdownClick('manage')}>Manage Subscriptions</li>
              <li onClick={() => handleDropdownClick('profile')}>Profile</li>
              <li onClick={() => handleDropdownClick('settings')}>Settings</li>
            </ul>
          )}
        </div>
      </header>

      {/* Transactions list */}
      <main className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="no-results">No transactions found.</div>
        ) : (
          filteredTransactions.slice(0, 5).map(txn => (
            <div
              key={txn.id}
              className="transaction-item"
              onClick={() => navigate('/details')}
            >
              <div><strong>Transaction ID:</strong> {txn.id}</div>
              <div><strong>Name:</strong> {txn.name}</div>
              <div><strong>Amount:</strong> {txn.amount}</div>
            </div>
          ))
        )}

        {/* Button to View All Your Subscriptions */}
        <div className="subscriptions-button-container" style={{ marginTop: '18px', marginBottom: '8px' }}>
          <button onClick={() => navigate('/subscriptions')}>
            View All Your Subscriptions
          </button>
        </div>

        {/* Button to Payments page */}
        <div className="subscribers-button-container" style={{ marginTop: '16px' }}>
          <button onClick={() => navigate('/payments')}>
            View All Payments
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <span
          className="terms-link"
          onClick={() => navigate('/TermsConditions')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate('/TermsConditions') }}
        >
          Terms and Conditions
        </span>
      </footer>
    </div>
  )
}

export default HomeUser
