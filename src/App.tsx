import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { ToastContainer } from "react-toastify";
import LandingPage from "./pages/LandingPage";
import ThankYouPage from "./pages/ThankYouPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <Router>
      <CartProvider>
        <OrderProvider>
          <div className="min-h-screen bg-gray-50 font-sans">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
            <ToastContainer position="top-center" />
          </div>
        </OrderProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
