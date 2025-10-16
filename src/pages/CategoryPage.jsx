// src/pages/CategoryPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fromSlug, getProductsByCategorySlug, withOldPrice } from "../lib/fakestore";
import { useCart } from "../context/CartContext";
import { formatPKR } from "../utils/currency";

export default function CategoryPage() {
    const { slug } = useParams();
    const category = fromSlug(slug);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem, openCart } = useCart();

    useEffect(() => {
        let alive = true;
        setLoading(true);

        getProductsByCategorySlug(category)
            .then(withOldPrice)
            .then((data) => alive && setItems(data))
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [category]);

    const handleAdd = (p) => {
        addItem({
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.image,
            qty: 1,
            options: {},
        });
        openCart();
    };

    if (loading) {
        return (
            <div className="container section">
                <h1 className="section__title">Category: {category}</h1>
                <p>Loading…</p>
            </div>
        );
    }

    return (
        <div className="container section">
            <h1 className="section__title">Category: {category}</h1>

            {!items.length && <p>No products found.</p>}

            <div
                className="grid"
                style={{
                    display: "grid",
                    gap: 18,
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                }}
            >
                {items.map((p) => (
                    <article
                        key={p.id}
                        className="card"
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 10px 24px rgba(2,6,23,.06)",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform .15s ease, box-shadow .15s ease",
                        }}
                    >
                        {/* IMAGE (fixed-height, overflow-hidden, no overlap) */}
                        <Link to={`/product/${p.id}`} style={{ display: "block", position: "relative" }}>
                            <div
                                style={{
                                    width: "100%",
                                    height: 240,
                                    background: "#f8fafc",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 12,
                                    boxSizing: "border-box",
                                }}
                            >
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    loading="lazy"
                                    style={{
                                        display: "block",
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                        position: "static",
                                    }}
                                />
                            </div>
                        </Link>

                        {/* BODY */}
                        <div
                            className="card__body"
                            style={{
                                padding: 14,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                flexGrow: 1,
                            }}
                        >
                            {/* TITLE (2-line clamp) */}
                            <Link
                                to={`/product/${p.id}`}
                                className="card__title"
                                style={{
                                    color: "#0f172a",
                                    fontWeight: 700,
                                    lineHeight: 1.25,
                                    textDecoration: "none",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    minHeight: 44,
                                }}
                            >
                                {p.title}
                            </Link>

                            {/* RATING */}
                            {p.rating?.rate && (
                                <div
                                    className="stars"
                                    aria-label={`Rating ${p.rating.rate.toFixed(1)} out of 5`}
                                    style={{ color: "#f59e0b", fontSize: 14, display: "flex", gap: 6, alignItems: "center" }}
                                >
                                    <span>
                                        {"★".repeat(Math.round(p.rating.rate))}
                                        {"☆".repeat(5 - Math.round(p.rating.rate))}
                                    </span>
                                    <span className="stars__num" style={{ color: "#64748b" }}>
                                        ({p.rating.rate.toFixed(1)})
                                    </span>
                                </div>
                            )}

                            {/* PRICE + OLD PRICE */}
                            <div className="card__price" style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                                <strong style={{ fontSize: 18 }}>{formatPKR(p.price)}</strong>
                                {!!p.oldPrice && (
                                    <span className="old" style={{ color: "#94a3b8", textDecoration: "line-through" }}>
                                        {formatPKR(p.oldPrice)}
                                    </span>
                                )}
                            </div>

                            {/* SAVE ROW */}
                            {p.oldPrice && p.oldPrice > p.price && (
                                <div className="save-row">
                                    {(() => {
                                        const saved = Math.max(0, p.oldPrice - p.price);
                                        const pct = Math.round((saved / p.oldPrice) * 100);
                                        return (
                                            <small
                                                className="save"
                                                style={{
                                                    background: "#e8f7ee",
                                                    color: "#15803d",
                                                    padding: "4px 10px",
                                                    borderRadius: 999,
                                                    fontWeight: 600,
                                                    display: "inline-block",
                                                }}
                                            >
                                                Save {formatPKR(saved)} ({pct}%)
                                            </small>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* ACTIONS (segmented buttons) */}
                            <div
                                className="card__actions"
                                style={{
                                    display: "flex",
                                    gap: 0,
                                    marginTop: "auto",
                                    borderRadius: 999,
                                    overflow: "hidden",
                                    border: "1px solid #e5e7eb",
                                    alignSelf: "stretch",
                                }}
                            >
                                <button
                                    onClick={() => handleAdd(p)}
                                    style={{
                                        flex: 1,
                                        padding: "12px 14px",
                                        background: "#0b1324",
                                        color: "#fff",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        borderRight: "1px solid rgba(255,255,255,.08)",
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <Link
                                    to={`/product/${p.id}`}
                                    style={{
                                        flex: 1,
                                        padding: "12px 14px",
                                        background: "#fff",
                                        color: "#0b1324",
                                        textAlign: "center",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                    }}
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
