// src/components/CartDrawer.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    subtotal,
    increment,
    decrement,
    removeItem,
    clear,
  } = useCart();

  const navigate = useNavigate();

  // ✅ Go to Checkout handler
  const handleCheckout = () => {
    closeCart(); // close sidebar first
    navigate("/checkout"); // then navigate
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isOpen ? "show" : ""}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="cart-head">
          <h3>Your Cart</h3>
          <button
            className="cart-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="cart-item__info">
                  <div className="cart-item__top">
                    <h4>{item.title}</h4>
                    <button
                      className="cart-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.title}`}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="cart-item__bottom">
                    <div className="cart-qty">
                      <button onClick={() => decrement(item.id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increment(item.id)}>+</button>
                    </div>
                    <div className="cart-price">
                      Rs {item.price * item.qty}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <div className="cart-row">
            <span>Subtotal</span>
            <strong>Rs {subtotal}</strong>
          </div>

          {/* ✅ Functional checkout button */}
          <button
            className="btn btn--primary cart-checkout"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Go to Checkout
          </button>

          <button
            className="btn btn--ghost cart-clear"
            onClick={clear}
            disabled={items.length === 0}
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </>
  );
}
