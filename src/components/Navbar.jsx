// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Cart context: open the drawer + items for the badge
  const { openCart, items } = useCart();
  const itemCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      const q = query.trim();
      if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
      closeMenu();
    }
  };

  return (
    <header className="nav">
      <div className="nav__container">
        <Link to="/" className="nav__logo" onClick={closeMenu}>
          SEEMAB
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav__links">
          <NavLink to="/women">Women</NavLink>
          <NavLink to="/men">Men</NavLink>
          <NavLink to="/kids">Kids</NavLink>
          <NavLink to="/lawn">Lawn</NavLink>
          <NavLink to="/pret">Pret</NavLink>
          <NavLink to="/unstitched">Unstitched</NavLink>
          <NavLink to="/footwear">Footwear</NavLink>
        </nav>

        {/* Right Icons */}
        <div className="nav__icons">
          <div className="nav__search">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKey}
            />
          </div>

          {/* Profile (placeholder) */}
          
          <button 
          type="button"
            className="icon-btn"
            aria-label="Profile"
            onClick={() => navigate("/account")}
            title="Profile"
          >
           <FaUser className="icon" onClick={() => navigate("/auth")} />
          </button>

          {/* CART: opens the cart drawer */}
          <button className="icon" aria-label="Open cart" onClick={openCart}>
            <FaShoppingCart />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {/* Mobile hamburger */}
          <button className="icon nav__menu" aria-label="Open menu" onClick={toggleMenu}>
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile__menu ${menuOpen ? "show" : ""}`}>
        <div className="mobile__header">
          <h3>SHOP.CO</h3>
          <button className="icon close" aria-label="Close menu" onClick={closeMenu}>
            <FaTimes />
          </button>
        </div>

        {/* Mobile search */}
        <div className="nav__search" style={{ marginTop: 10 }}>
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKey}
          />
        </div>

        <nav className="mobile__links">
          <NavLink onClick={closeMenu} to="/women">Women</NavLink>
          <NavLink onClick={closeMenu} to="/men">Men</NavLink>
          <NavLink onClick={closeMenu} to="/kids">Kids</NavLink>
          <NavLink onClick={closeMenu} to="/lawn">Lawn</NavLink>
          <NavLink onClick={closeMenu} to="/pret">Pret</NavLink>
          <NavLink onClick={closeMenu} to="/unstitched">Unstitched</NavLink>
          <NavLink onClick={closeMenu} to="/footwear">Footwear</NavLink>
        </nav>
      </div>

      {/* Backdrop */}
      {menuOpen && <div className="backdrop" onClick={closeMenu} />}
    </header>
  );
}
