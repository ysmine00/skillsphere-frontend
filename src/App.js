import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

// Protected pages - Main sections
import Dashboard from './pages/Dashboard/Dashboard';
import SkillsMarketplace from './pages/SkillsMarketplace/SkillsMarketplace';
import Exchanges from './pages/Exchanges/Exchanges';

// Profile related pages
import Profile from './pages/Profile/Profile';
import ProfileEdit from './pages/Profile/ProfileEdit';
import ProfileSkills from './pages/ProfileSkills/ProfileSkills';

// Offerings related pages
import Offerings from './pages/Offerings/Offerings';
import NewOffering from './pages/Offerings/NewOffering';
import OfferingDetails from './pages/Offerings/OfferingDetails';

// Requests related pages
import Requests from './pages/Requests/Requests';
import NewRequest from './pages/Requests/NewRequest';
import RequestDetails from './pages/Requests/RequestDetails';

// Exchange details page
import ExchangeDetails from './pages/Exchanges/ExchangeDetails';

// Authentication guard component
import PrivateRoute from './components/PrivateRoute';

// Error and utility pages
import NotFound from './pages/NotFound/NotFound';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<Home />} /> {/* Placeholder - create About page later */}
        <Route path="/contact" element={<Home />} /> {/* Placeholder - create Contact page later */}
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Skills Marketplace */}
          <Route path="/skills-marketplace" element={<SkillsMarketplace />} />
          
          {/* Profile routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/profile/skills" element={<ProfileSkills />} />
          
          {/* Offerings routes */}
          <Route path="/offerings" element={<Offerings />} />
          <Route path="/offerings/new" element={<NewOffering />} />
          <Route path="/offerings/:id" element={<OfferingDetails />} />
          <Route path="/offerings/edit/:id" element={<NewOffering />} /> {/* Reuse NewOffering with edit mode */}
          
          {/* Requests routes */}
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/new" element={<NewRequest />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/requests/edit/:id" element={<NewRequest />} /> {/* Reuse NewRequest with edit mode */}
          
          {/* Exchanges routes */}
          <Route path="/exchanges" element={<Exchanges />} />
          <Route path="/exchanges/:id" element={<ExchangeDetails />} />
        </Route>
        
        {/* Fallback for unmatched routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;