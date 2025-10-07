// src/pages/Cart.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialItems = [
  {
    id: 1,
    title: "Checkered Shirt",
    price: 180,
    size: "M",
    color: "Red",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    qty: 1,
  },
  {
    id: 2,
    title: "Slim-fit Jeans",
    price: 240,
    size: "32",
    color: "Indigo",
    img: "https://images.unsplash.com/photo-1582738412306-0303d1f57b4b?q=80&w=600&auto=format&fit=crop",
    qty: 1,
  },
  {
    id: 3,
    title: "Quarter-Sleeve T-Shirt",
    price: 145,
    size: "L",
    color: "Lavender",
    img: "https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=600&auto=format&fit=crop",
    qty: 1,
  },
];

export default function Cart() {
  const [items, setItems] = useState(initialItems);
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);

  const SUBTOTAL = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const DELIVERY = items.length ? 15 : 0;

  // Simple coupon: SAVE10 → 10% off
  const discountRate = appliedCode === "SAVE10" ? 0.1 : 0;
  const DISCOUNT = Math.round(SUBTOTAL * discountRate);
  const TOTAL = Math.max(SUBTOTAL - DISCOUNT + DELIVERY, 0);

  const inc = (id) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );
  const dec = (id) =>
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
        )
    );
  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const applyCode = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return setAppliedCode(null);
    if (trimmed === "SAVE10") setAppliedCode(trimmed);
    else setAppliedCode("INVALID"); // you can show a toast if you like
  };

  return (
    <main className="container cart">
      <nav className="crumbs" style={{ marginTop: 16 }}>
        <Link to="/">Home</Link> <span>/</span> <span>Your Cart</span>
      </nav>

      <h1 className="cart__title">Your Cart</h1>

      <section className="cart__grid">
        {/* LEFT: Items */}
        <div className="cart__items">
          {items.length === 0 ? (
            <div className="cart__empty">
              <p>Your cart is empty.</p>
              <Link to="/" className="btn btn--primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map((it) => (
              <article key={it.id} className="cart__item">
                <img src={it.img} alt={it.title} className="cart__thumb" />
                <div className="cart__info">
                  <h3 className="cart__name">{it.title}</h3>
                  <div className="cart__meta">
                    <span>Size: {it.size}</span>
                    <span>Color: {it.color}</span>
                  </div>

                  <div className="cart__row">
                    <div className="qty">
                      <button onClick={() => dec(it.id)} aria-label="Decrease">
                        −
                      </button>
                      <span>{it.qty}</span>
                      <button onClick={() => inc(it.id)} aria-label="Increase">
                        +
                      </button>
                    </div>

                    <div className="cart__price">
                      ${it.price * it.qty}
                    </div>

                    <button
                      className="cart__remove"
                      onClick={() => remove(it.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* RIGHT: Summary */}
        <aside className="cart__summary">
          <h3>Order Summary</h3>

          <div className="cart__sumRow">
            <span>Subtotal</span>
            <strong>${SUBTOTAL}</strong>
          </div>

          <div className="cart__sumRow">
            <span>Discount</span>
            <strong className={DISCOUNT ? "ok" : ""}>
              {DISCOUNT ? `– $${DISCOUNT}` : "$0"}
            </strong>
          </div>

          <div className="cart__sumRow">
            <span>Delivery fee</span>
            <strong>${DELIVERY}</strong>
          </div>

          <hr />

          <div className="cart__sumRow cart__total">
            <span>Total</span>
            <strong>${TOTAL}</strong>
          </div>

          <div className="coupon">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Promo code e.g. SAVE10"
            />
            <button className="btn btn--outline" onClick={applyCode}>
              Apply
            </button>
          </div>
          {appliedCode === "INVALID" && (
            <p className="coupon__msg">Invalid code. Try <b>SAVE10</b>.</p>
          )}
          {appliedCode === "SAVE10" && (
            <p className="coupon__msg ok">Code applied: SAVE10 (10% off)</p>
          )}

          <button className="btn btn--primary cart__checkout">
            Go to Checkout
          </button>
          <Link to="/" className="cart__continue">← Continue shopping</Link>
        </aside>
      </section>

      {/* Newsletter banner (reuses your .nl styles) */}
      <section className="nl cart__nl">
        <div>
          <h3 style={{ margin: 0 }}>Stay up to date about our latest offers</h3>
          <p style={{ margin: "6px 0 0", opacity: 0.9 }}>
            Get updates, new arrivals and exclusive deals.
          </p>
        </div>
        <div className="nl__row">
          <input placeholder="Enter your email" />
          <button className="btn btn--primary">Subscribe to Newsletter</button>
        </div>
      </section>
    </main>
  );
}
