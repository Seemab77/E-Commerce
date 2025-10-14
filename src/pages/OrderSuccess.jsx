import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.orderId;
  const fullName = state?.fullName;
  const grandTotal = state?.grandTotal;

  return (
    <div className="container section" style={{ maxWidth: 640, textAlign: "center" }}>
      <div
        style={{
          background: "#0f172a",
          color: "#fff",
          borderRadius: 16,
          padding: "28px 22px",
          boxShadow: "0 16px 34px rgba(0,0,0,.12)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.9rem" }}>Thank you for your order!</h1>
        <p style={{ marginTop: 8, opacity: 0.9 }}>
          {fullName ? `Hi ${fullName.split(" ")[0]}, ` : ""}we’re getting your items ready to ship.
        </p>

        {orderId && (
          <p style={{ marginTop: 10, fontWeight: 600 }}>
            Your Order ID: <span style={{ color: "#a78bfa" }}>{orderId}</span>
          </p>
        )}

        {grandTotal != null && (
          <p style={{ marginTop: 6 }}>
            Total paid: <strong>Rs {Number(grandTotal).toLocaleString()}</strong>
          </p>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
          {/* ⬇️ Go straight to Account with Orders tab selected */}
          <button
            className="btn btn--ghost"
            onClick={() => navigate("/account?tab=orders", { replace: true })}
          >
            View my orders
          </button>

          <button className="btn btn--primary" onClick={() => navigate("/", { replace: true })}>
            Back to Home
          </button>
        </div>
      </div>

      <p style={{ marginTop: 14, color: "#64748b" }}>
        A confirmation email has been sent to your inbox.
      </p>
    </div>
  );
}
