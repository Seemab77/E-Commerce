// src/pages/OrderSuccess.jsx
import { useSearchParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order");

  return (
    <div className="container section" style={{ maxWidth: 700, textAlign: "center" }}>
      <h1>🎉 Thank you!</h1>
      <p>Your order has been placed successfully.</p>
      {orderId && <p style={{ color: "#64748b" }}>Order ID: <strong>{orderId}</strong></p>}
      <p>We’ve emailed you the details and will start processing your order shortly.</p>
      <Link className="btn btn--primary" to="/">Back to Home</Link>
    </div>
  );
}
