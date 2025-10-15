// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { getCategories, toSlug } from "../lib/fakestore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState([]);     // dynamic categories
  const navigate = useNavigate();

  const { openCart, items } = useCart();
  const itemCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  useEffect(() => {
    let alive = true;
    getCategories()
      .then((list) => alive && setCats(list))
      .catch(() => setCats([]));
    return () => { alive = false; };
  }, []);

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

        {/* Desktop Nav Links (built from FakeStore categories) */}
        <nav className="nav__links">
          {cats.map((c) => (
            <NavLink key={c} to={`/category/${toSlug(c)}`} onClick={closeMenu}>
              {c.replace(/^\w/, (m) => m.toUpperCase())}
            </NavLink>
          ))}
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

          {/* Profile */}
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
          <h3>SEEMAB</h3>
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
          {cats.map((c) => (
            <NavLink key={c} onClick={closeMenu} to={`/category/${toSlug(c)}`}>
              {c.replace(/^\w/, (m) => m.toUpperCase())}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Backdrop */}
      {menuOpen && <div className="backdrop" onClick={closeMenu} />}
    </header>
  );
}
