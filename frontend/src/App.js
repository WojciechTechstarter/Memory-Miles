import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PlacesList from './pages/PlacesList';
import AddPlacePage from './pages/AddPlacePage';
import "./css/Navbar.css"
import CountriesPage from './pages/CountriesPage';

function App() {
  return (
    <div>
      {/* Link To Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-title">🧭 Memory Miles</Link>
        </div>
        <div className="navbar-right">
          <Link to="/places">Places</Link>
          <span> | </span>
          <Link to="/add">Add Place</Link>
          <span> | </span>
          <Link to="/countries">Countries</Link>
        </div>
      </nav>

      {/* Route switcher */}
      <main>
        <Routes>
          <Route path="/" element={<PlacesList />} />
          <Route path="/places" element={<PlacesList />} />
          <Route path="/add" element={<AddPlacePage />} />
          <Route path="/countries" element={<CountriesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
