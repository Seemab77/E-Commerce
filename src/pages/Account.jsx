import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user, loading, error, setError, signIn, signUp, signInWithGoogle, logOut } = useAuth();

  const [mode, setMode] = useState("signup"); // 'login' | 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (loading) return <div className="container section">Loading…</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (mode === "login") {
        await signIn(String(email).trim(), String(password));
      } else {
        await signUp(String(email).trim(), String(password), String(name).trim());
      }
      // clear fields
      setName(""); setEmail(""); setPassword("");
    } catch (err) {
      setError(err.message || "Failed");
    }
  };

  if (user) {
    return (
      <div className="container section" style={{ maxWidth: 520 }}>
        <h2>Welcome{user.displayName ? `, ${user.displayName}` : ""}!</h2>
        <p>{user.email}</p>
        <button className="btn btn--primary" onClick={logOut}>Log out</button>
      </div>
    );
  }

  return (
    <div className="container section" style={{ maxWidth: 520 }}>
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>
        {mode === "login" ? "Log in" : "Create account"}
      </h1>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18 }}>
        <button className={`btn ${mode === "login" ? "btn--primary" : "btn--ghost"}`} onClick={() => setMode("login")} type="button">Log in</button>
        <button className={`btn ${mode === "signup" ? "btn--primary" : "btn--ghost"}`} onClick={() => setMode("signup")} type="button">Sign up</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        {mode === "signup" && (
          <input type="text" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} autoComplete="name" />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" required />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete={mode==="signup" ? "new-password" : "current-password"} required />
        {error && <p style={{ color:"#d00" }}>{error}</p>}
        <button className="btn btn--primary" type="submit">{mode === "login" ? "Log in" : "Create account"}</button>
      </form>

      <div style={{ textAlign:"center", marginTop: 12 }}>
        <button className="btn btn--ghost" onClick={signInWithGoogle}>Continue with Google</button>
      </div>
    </div>
  );
}
