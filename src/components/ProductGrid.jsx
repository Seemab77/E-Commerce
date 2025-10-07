// src/components/ProductGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import { newArrivals, topSelling } from "../data/products";
import { formatPKR } from "../utils/currency";
import { useCart } from "../context/CartContext";

/**
 * Reusable product card with:
 * - Badge (optional)
 * - Rating (optional)
 * - Price + oldPrice
 * - "Add to Cart" without navigation
 * - "View" link to details
 */
function Card({ p }) {
  const { addItem, openCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault(); // prevent navigating when button is inside a Link/card
    addItem({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      qty: 1,
      options: {}, // add size/color later if you want
    });
    openCart();
  };

  return (
    <article className="card" aria-label={p.title}>
      <div className="card__media">
        <Link to={`/product/${p.id}`} className="card__link" aria-label={p.title}>
          {/* optional badge */}
          {p.badge && <span className="badge">{p.badge}</span>}

          <img src={p.image} alt={p.title} loading="lazy" />
        </Link>
      </div>

      <div className="card__body">
        <Link to={`/product/${p.id}`} className="card__title">
          {p.title}
        </Link>

        {/* optional rating */}
        {p.rating && (
          <div className="stars" aria-label={`Rating ${p.rating.toFixed(1)} out of 5`}>
            {"★".repeat(Math.round(p.rating))}
            {"☆".repeat(5 - Math.round(p.rating))}
            <span className="stars__num">({p.rating.toFixed(1)})</span>
          </div>
        )}

        <div className="card__price">
          <strong>{formatPKR(p.price)}</strong>
          {!!p.oldPrice && <span className="old">{formatPKR(p.oldPrice)}</span>}
        </div>

        <div className="card__actions">
          <button className="btn btn--primary" onClick={handleAdd}>
            Add to Cart
          </button>
          <Link to={`/product/${p.id}`} className="btn btn--ghost">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

function Section({ id, title, products }) {
  if (!products?.length) return null;

  return (
    <section id={id} className="section">
      <h2 className="section__title">{title}</h2>
      <div className="grid">
        {products.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

export default function ProductGrid() {
  return (
    <>
      <Section id="new-arrivals" title="New Arrivals" products={newArrivals} />
      <Section id="top-selling" title="Top Selling" products={topSelling} />
    </>
  );
}
