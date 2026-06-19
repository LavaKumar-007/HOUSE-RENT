import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "tenant",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await register(form);
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section auth-page">
      <div className="container-xl auth-container">
        <div className="auth-card glass-card">
          <p className="section-label">Join HouseHunt</p>
          <h1 className="display-title auth-title">Create account</h1>
          <p className="auth-sub">Register as a tenant or property owner.</p>

          {error && <div className="alert-custom alert-error">{error}</div>}
          {success && <div className="alert-custom alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control-custom mb-3"
              placeholder="Full name"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="form-control-custom mb-3"
              type="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="form-control-custom mb-3"
              type="password"
              placeholder="Password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              className="form-control-custom mb-3"
              placeholder="Phone number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <select
              className="form-control-custom mb-4"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="tenant">I want to rent (Tenant)</option>
              <option value="owner">I want to list properties (Owner)</option>
            </select>
            <button className="btn-primary-custom w-100" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
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
        .w-100 { width: 100%; }
        .mb-3 { margin-bottom: 12px; }
        .mb-4 { margin-bottom: 16px; }
      `}</style>
    </div>
  );
}

export default Register;
