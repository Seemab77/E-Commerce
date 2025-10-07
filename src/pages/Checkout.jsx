// src/pages/Checkout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPKR } from "../utils/currency";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    alert("✅ Order placed successfully! (Demo only)");
    clear();
    navigate("/");
  };

  if (!items.length) {
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <h2>Your cart is empty 🛒</h2>
        <button className="btn btn--primary" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section__title">Checkout</h1>

      <table className="checkout__table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id + (item.options?.size || "")}>
              <td>
                <div className="checkout__prod">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <strong>{item.title}</strong>
                    {item.options?.size && <div>Size: {item.options.size}</div>}
                    {item.options?.color && <div>Color: {item.options.color}</div>}
                  </div>
                </div>
              </td>
              <td>{item.qty}</td>
              <td>{formatPKR(item.price)}</td>
              <td>{formatPKR(item.price * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="checkout__summary">
        <div className="summary__row">
          <span>Subtotal:</span>
          <strong>{formatPKR(total)}</strong>
        </div>
        <div className="summary__row">
          <span>Shipping:</span>
          <strong>{formatPKR(300)}</strong>
        </div>
        <div className="summary__row total">
          <span>Grand Total:</span>
          <strong>{formatPKR(total + 300)}</strong>
        </div>

        <button className="btn btn--primary" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}
