import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // Auth context for user data
import { signOut } from "firebase/auth";  // Firebase logout method
import { auth, db } from "../lib/firebase";  // Firebase setup and db
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";  // Firestore imports

export default function Account() {
  const { user } = useAuth();  // Get user from AuthContext
  const navigate = useNavigate();  // For navigating between pages
  const [params, setParams] = useSearchParams(); // Search parameters for tabs
  const tab = (params.get("tab") || "profile").toLowerCase();  // Current tab (Profile or Orders)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/account-auth", { replace: true, state: { from: "/account?tab=profile" } });
    }
  }, [user, navigate]);

  // Logout function
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/"); // Redirect to homepage after logout
      })
      .catch((error) => {
        console.error("Logout Error: ", error); // Log error if logout fails
      });
  };

  return (
    <div className="container section" style={{ maxWidth: 960 }}>
      <h1>My Account</h1>

      {/* Small profile header */}
      {user && (
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{user.displayName || "Customer"}</div>
              <div style={{ color: "#64748b" }}>{user.email}</div>
            </div>
            {/* Add logout button here */}
            <button onClick={handleLogout} className="btn btn--secondary">Logout</button>
          </div>
        </div>
      )}

      {/* Tabs for navigation */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <TabButton active={tab === "profile"} onClick={() => setParams({ tab: "profile" })}>Profile</TabButton>
        <TabButton active={tab === "orders"} onClick={() => setParams({ tab: "orders" })}>Orders</TabButton>
      </div>

      {/* Conditional rendering of profile or orders */}
      {user && (
        <div>
          {tab === "profile" && <ProfileInfo user={user} />}
          {tab === "orders" && <OrdersList uid={user?.uid} />}
        </div>
      )}
    </div>
  );
}

// Tab Button component
function TabButton({ active, onClick, children }) {
  return (
    <button
      className={`btn ${active ? "btn--primary" : "btn--ghost"}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

// Profile Info component
function ProfileInfo({ user }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <h3>Profile</h3>
      <p style={{ color: "#64748b" }}>This is your account. Use the <strong>Orders</strong> tab to see all your purchases.</p>
      <ul style={{ color: "#111827" }}>
        <li><strong>Name:</strong> {user.displayName || "Not set"}</li>
        <li><strong>Email:</strong> {user.email || "—"}</li>
        <li><strong>User ID:</strong> <code>{user.uid}</code></li>
      </ul>
    </div>
  );
}

// Orders List component to fetch user's orders
function OrdersList({ uid }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching orders from Firestore
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "orders"),  // Get orders from Firestore
      where("uid", "==", uid),   // Match the orders to the current user
      orderBy("placedAt", "desc") // Sort by order placement date, newest first
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = [];
        snap.forEach((doc) => rows.push({ id: doc.id, ...doc.data() }));
        setOrders(rows);  // Set the orders in state
        setLoading(false); // Done loading
      },
      (err) => {
        console.error(err);  // Log any errors
        setLoading(false);   // Stop loading in case of error
      }
    );

    return unsub;  // Cleanup on unmount
  }, [uid]);

  // If loading, display loading message
  if (loading) {
    return <div className="card" style={{ padding: 16 }}>Loading your orders…</div>;
  }

  // If there are no orders, show this message
  if (!orders.length) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <h3>Your orders</h3>
        <p style={{ color: "#64748b" }}>You haven’t placed any orders yet.</p>
      </div>
    );
  }

  // Otherwise, render the list of orders
  return (
    <div className="card" style={{ padding: 16 }}>
      <h3>Your orders</h3>
      <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
        {orders.map((o) => (
          <OrderRow key={o.id} order={o} />
        ))}
      </div>
    </div>
  );
}

// Individual Order Row component
function OrderRow({ order }) {
  const [open, setOpen] = useState(false);
  const itemCount = useMemo(
    () => (order.items || []).reduce((acc, it) => acc + Number(it.qty || 0), 0),
    [order.items]
  );

  const dateText = order.placedAt?.toDate
    ? order.placedAt.toDate().toLocaleString()
    : "—";

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700 }}>
            {order.orderId || order.id}
          </div>
          <div style={{ color: "#64748b", fontSize: ".95rem" }}>
            {dateText} • {itemCount} item{itemCount !== 1 ? "s" : ""} •{" "}
            <strong>Rs {Number(order.grandTotal || 0).toLocaleString()}</strong>
          </div>
          {order.status && (
            <div style={{ marginTop: 4 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "#f3f4f6",
                  fontSize: ".85rem",
                }}
              >
                {order.status}
              </span>
            </div>
          )}
        </div>

        <button className="btn btn--ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide items" : "View items"}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {(order.items || []).map((it, i) => (
            <div
              key={`${it.id}-${i}`}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr auto",
                gap: 10,
                alignItems: "center",
              }}
            >
              {it.image ? (
                <img
                  src={it.image}
                  alt={it.title}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 70,
                    height: 70,
                    background: "#f3f4f6",
                    borderRadius: 8,
                  }}
                />
              )}
              <div>
                <div style={{ fontWeight: 600 }}>{it.title}</div>
                <div style={{ color: "#64748b" }}>Qty: {it.qty}</div>
              </div>
              <div style={{ fontWeight: 600 }}>Rs {Number(it.price || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
