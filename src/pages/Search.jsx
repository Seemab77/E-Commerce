// src/pages/Search.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllProducts } from "../lib/fakestore";
import { formatPKR } from "../utils/currency";
import { useCart } from "../context/CartContext";

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!q) return [];
    return products.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    });
  }, [products, q]);

  const handleAdd = (p) => {
    addItem({ id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 });
    openCart();
  };

  return (
    <div className="container section">
      <h1 className="section__title">Search: “{q || "…"}”</h1>
      {loading && <p>Loading…</p>}
      {!loading && !results.length && <p>No results.</p>}

      <div className="grid">
        {results.map((p) => (
          <article key={p.id} className="card">
            <Link to={`/product/${p.id}`} className="card__link">
              <img src={p.image} alt={p.title} loading="lazy" />
            </Link>
            <div className="card__body">
              <Link to={`/product/${p.id}`} className="card__title">{p.title}</Link>
              <div className="card__price">
                <strong>{formatPKR(p.price)}</strong>
                {p.oldPrice && <span className="old">{formatPKR(p.oldPrice)}</span>}
              </div>
              <div className="card__actions">
                <button className="btn btn--primary" onClick={() => handleAdd(p)}>Add to Cart</button>
                <Link to={`/product/${p.id}`} className="btn btn--ghost">View</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
