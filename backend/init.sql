CREATE TABLE IF NOT EXISTS continents (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    continent_id INTEGER NOT NULL,
    FOREIGN KEY (continent_id) REFERENCES continents(id)
);


CREATE TABLE IF NOT EXISTS places (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  country_id INTEGER NOT NULL,
  image_url TEXT,
  rating_culture INTEGER,
  rating_scenery INTEGER,
  rating_fun INTEGER,
  rating_safety INTEGER,
  FOREIGN KEY (country_id) REFERENCES countries(id)
);

CREATE TABLE IF NOT EXISTS plannedTrips (
    id INTEGER PRIMARY KEY,
    country_id INTEGER,
    city TEXT NOT NULL,
    startDate TEXT,
    endDate TEXT,
    companions TEXT,
    notes TEXT
)