// src/pages/AuthPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, error, loading } = useAuth();

  const [mode, setMode] = useState("signup"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  async function handleSubmit(e) {
    e.preventDefault();

    const safeEmail = String(email || "").trim();
    const safePass = String(password || "");
    const safeName = String(name || "").trim();

    try {
      if (mode === "login") {
        await signIn(safeEmail, safePass);
      } else {
        await signUp(safeEmail, safePass, safeName);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Auth submit error:", err);
      // error is already set in context; optional to show extra message here
    }
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 520 }}>
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>
        {mode === "login" ? "Log in" : "Create account"}
      </h1>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18 }}>
        <button
          className={`btn ${mode === "login" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setMode("login")}
          type="button"
        >
          Log in
        </button>
        <button
          className={`btn ${mode === "signup" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setMode("signup")}
          type="button"
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" style={{ display: "grid", gap: 10 }}>
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Full name"
            value={name ?? ""}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password ?? ""}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
        />

        {error && (
          <p style={{ color: "#d00", marginTop: 6 }}>
            {error}
          </p>
        )}

        <button className="btn btn--primary" type="submit" disabled={loading}>
          {mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button className="btn btn--ghost" onClick={handleGoogle} disabled={loading}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
