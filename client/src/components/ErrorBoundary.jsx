import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-section not-found">
          <h1>Oops</h1>
          <p>Something went wrong. Please refresh the page.</p>
          <Link to="/" className="btn-primary-custom" style={{ display: "inline-block", marginTop: 20 }}>
            Go Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
