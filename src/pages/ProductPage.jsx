// src/pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById } from "../lib/fakestore";     // or your data source
import { formatPKR } from "../utils/currency";          // keep your formatter

export default function ProductPage() {
  const { id } = useParams();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let alive = true;
    getProductById(id).then((p) => alive && setProduct(p));
    return () => {
      alive = false;
    };
  }, [id]);

  if (!product) return <div className="container section">Loading…</div>;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: Number(qty) || 1, // <- use selected qty
      options: {}, // add size/color here later if needed
    });
    openCart();
  };

  return (
    <div className="container section" style={{ maxWidth: 980 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div
          style={{
            borderRadius: 12,
            background: "#f8fafc",
            padding: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{ maxWidth: "100%", maxHeight: 480, objectFit: "contain" }}
          />
        </div>

        <div>
          <h1 style={{ marginBottom: 6 }}>{product.title}</h1>

          {product.rating?.rate && (
            <div style={{ color: "#111827", marginBottom: 8 }}>
              {"★".repeat(Math.round(product.rating.rate))}
              {"☆".repeat(5 - Math.round(product.rating.rate))}
              <span style={{ color: "#64748b" }}>
                {" "}
                ({product.rating.rate.toFixed(1)})
              </span>
            </div>
          )}

          <div style={{ fontSize: "1.25rem", fontWeight: 700, margin: "6px 0" }}>
            {formatPKR(product.price)}
          </div>

          <p style={{ color: "#475569" }}>{product.description}</p>

          <div style={{ margin: "16px 0" }}>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Quantity</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={dec}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                }}
                aria-label="Decrease"
              >
                −
              </button>
              <span style={{ minWidth: 20, textAlign: "center" }}>{qty}</span>
              <button
                type="button"
                onClick={inc}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                }}
                aria-label="Increase"
              >
                +
              </button>
            </div>
          </div>

          <button className="btn btn--primary" onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
