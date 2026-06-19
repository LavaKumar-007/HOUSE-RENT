import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/layouts/AuthLayout";
import PageMeta from "../components/PageMeta";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await resetPassword(token, password);
      await setAuthUser(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter your new password.">
      <PageMeta title="Reset Password" />
      {error && <div className="alert-custom alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control-custom mb-4" type="password" placeholder="New password (min 6 chars)" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary-custom w-100" disabled={loading}>{loading ? "Saving..." : "Reset Password"}</button>
      </form>
      <p className="auth-footer"><Link to="/login">Back to login</Link></p>
    </AuthLayout>
  );
}

export default ResetPassword;
