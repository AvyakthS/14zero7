import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './pages/FrontPage/FrontPage';
import LoginOrganisation from './pages/Organisation/Login/Login';
import HomeOrganisation from './pages/Organisation/Home/Home';
import LoginUser from './pages/User/Login/Login';
import HomeUser from './pages/User/Home/Home'; 
import Payments from './pages/User/Payments/Payments';
import Subscribers from './pages/Organisation/Subscribers/Subscribers';
import Details from './pages/details/details';
const App = () => {
  return (
    <div>
        <Router>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/LoginOrganisation" element={<LoginOrganisation />} />
          <Route path="/homeOrganisation" element={<HomeOrganisation />} />
          <Route path="/LoginUser" element={<LoginUser />} />
          <Route path="/homeUser" element={<HomeUser />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/subscribers" element={<Subscribers />} />
          <Route path="/details" element={<Details />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

