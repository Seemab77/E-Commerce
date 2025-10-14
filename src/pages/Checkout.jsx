// src/pages/Checkout.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPKR } from "../utils/currency";

// Firestore (optional but recommended)
import { db } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { user } = useAuth();

  // ----- Delivery form state -----
  const [form, setForm] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    notes: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ----- Safely compute subtotal -----
  const subtotal = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  }, [items]);

  const shipping = 300; // flat rate
  const grandTotal = subtotal + shipping;

  const disabled = !items?.length;

  async function handlePlaceOrder(e) {
    e.preventDefault();

    // Basic validation
    const required = ["fullName", "email", "phone", "address", "city", "province", "postalCode"];
    for (const key of required) {
      if (!String(form[key] || "").trim()) {
        alert(`Please enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
        return;
      }
    }
    if (!items?.length) {
      alert("Your cart is empty.");
      return;
    }

    // Build order object
    const order = {
      uid: user?.uid || null,
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
        notes: form.notes || "",
      },
      items: items.map((it) => ({
        id: it.id,
        title: it.title,
        price: Number(it.price) || 0,
        qty: Number(it.qty) || 1,
        image: it.image || "",
      })),
      amounts: {
        subtotal,
        shipping,
        grandTotal,
        currency: "PKR",
      },
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      // Save order to Firestore
      const docRef = await addDoc(collection(db, "orders"), order);

      // Clear cart & go to success page
      clear();
      navigate(`/order-success?order=${docRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Could not place order. Please try again.");
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 1100 }}>
      <h1 style={{ marginBottom: 18 }}>Checkout</h1>

      {/* Layout: left = form, right = summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        {/* ===== Delivery Form ===== */}
        <form onSubmit={handlePlaceOrder}>
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 12px" }}>Delivery details</h3>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label>Full name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  placeholder="e.g., Seemab Ramzan"
                  required
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="03xx-xxxxxxx"
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label>Province</label>
                <input
                  name="province"
                  value={form.province}
                  onChange={onChange}
                  placeholder="Punjab / Sindh / KPK / Balochistan / GB / AJK"
                  required
                />
              </div>
              <div>
                <label>Postal code</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={onChange}
                  placeholder="e.g., 54000"
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={onChange}
                rows={3}
                placeholder="House / Street / Area"
                required
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <label>Order notes (optional)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows={2}
                placeholder="Any delivery instructions…"
              />
            </div>
          </div>

          {/* Cart items (summary on the left as well) */}
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ margin: "0 0 12px" }}>Your items</h3>
            {!items?.length ? (
              <p>Your cart is empty.</p>
            ) : (
              items.map((it) => (
                <div
                  key={it.id}
                  style={{ display: "grid", gridTemplateColumns: "80px 1fr 60px 120px", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eee" }}
                >
                  <img src={it.image} alt={it.title} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{it.title}</div>
                    <div style={{ color: "#64748b" }}>{formatPKR(it.price)}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>x{it.qty}</div>
                  <div style={{ textAlign: "right", fontWeight: 600 }}>
                    {formatPKR((Number(it.price) || 0) * (Number(it.qty) || 0))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submit button (shown on mobile naturally) */}
          <div style={{ marginTop: 16 }}>
            <button className="btn btn--primary" disabled={disabled}>
              Place Order
            </button>
          </div>
        </form>

        {/* ===== Order Summary (right) ===== */}
        <aside className="card" style={{ padding: 16, height: "fit-content", position: "sticky", top: 16 }}>
          <h3 style={{ margin: "0 0 12px" }}>Summary</h3>
          <div style={{ display: "grid", gap: 8 }}>
            <Row label="Subtotal" value={formatPKR(subtotal)} />
            <Row label="Shipping" value={formatPKR(shipping)} />
            <hr />
            <Row label="Grand Total" value={formatPKR(grandTotal)} strong />
          </div>

          <button
            style={{ marginTop: 16, width: "100%" }}
            className="btn btn--primary"
            onClick={handlePlaceOrder}
            disabled={disabled}
          >
            Place Order
          </button>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "#475569" }}>{label}</span>
      <span style={{ fontWeight: strong ? 800 : 600 }}>{value}</span>
    </div>
  );
}
