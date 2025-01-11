import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import '@mantine/core/styles.css';

const theme = createTheme({
  primaryColor: 'pink',
  fontFamily: 'Poppins, sans-serif',
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <div 
        className="min-h-screen w-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('/images/hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Navbar />
        <Home />
      </div>
    </MantineProvider>
  );
};

export default App; 