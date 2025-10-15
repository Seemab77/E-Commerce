// src/pages/Brand.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategorySlug } from "../lib/fakestore";
import { formatPKR } from "../utils/currency";
import { useCart } from "../context/CartContext";

export default function Brand() {
  const { slug } = useParams();         // e.g. "men's clothing"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getProductsByCategorySlug(slug)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = (p) => {
    addItem({ id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 });
    openCart();
  };

  if (loading) return <div className="container section">Loading…</div>;

  return (
    <div className="container section">
      <h1 className="section__title">Category: {slug}</h1>

      {!items.length && <p>No products found.</p>}

      <div className="grid">
        {items.map((p) => (
          <article key={p.id} className="card">
            <Link to={`/product/${p.id}`} className="card__link">
              <img src={p.image} alt={p.title} loading="lazy" />
            </Link>
            <div className="card__body">
              <Link to={`/product/${p.id}`} className="card__title">{p.title}</Link>
              {p.rating?.rate && (
                <div className="stars">
                  {"★".repeat(Math.round(p.rating.rate))}
                  {"☆".repeat(5 - Math.round(p.rating.rate))}
                  <span className="stars__num">({p.rating.rate.toFixed(1)})</span>
                </div>
              )}
              <div className="card__price">
                <strong>{formatPKR(p.price)}</strong>
                {p.oldPrice && <span className="old">{formatPKR(p.oldPrice)}</span>}
              </div>
              <div className="card__actions">
                <button className="btn btn--primary" onClick={() => handleAdd(p)}>
                  Add to Cart
                </button>
                <Link to={`/product/${p.id}`} className="btn btn--ghost">View</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
