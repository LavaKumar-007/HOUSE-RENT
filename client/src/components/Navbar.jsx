import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.9)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#2563eb",
          }}
        >
          <h2
            style={{
              fontWeight: 800,
              margin: 0,
            }}
          >
            <FaHome /> HouseHunt
          </h2>
        </Link>

        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#0f172a",
            }}
          >
            Home
          </Link>

          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#0f172a",
            }}
          >
            Properties
          </Link>

          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#0f172a",
            }}
          >
            About
          </Link>

          <Link to="/add-property">
            <button
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              List Property
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;