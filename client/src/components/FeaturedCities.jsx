const cities = [
  {
    name: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200",
  },
  {
    name: "Bengaluru",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200",
  },
  {
    name: "Chennai",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200",
  },
  {
    name: "Vijayawada",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
  },
];

function FeaturedCities() {
  return (
    <section
      style={{
        padding: "100px 40px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
        }}
      >
        <h2
          style={{
            fontSize: "3rem",
            marginBottom: "50px",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          Explore Popular Cities
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "25px",
          }}
        >
          {cities.map((city) => (
            <div
              key={city.name}
              style={{
                height: "380px",
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <img
                src={city.image}
                alt={city.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(transparent, rgba(0,0,0,0.8))",
                }}
              />

              <h3
                style={{
                  position: "absolute",
                  bottom: "25px",
                  left: "25px",
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: "700",
                }}
              >
                {city.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCities;