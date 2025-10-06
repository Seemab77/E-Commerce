// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav__container">
        {/* Logo → Home */}
        <Link to="/" className="nav__logo" onClick={() => setOpen(false)}>
          SHOP.CO
        </Link>

        {/* Center links (localized) */}
        <nav className="nav__links">
          <NavLink to="/women" className="nav__link">Women</NavLink>
          <NavLink to="/men" className="nav__link">Men</NavLink>
          <NavLink to="/kids" className="nav__link">Kids</NavLink>
          <NavLink to="/lawn" className="nav__link">Lawn</NavLink>
          <NavLink to="/pret" className="nav__link">Pret</NavLink>
          <NavLink to="/unstitched" className="nav__link">Unstitched</NavLink>
          <NavLink to="/footwear" className="nav__link">Footwear</NavLink>
        </nav>

        {/* Right: search + icons + mobile burger */}
        <div className="nav__right">
          <div className="nav__search">
            <span aria-hidden>🔎</span>
            <input type="search" placeholder="Search products…" />
          </div>
          <button className="icon-btn" aria-label="Account">👤</button>
          <button className="icon-btn" aria-label="Cart">🛒</button>
          <button
            className="hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav__mobile ${open ? "show" : ""}`}>
        <NavLink to="/women" onClick={() => setOpen(false)} className="nav__mLink">Women</NavLink>
        <NavLink to="/men" onClick={() => setOpen(false)} className="nav__mLink">Men</NavLink>
        <NavLink to="/kids" onClick={() => setOpen(false)} className="nav__mLink">Kids</NavLink>
        <NavLink to="/lawn" onClick={() => setOpen(false)} className="nav__mLink">Lawn</NavLink>
        <NavLink to="/pret" onClick={() => setOpen(false)} className="nav__mLink">Pret</NavLink>
        <NavLink to="/unstitched" onClick={() => setOpen(false)} className="nav__mLink">Unstitched</NavLink>
        <NavLink to="/footwear" onClick={() => setOpen(false)} className="nav__mLink">Footwear</NavLink>
      </div>
    </header>
  );
}
