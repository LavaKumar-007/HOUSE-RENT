import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resendVerification } from "../api/authApi";
import { getRoleRedirect } from "../utils/auth";
import AuthLayout from "../components/layouts/AuthLayout";
import PageMeta from "../components/PageMeta";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (user) navigate(getRoleRedirect(user.role), { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const data = await login(form);
      const redirect = searchParams.get("redirect") || getRoleRedirect(data.user.role);
      navigate(redirect);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      if (err.response?.data?.needsVerification) setNeedsVerification(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const data = await resendVerification(form.email);
      setInfo(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Access your dashboard, bookings, and saved homes.">
      <PageMeta title="Sign In" description="Login to HouseHunt" />
      {error && <div className="alert-custom alert-error">{error}</div>}
      {info && <div className="alert-custom alert-success">{info}</div>}
      {needsVerification && (
        <div className="alert-custom alert-info">
          <button type="button" className="btn-outline-custom w-100" onClick={handleResend} disabled={resending}>
            {resending ? "Sending..." : "Resend verification email"}
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input className="form-control-custom mb-3" type="email" placeholder="Email address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control-custom mb-3" type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Link to="/forgot-password" style={{ color: "var(--primary)", fontWeight: 600 }}>Forgot password?</Link>
        </div>
        <button className="btn-primary-custom w-100" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
      </form>
      <p className="auth-footer">New here? <Link to="/register">Create an account</Link></p>
      {import.meta.env.DEV && (
        <div className="demo-box">
          <strong>Demo accounts:</strong>
          <p>Tenant: sneha@househunt.com / Tenant@123</p>
          <p>Owner: rahul@househunt.com / Owner@123</p>
        </div>
      )}
    </AuthLayout>
  );
}

export default Login;
