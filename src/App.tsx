import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import AfroKinkyCollection from './components/AfroKinkyCollection';
import ProductPage from './components/ProductPage';
import AboutUs from './components/AboutUs';
import CartPage from './components/CartPage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';

const HomePage = () => (
  <>
    <Hero />
     <AfroKinkyCollection />
    <AboutUs />
  </>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection/afro-kinky-bulk" element={<AfroKinkyCollection />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;