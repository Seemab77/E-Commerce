// src/pages/CategoryPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fromSlug, getProductsByCategorySlug, withOldPrice } from "../lib/fakestore";
import { useCart } from "../context/CartContext";
import { formatPKR } from "../utils/currency";

export default function CategoryPage() {
    const { slug } = useParams();            // e.g. "men%27s%20clothing"
    const category = fromSlug(slug);         // -> "men's clothing"

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem, openCart } = useCart();

    useEffect(() => {
        let alive = true;
        setLoading(true);

        getProductsByCategorySlug(category)
            .then(withOldPrice)
            .then((data) => {
                if (alive) setItems(data);
            })
            .finally(() => alive && setLoading(false));

        return () => { alive = false; };
    }, [category]);

    const handleAdd = (p) => {
        addItem({ id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 });
        openCart();
    };

    if (loading) {
        return <div className="container section">Loading…</div>;
    }

    return (
        <div className="container section">
            <h1 className="section__title">Category: {category}</h1>

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
                                <div className="stars" aria-label={`Rating ${p.rating.rate.toFixed(1)} out of 5`}>
                                    {"★".repeat(Math.round(p.rating.rate))}
                                    {"☆".repeat(5 - Math.round(p.rating.rate))}
                                    <span className="stars__num">({p.rating.rate.toFixed(1)})</span>
                                </div>
                            )}

                            <div className="card__price">
                                <strong>{formatPKR(p.price)}</strong>
                                {!!p.oldPrice && <span className="old">{formatPKR(p.oldPrice)}</span>}
                            </div>

                            {/* Optional “You save …” row */}
                            {p.oldPrice && p.oldPrice > p.price && (
                                <div className="save-row">
                                    {(() => {
                                        const saved = Math.max(0, p.oldPrice - p.price);
                                        const pct = Math.round((saved / p.oldPrice) * 100);
                                        return (
                                            <small className="save">
                                                Save {formatPKR(saved)} ({pct}%)
                                            </small>
                                        );
                                    })()}
                                </div>
                            )}

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
