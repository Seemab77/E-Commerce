// src/App.js
import "./App.css";
import { Routes, Route } from "react-router-dom";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";

// Category Pages
import Women from "./pages/Women";
import Men from "./pages/Men";
import Kids from "./pages/Kids";
import Lawn from "./pages/Lawn";
import Pret from "./pages/Pret";
import Unstitched from "./pages/Unstitched";
import Footwear from "./pages/Footwear";

// 404 Fallback Page
function NotFound() {
  return (
    <div className="section container" style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>404 — Page not found</h2>
      <p>The page you’re looking for doesn’t exist or has been moved.</p>
    </div>
  );
}

// Main App
export default function App() {
  return (
    <>
      {/* Navbar visible on all pages */}
      <Navbar />

      {/* All Routes */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Category Pages */}
        <Route path="/women" element={<Women />} />
        <Route path="/men" element={<Men />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/lawn" element={<Lawn />} />
        <Route path="/pret" element={<Pret />} />
        <Route path="/unstitched" element={<Unstitched />} />
        <Route path="/footwear" element={<Footwear />} />

        {/* Product Details Page */}
        <Route path="/product/:id" element={<ProductPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer visible on all pages */}
      <Footer />
    </>
  );
}
