import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";                 // <- your Firebase init
import { useCart } from "../context/CartContext";     // items, subtotal, clear()
import { useAuth } from "../context/AuthContext";     // user (or null)

/** Create a readable, unique ID, e.g. ORD-20251014-AB3F2 */
function generateOrderId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // 20251014
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase(); // AB3F2
  return `ORD-${datePart}-${randomPart}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();

  // ---- Form fields ----
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);

  // shipping could be dynamic; keep it simple here
  const shipping = 300;
  const grandTotal = useMemo(() => Number(subtotal || 0) + shipping, [subtotal]);

  useEffect(() => {
    if (!user) return; // allow viewing but not placing orders if not logged in
    // Pre-fill email if available
    setEmail((prev) => prev || user.email || "");
  }, [user]);

  const isFormValid =
    fullName.trim().length > 1 &&
    email.trim().length > 3 &&
    phone.trim().length > 5 &&
    city.trim().length > 1 &&
    province.trim().length > 1 &&
    postalCode.trim().length > 0 &&
    address.trim().length > 4;

  async function handlePlaceOrder() {
    if (!user) {
      // if you prefer redirect right away:
      navigate("/account", { state: { from: "/checkout" } });
      return;
    }
    if (!items.length || !isFormValid) return;

    setPlacing(true);
    try {
      const orderId = generateOrderId();

      const orderDoc = {
        orderId,                                // <- our unique, friendly id
        uid: user.uid,
        status: "pending",                      // you can update later to "paid", etc.
        placedAt: serverTimestamp(),

        delivery: {
          fullName,
          phone,
          email,
          city,
          province,
          postalCode,
          address,
          notes,
        },

        items: items.map((i) => ({
          id: i.id,
          title: i.title,
          price: Number(i.price) || 0,
          qty: Number(i.qty) || 0,
          image: i.image || "",
        })),

        subtotal: Number(subtotal) || 0,
        shipping,
        grandTotal,
      };

      await addDoc(collection(db, "orders"), orderDoc);

      // clear cart and go to success page with a bit of context
      clear();
      navigate("/order-success", {
        state: {
          orderId,
          fullName,
          grandTotal,
        },
        replace: true,
      });
    } catch (err) {
      console.error(err);
      alert("Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 960 }}>
      <h1>Checkout</h1>

      {/* ---- Delivery form ---- */}
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <h3>Delivery details</h3>

        <div className="grid" style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            Full name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>
          <label>
            Phone
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            City
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label>
            Province
            <input value={province} onChange={(e) => setProvince(e.target.value)} />
          </label>
          <label>
            Postal code
            <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          </label>
        </div>

        <label style={{ display: "block", marginTop: 8 }}>
          Address
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          Order notes (optional)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </label>
      </div>

      {/* ---- Order summary ---- */}
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <h3>Your items</h3>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "72px 1fr auto",
                  alignItems: "center",
                }}
              >
                <img src={it.image} alt={it.title} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{it.title}</div>
                  <div style={{ color: "#64748b" }}>Qty: {it.qty}</div>
                </div>
                <div style={{ fontWeight: 600 }}>Rs {Number(it.price || 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        <hr style={{ margin: "16px 0" }} />

        <div style={{ display: "grid", gap: 6 }}>
          <Row label="Subtotal" value={`Rs ${Number(subtotal).toLocaleString()}`} />
          <Row label="Shipping" value={`Rs ${shipping.toLocaleString()}`} />
          <Row label="Grand total" value={`Rs ${grandTotal.toLocaleString()}`} bold />
        </div>

        {!user && (
          <div style={{ color: "#b91c1c", marginTop: 12 }}>
            You must be logged in to place an order.
            <br />
            <button
              className="btn btn--primary"
              style={{ marginTop: 8 }}
              onClick={() => navigate("/account", { state: { from: "/checkout" } })}
            >
              Log in to place order
            </button>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <button
            className="btn btn--primary"
            disabled={!user || !items.length || !isFormValid || placing}
            onClick={handlePlaceOrder}
          >
            {placing ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Small display helper */
function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: bold ? 700 : 500 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
