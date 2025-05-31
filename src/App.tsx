import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ToastContainer } from 'react-toastify';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <CartProvider>
        <OrderProvider>
          <div className="min-h-screen bg-gray-50 font-sans">
            <Routes>
              <Route path="/" element={<LandingPage />} />
            
            </Routes>
            <ToastContainer position="top-center" />
          </div>
        </OrderProvider>
      </CartProvider>
    </Router>
  );
}

export default App;