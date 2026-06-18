import { motion } from "framer-motion";

function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          textAlign: "center",
          color: "white",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: "800",
            lineHeight: "1.1",
            marginBottom: "20px",
            color: "white",
          }}
        >
          Find Your Dream Home
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "1.3rem",
            maxWidth: "700px",
            margin: "auto",
            marginBottom: "40px",
          }}
        >
          Discover verified rental properties across
          Hyderabad, Bengaluru, Chennai, Vijayawada,
          Vizag and more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "20px",
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1fr 1fr",
              gap: "15px",
            }}
          >
            <input
              placeholder="Search by city..."
              style={{
                padding: "18px",
                borderRadius: "14px",
                border: "none",
                outline: "none",
              }}
            />

            <select
              style={{
                padding: "18px",
                borderRadius: "14px",
                border: "none",
              }}
            >
              <option>Property Type</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>PG</option>
            </select>

            <button
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "14px",
                fontWeight: "600",
              }}
            >
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;