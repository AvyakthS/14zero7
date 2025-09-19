import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'
import profileIcon from '../../../assets/person.png' // Use an appropriate profile icon

const sampleTransactions = [
  { id: 'TXN001', name: 'John Doe', amount: '₹500' },
  { id: 'TXN002', name: 'Jane Smith', amount: '₹750' },
  { id: 'TXN003', name: 'Ravi Kumar', amount: '₹300' },
  { id: 'TXN004', name: 'Anita Sharma', amount: '₹900' },
  { id: 'TXN005', name: 'Kiran Desai', amount: '₹650' },
]

const HomeOrganisation = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    // Close dropdown when clicking outside
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

  const filteredTransactions = sampleTransactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.amount.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDropdownClick = (to) => {
    setDropdownOpen(false)
    switch (to) {
      case 'manage':
        navigate('/Subscribers') // Assuming 'Manage Subscriptions' goes to Subscribers page
        break
      case 'profile':
        navigate('/profile') // Adjust if profile page route exists
        break
      case 'settings':
        navigate('/settings') // Adjust if settings page route exists
        break
      default:
        break
    }
  }

  return (
    <div className="home-container">
      {/* Top Bar */}
      <header className="top-bar">
        {/* Search bar in center */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search transactions by ID, name or amount"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Profile icon top-right with dropdown */}
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

      {/* Main content: transactions list */}
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

        {/* Button to go to Subscribers page */}
        <div className="subscribers-button-container">
          <button onClick={() => navigate('/subscribers')}>
            View All Subscribers
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <span
          className="terms-link"
          onClick={() => navigate('/T&D')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate('/T&D') }}
        >
          Terms and Conditions
        </span>
      </footer>
    </div>
  )
}

export default HomeOrganisation
