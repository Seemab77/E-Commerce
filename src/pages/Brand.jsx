// src/pages/Brand.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { allProducts } from "../data/products"; // match your file name/casing

const slugify = (s) => s?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? "";
const deslug = (s) =>
  s.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bJunaid Jamshed\b/i, "J. (Junaid Jamshed)");

const formatPKR = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

export default function Brand() {
  const { slug } = useParams();
  const title = deslug(slug);

  const products = useMemo(
    () => allProducts.filter((p) => slugify(p.brand) === slug),
    [slug]
  );

  return (
    <div className="section container">
      <h2 style={{ marginBottom: 8 }}>{title}</h2>
      <p style={{ color: "#64748b", marginBottom: 16 }}>
        {products.length} item{products.length !== 1 ? "s" : ""} found
      </p>

      {products.length === 0 ? (
        <p>No products for this brand yet.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <article key={p.id} className="card">
              <Link to={`/product/${p.id}`} className="card__link">
                <img src={p.image} alt={p.title} loading="lazy" />
                <div className="card__body">
                  <h4 className="card__title">{p.title}</h4>
                  <div className="card__price">
                    <strong>{formatPKR(p.price)}</strong>
                    {p.oldPrice && <span className="old">{formatPKR(p.oldPrice)}</span>}
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
