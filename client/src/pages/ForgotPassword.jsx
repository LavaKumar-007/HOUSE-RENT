import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import AuthLayout from "../components/layouts/AuthLayout";
import PageMeta from "../components/PageMeta";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password" subtitle="We'll send you a reset link.">
      <PageMeta title="Forgot Password" />
      {error && <div className="alert-custom alert-error">{error}</div>}
      {message && <div className="alert-custom alert-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control-custom mb-4" type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-primary-custom w-100" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
      </form>
      <p className="auth-footer"><Link to="/login">Back to login</Link></p>
    </AuthLayout>
  );
}

export default ForgotPassword;
