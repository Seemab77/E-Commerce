import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, error, loading } = useAuth();
  const [mode, setMode] = useState("signup"); // 'login' | 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (mode === "login") {
      await signIn(email.trim(), password);
    } else {
      await signUp(email.trim(), password, name.trim());
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 520 }}>
      <h1 style={{ textAlign: "center" }}>
        {mode === "login" ? "Log in" : "Create account"}
      </h1>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "12px 0" }}>
        <button className={`btn ${mode==="login"?"btn--primary":"btn--ghost"}`} onClick={() => setMode("login")}>Log in</button>
        <button className={`btn ${mode==="signup"?"btn--primary":"btn--ghost"}`} onClick={() => setMode("signup")}>Sign up</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        {mode === "signup" && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" autoComplete="name" />
        )}
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" autoComplete="email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" autoComplete={mode==="signup"?"new-password":"current-password"} required />
        {error && <p style={{ color:"#d00" }}>{error}</p>}
        <button className="btn btn--primary" disabled={loading}>{mode==="login"?"Log in":"Create account"}</button>
      </form>

      <div style={{ textAlign:"center", marginTop: 16 }}>
        <button className="btn btn--ghost" onClick={signInWithGoogle} disabled={loading}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
