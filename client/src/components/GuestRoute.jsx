import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleRedirect } from "../utils/auth";

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate(getRoleRedirect(user.role), { replace: true });
  }, [user, loading, navigate]);

  if (loading) return <div className="page-loader"><div className="loader-ring" /></div>;
  if (user) return null;
  return children;
}

export default GuestRoute;
