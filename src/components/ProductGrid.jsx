import React from "react";
import { Link } from "react-router-dom";
import { formatPKR } from "../utils/currency";
import { useCart } from "../context/CartContext";

function Card({ p }) {
  const { addItem, openCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      qty: 1,
    });
    openCart();
  };

  // calculate discount if oldPrice exists
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const discountAmount = hasDiscount ? p.oldPrice - p.price : 0;
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / p.oldPrice) * 100)
    : 0;

  return (
    <article className="pcard" aria-label={p.title}>
      <Link to={`/product/${p.id}`} className="pcard__media" aria-label={p.title}>
        {hasDiscount && (
          <div className="pcard__badge">
            <span className="pcard__chip">SALE</span>
            <span className="pcard__chip pcard__chip--accent">-{discountPercent}%</span>
          </div>
        )}
        <img src={p.image} alt={p.title} loading="lazy" />
      </Link>

      <div className="pcard__body">
        <Link to={`/product/${p.id}`} className="pcard__title">
          {p.title}
        </Link>

        {p.rating && (
          <div
            className="pcard__rating"
            aria-label={`Rating ${p.rating.toFixed(1)} out of 5`}
          >
            {"★".repeat(Math.round(p.rating))}
            {"☆".repeat(5 - Math.round(p.rating))}
            <span className="pcard__ratingNum">{p.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="pcard__price">
          <strong>{formatPKR(p.price)}</strong>
          {hasDiscount && <span className="pcard__old">{formatPKR(p.oldPrice)}</span>}
        </div>

        {hasDiscount && (
          <div className="pcard__discount">
            Save {formatPKR(discountAmount)} ({discountPercent}%)
          </div>
        )}

        <div className="pcard__cta">
          <button type="button" className="pcard__btn pcard__btn--primary" onClick={handleAdd}>
            Add to Cart
          </button>
          <Link to={`/product/${p.id}`} className="pcard__btn pcard__btn--ghost">
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

/*export default function ProductGrid() {
  return (
    <>
      <Section id="new-arrivals" title="New Arrivals" products={newArrivals} />
      <Section id="top-selling" title="Top Selling" products={topSelling} />
    </>
  );
}*/
