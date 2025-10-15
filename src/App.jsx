
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

import Account from "./pages/Account";
import OrderSuccess from "./pages/OrderSuccess";
import RequireAuth from "./components/RequireAuth";
import CategoryPage from "./pages/CategoryPage";

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
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} /> {/* Profile page */}
        <Route path="/account-auth" element={<AuthPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/checkout" element={<RequireAuth> <Checkout /></RequireAuth>} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/brand/:slug" element={<Brand />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/search" element={<Search />} />



        <Route path="/brand/:slug" element={<Brand />} />


        <Route path="/product/:id" element={<ProductPage />} />


        <Route path="/search" element={<Search />} />


        <Route path="/cart" element={<Cart />} />


        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}

