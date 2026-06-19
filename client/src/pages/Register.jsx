import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/layouts/AuthLayout";
import PageMeta from "../components/PageMeta";

function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", role: "tenant" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

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
    <AuthLayout title="Create account" subtitle="Register as a tenant or property owner.">
      <PageMeta title="Sign Up" />
      {error && <div className="alert-custom alert-error">{error}</div>}
      {success && <div className="alert-custom alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control-custom mb-3" placeholder="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="form-control-custom mb-3" type="email" placeholder="Email address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control-custom mb-3" type="password" placeholder="Password (min 6 chars)" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="form-control-custom mb-3" placeholder="Phone number" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select className="form-control-custom mb-4" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="tenant">I want to rent (Tenant)</option>
          <option value="owner">I want to list properties (Owner)</option>
        </select>
        <button className="btn-primary-custom w-100" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
      </form>
      <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
}

export default Register;
