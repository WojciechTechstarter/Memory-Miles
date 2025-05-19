import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PlacesList from './components/PlacesList';
import AddPlacePage from './AddPlacePage';


function App() {
  return (
    <div>
      {/* Link To Navigation Bar */}
      <nav>
        <Link to="/places">Places</Link> | <Link to="/add">Add Place</Link>
      </nav>

      {/* Route switcher */}
      <Routes>
        <Route path="/places" element={<PlacesList />} />
        <Route path="/add" element={<AddPlacePage />} />
      </Routes>

    </div>
  )
}

export default App;
