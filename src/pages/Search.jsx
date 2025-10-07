// src/pages/Search.jsx
import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { allProducts } from "../data/products"; // ← match your actual filename/casing

// Small helper to read ?q=...
const useQuery = () => new URLSearchParams(useLocation().search);

// Optional PKR formatter (kept local so this file works standalone)
const formatPKR = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

// How to match a product against the search term
const matches = (p, q) => {
  const t = (q || "").trim().toLowerCase();
  if (!t) return false;
  return (
    p.title?.toLowerCase().includes(t) ||
    p.brand?.toLowerCase().includes(t) ||
    p.category?.toLowerCase().includes(t)
  );
};

export default function Search() {
  const query = useQuery();
  const q = query.get("q") || "";

  // Filter once per query change
  const results = useMemo(
    () => allProducts.filter((p) => matches(p, q)),
    [q]
  );

  return (
    <div className="section container">
      <h2 style={{ marginBottom: 8 }}>
        Search results for: <em>“{q}”</em>
      </h2>
      <p style={{ color: "#64748b", marginBottom: 16 }}>
        {results.length} item{results.length !== 1 ? "s" : ""} found
      </p>

      {q.trim() === "" ? (
        <p>Type in the search bar and press Enter.</p>
      ) : results.length === 0 ? (
        <p>No products matched your search.</p>
      ) : (
        <div className="grid">
          {results.map((p) => (
            <article key={p.id} className="card">
              <Link to={`/product/${p.id}`} className="card__link">
                <img src={p.image} alt={p.title} loading="lazy" />
                <div className="card__body">
                  <h4 className="card__title">{p.title}</h4>
                  <div className="card__price">
                    <strong>{formatPKR(p.price)}</strong>
                    {p.oldPrice && (
                      <span className="old">{formatPKR(p.oldPrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
