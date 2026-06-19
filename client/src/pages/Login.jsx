import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section auth-page">
      <div className="container-xl auth-container">
        <div className="auth-card glass-card">
          <p className="section-label">Welcome back</p>
          <h1 className="display-title auth-title">Sign in</h1>
          <p className="auth-sub">Access your dashboard, bookings, and saved homes.</p>

          {error && <div className="alert-custom alert-error">{error}</div>}
          {needsVerification && (
            <div className="alert-custom alert-info">
              Check your email for the verification link, or{" "}
              <Link to="/register">register again</Link> to resend.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control-custom mb-3"
              type="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="form-control-custom mb-4"
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button className="btn-primary-custom w-100" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            New here? <Link to="/register">Create an account</Link>
          </p>

          <div className="demo-box">
            <strong>Demo accounts (after seeding):</strong>
            <p>Tenant: sneha@househunt.com / Tenant@123</p>
            <p>Owner: rahul@househunt.com / Owner@123</p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { background: linear-gradient(135deg, #eff6ff, #f7f5f2); }
        .auth-container { display: flex; justify-content: center; }
        .auth-card { width: 100%; max-width: 480px; padding: 40px; }
        .auth-title { font-size: 2.5rem; margin: 8px 0; }
        .auth-sub { color: var(--text-muted); margin-bottom: 28px; }
        .auth-footer { margin-top: 24px; text-align: center; color: var(--text-muted); }
        .auth-footer a { color: var(--primary); font-weight: 700; }
        .demo-box {
          margin-top: 28px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 14px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .w-100 { width: 100%; }
        .mb-3 { margin-bottom: 12px; }
        .mb-4 { margin-bottom: 16px; }
      `}</style>
    </div>
  );
}

export default Login;
