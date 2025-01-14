import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

import { EscortProfile } from './pages/EscortProfile';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { VerifyEmail } from './pages/Auth/VerifyEmail';
import { AuthCallback } from './pages/Auth/AuthCallback';
import { PostAd } from './pages/PostAd';
import { LocationResults } from './pages/LocationResults';
import { AdUpgrade } from './pages/AdUpgrade';
import { MyAds } from './pages/MyAds';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

const theme = createTheme({
  primaryColor: 'pink',
  fontFamily: 'Poppins, sans-serif',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
  },
});

// Wrapper component to handle navbar visibility
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/verify-email', '/auth/callback'].includes(location.pathname);

  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#1A1B1E',
        backgroundImage: isAuthPage ? 
          `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/images/hero.jpg')` :
          `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('/bg-dark.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:state" element={<LocationResults />} />
        <Route path="/location/:state/:city" element={<LocationResults />} />
        <Route path="/escort/:id" element={<EscortProfile />} />
        <Route path="/my-ads" element={<MyAds />} />
        <Route path="/ad/upgrade/:id" element={<AdUpgrade />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/post" element={<PostAd />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications position="top-right" zIndex={1000} />
        <AppContent />
      </MantineProvider>
    </Router>
  );
};

export default App; 