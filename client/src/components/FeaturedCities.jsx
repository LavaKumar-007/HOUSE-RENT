import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const cities = [
  { name: "Hyderabad", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200" },
  { name: "Bengaluru", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200" },
  { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200" },
  { name: "Vijayawada", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200" },
  { name: "Vizag", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200" },
  { name: "Warangal", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200" },
];

function FeaturedCities() {
  const navigate = useNavigate();

  return (
    <section className="cities-section">
      <div className="container-xl">
        <p className="section-label">Explore</p>
        <h2 className="display-title section-heading">Popular cities</h2>

        <div className="cities-grid">
          {cities.map((city, i) => (
            <motion.div
              key={city.name}
              className="city-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate(`/properties?city=${city.name}`)}
            >
              <img src={city.image} alt={city.name} />
              <div className="city-overlay" />
              <h3>{city.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .cities-section { padding: 100px 0; background: #fff; }
        .section-heading { font-size: clamp(2rem, 4vw, 3.2rem); margin: 12px 0 48px; }
        .cities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .city-card {
          position: relative;
          height: 340px;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.35s ease;
        }
        .city-card:hover { transform: translateY(-8px) scale(1.02); }
        .city-card img { width: 100%; height: 100%; object-fit: cover; }
        .city-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 40%, rgba(0,0,0,0.75));
        }
        .city-card h3 {
          position: absolute;
          bottom: 24px;
          left: 24px;
          color: #fff;
          font-family: var(--font-display);
          font-size: 1.8rem;
        }
      `}</style>
    </section>
  );
}

export default FeaturedCities;
