import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import heroImg from "../assets/Hero.png"; // make sure this file exists

export default function Hero() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const goShopNow = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "new-arrivals" } });
      return;
    }
    document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const categories = [
    { name: "Women", path: "/women" },
    { name: "Men", path: "/men" },
    { name: "Kids", path: "/kids" },
    { name: "Lawn", path: "/lawn" },
    { name: "Pret", path: "/pret" },
    { name: "Unstitched", path: "/unstitched" },
    { name: "Footwear", path: "/footwear" },
  ];

  return (
    <section className="hero">
      <div className="hero__text">
        <h1>Find clothes that matches your style</h1>
        <p>Browse our range of trending outfits, crafted for comfort and everyday style.</p>

        <div className="hero__cta">
          <button className="btn btn--primary" onClick={goShopNow}>
            Shop Now
          </button>

          {/* View Catalog Dropdown */}
          <div className="dropdown">
            <button className="btn btn--ghost" onClick={toggleDropdown}>
              View Catalog ▾
            </button>
            {showDropdown && (
              <ul className="dropdown__menu">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <Link to={cat.path} onClick={() => setShowDropdown(false)}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="hero__stats">
          <div>
            <strong>200+</strong>
            <span>International Brands</span>
          </div>
          <div>
            <strong>2,000+</strong>
            <span>High Quality Products</span>
          </div>
          <div>
            <strong>30,000+</strong>
            <span>Happy Customers</span>
          </div>
        </div>
      </div>

      <div className="hero__image">
        <img src={heroImg} alt="Happy customer" loading="eager" />
      </div>
    </section>
  );
}
