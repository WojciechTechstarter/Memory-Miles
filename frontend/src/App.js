import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PlacesList from './components/PlacesList';
import AddPlacePage from './AddPlacePage';
import "./Navbar.css"
import CountriesPage from './components/CountriesPage';

function App() {
  return (
    <div>
      {/* Link To Navigation Bar */}
      <nav className="navbar">
        <Link to="/places">Places</Link> | <Link to="/add">Add Place</Link>
        | <Link to="/countries">Countries</Link>
      </nav>

      {/* Route switcher */}
      <main>
        <Routes>
          <Route path="/places" element={<PlacesList />} />
          <Route path="/add" element={<AddPlacePage />} />
          <Route path="/countries" element={<CountriesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
