// src/components/Hero.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import heroImg from "../assets/Hero.png";

// ⬅️ fetch helpers from your Fake Store API util
import { getCategories, toSlug } from "../lib/fakestore";

export default function Hero() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [cats, setCats] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [catErr, setCatErr] = useState("");

  // Load categories once
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoadingCats(true);
        const list = await getCategories(); // e.g. ["electronics", "jewelery", ...]
        if (!isMounted) return;
        // Normalize to {name, slug}
        const normalized = list.map((name) => ({
          name: name.replace(/\b\w/g, (c) => c.toUpperCase()), // Title Case
          slug: toSlug(name),
        }));
        setCats(normalized);
      } catch (e) {
        if (!isMounted) return;
        setCatErr("Failed to load categories.");
      } finally {
        if (isMounted) setLoadingCats(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const goShopNow = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "new-arrivals" } });
      return;
    }
    document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleDropdown = () => setShowDropdown((s) => !s);

  return (
    <section className="hero">
      <div className="hero__text">
        <h1>Find clothes that matches your style</h1>
        <p>Browse our range of trending outfits, crafted for comfort and everyday style.</p>

        <div className="hero__cta">
          <button className="btn btn--primary" onClick={goShopNow}>
            Shop Now
          </button>

          {/* View Catalog Dropdown (dynamic from API) */}
          <div className="dropdown" style={{ position: "relative" }}>
            <button className="btn btn--ghost" onClick={toggleDropdown} aria-expanded={showDropdown}>
              View Catalog ▾
            </button>

            {showDropdown && (
              <ul className="dropdown__menu">
                {loadingCats && (
                  <li className="muted" style={{ padding: "8px 12px" }}>
                    Loading…
                  </li>
                )}

                {!!catErr && (
                  <li className="error" style={{ padding: "8px 12px", color: "#b00" }}>
                    {catErr}
                  </li>
                )}

                {!loadingCats && !catErr && cats.length === 0 && (
                  <li className="muted" style={{ padding: "8px 12px" }}>
                    No categories found
                  </li>
                )}

                {!loadingCats &&
                  !catErr &&
                  cats.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/category/${c.slug}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        {c.name}
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
