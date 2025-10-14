// src/App.js
import "./App.css";
import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Brand from "./pages/Brand";
import Checkout from "./pages/Checkout";
import AuthPage from "./pages/AuthPage";

// Categories
import Women from "./pages/Women";
import Men from "./pages/Men";
import Kids from "./pages/Kids";
import Lawn from "./pages/Lawn";
import Pret from "./pages/Pret";
import Unstitched from "./pages/Unstitched";
import Footwear from "./pages/Footwear";
import Account from "./pages/Account";
import OrderSuccess from "./pages/OrderSuccess";
import RequireAuth from "./components/RequireAuth";

// Search
import Search from "./pages/Search";

// Cart
import Cart from "./pages/Cart"; // (optional page)
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";

function NotFound() {
  return (
    <div className="section container" style={{ textAlign: "center", marginTop: 60 }}>
      <h2>404 — Page not found</h2>
      <p>The page you’re looking for doesn’t exist or has been moved.</p>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar />
      <CartDrawer /> {/* ⬅️ Drawer lives here once */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Categories */}
        <Route path="/women" element={<Women />} />
        <Route path="/men" element={<Men />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/lawn" element={<Lawn />} />
        <Route path="/pret" element={<Pret />} />
        <Route path="/unstitched" element={<Unstitched />} />
        <Route path="/footwear" element={<Footwear />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/checkout" element={<RequireAuth> <Checkout /></RequireAuth>} />

  
        {/* Brand filter */}
        <Route path="/brand/:slug" element={<Brand />} />

        {/* Product details */}
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Search */}
        <Route path="/search" element={<Search />} />

        {/* Optional dedicated cart page */}
        <Route path="/cart" element={<Cart />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}
