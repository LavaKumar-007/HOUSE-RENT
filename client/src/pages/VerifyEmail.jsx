import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await verifyEmail(token);
        setAuthUser(data.token, data.user);
        setStatus("success");
        setMessage(data.message);
        setTimeout(() => navigate("/dashboard"), 2500);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed");
      }
    };
    verify();
  }, [token, navigate, setAuthUser]);

  return (
    <div className="page-section auth-page">
      <div className="container-xl auth-container">
        <div className="auth-card glass-card" style={{ textAlign: "center" }}>
          {status === "loading" && (
            <>
              <div className="loader-ring" style={{ margin: "0 auto 20px" }} />
              <h2>Verifying your email...</h2>
            </>
          )}
          {status === "success" && (
            <>
              <div className="alert-custom alert-success">{message}</div>
              <p>Redirecting to dashboard...</p>
            </>
          )}
          {status === "error" && (
            <>
              <div className="alert-custom alert-error">{message}</div>
              <Link to="/login" className="btn-primary-custom">Go to Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
