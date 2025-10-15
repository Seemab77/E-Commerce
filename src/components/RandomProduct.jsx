// src/components/RandomProducts.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, withOldPrice } from "../lib/fakestore";
import { useCart } from "../context/CartContext";
import { formatPKR } from "../utils/currency";

function sampleUnique(arr, count) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, count);
}

function ProductCard({ p }) {
    const { addItem, openCart } = useCart();
    const handleAdd = (e) => {
        e.preventDefault();
        addItem({ id: p.id, title: p.title, price: p.price, image: p.image, qty: 1, options: {} });
        openCart();
    };

    const hasDiscount = p.oldPrice && p.oldPrice > p.price;
    const saveAmt = hasDiscount ? p.oldPrice - p.price : 0;
    const savePct = hasDiscount ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

    return (
        <article className="pcard">
            <Link to={`/product/${p.id}`} className="pcard__media" aria-label={p.title}>
                {hasDiscount && <span className="pill pill--sale">SALE</span>}
                <img src={p.image} alt={p.title} loading="lazy" />
            </Link>

            <div className="pcard__body">
                <Link to={`/product/${p.id}`} className="pcard__title">{p.title}</Link>

                <div className="pcard__priceRow">
                    <div className="pcard__price">
                        <span className="current">{formatPKR(p.price)}</span>
                        {hasDiscount && <span className="old">{formatPKR(p.oldPrice)}</span>}
                    </div>
                    {hasDiscount && (
                        <span className="chip chip--save">Save {formatPKR(saveAmt)} ({savePct}%)</span>
                    )}
                </div>

                <div className="pcard__actions">
                    <button className="btn btn--primary btn--wide" onClick={handleAdd}>Add to Cart</button>
                    <Link className="btn btn--ghost btn--wide" to={`/product/${p.id}`}>View</Link>
                </div>
            </div>
        </article>
    );
}

export default function RandomProducts({ title = "Random picks for you", count = 8 }) {
    const [state, setState] = useState({ loading: true, error: "", items: [] });

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const raw = await getAllProducts();
                const withPrices = raw.map(withOldPrice);
                const picks = sampleUnique(withPrices, Math.min(count, withPrices.length));
                if (alive) setState({ loading: false, error: "", items: picks });
            } catch (e) {
                if (alive) setState({ loading: false, error: "Failed to load products.", items: [] });
            }
        })();
        return () => { alive = false; };
    }, [count]);

    return (
        <section className="section">
            <h2 className="section__title">{title}</h2>
            {state.loading && <p className="muted">Loading…</p>}
            {!!state.error && <p className="error">{state.error}</p>}
            {!state.loading && !state.error && (
                <div className="grid grid--cards">
                    {state.items.map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
            )}
        </section>
    );
}
