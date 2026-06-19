import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";

function NotFound() {
  return (
    <div className="page-section not-found">
      <PageMeta title="404" />
      <h1>404</h1>
      <h2 className="display-title" style={{ marginBottom: 16 }}>Page not found</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary-custom">Back to Home</Link>
    </div>
  );
}

export default NotFound;
