import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedCities from "./components/FeaturedCities";
import FeaturedProperties from "./components/FeaturedProperties";

import AddProperty from "./pages/AddProperty";
import PropertyDetails from "./pages/PropertyDetails";

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCities />
      <FeaturedProperties />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/add-property"
          element={<AddProperty />}
        />

        <Route
          path="/property/:id"
          element={<PropertyDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;