const express = require("express")
const app = express()
// Importing the sqlite3 module to work with SQLite databases
const sqlite3 = require("sqlite3").verbose()
// db is the database connection object
const db = new sqlite3.Database("./database/traveljournal.db")
// Importing the cors module to enable Cross-Origin Resource Sharing
const cors = require("cors")


app.use(cors())
//Middleware to parse JSON data from incoming requests
app.use(express.json())

// Test route to check if the server is running
app.get("/", (req, res) => {
    res.send("MemoryMiles backend is running!")
})


// Inserting some countries into the database for testing purposes
// db.run(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`, ["Portugal", 1]);
// db.run(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`, ["Japan", 2]);
// db.run(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`, ["Cyprus", 1]);

// db.run(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`,
//     ['Bulgaria', 1],
//     function (err) {
//         if (err) {
//             return console.error(`Error inserting country:`, err.message)
//         } else {
//             console.log(`Country inserted with ID ${this.lastID}`)
//         }
//     }
// ),



app.get("/countries", (req, res) => {
    // Query to select all countries from the database
    db.all(`SELECT * FROM countries`, [], (err, rows) => {
        if (err) {
            console.error(err)
            res.status(500).send("Internal server error")
        } else {
            res.status(200).json(rows)
        }
    })
})

// get places route
app.get("/places", (req, res) => {

    const query = `
    SELECT * FROM places
    `

    db.all(query, [], function (err, rows) {
        if (err) {
            res.status(501).json({ error: "Failed to display places. Try again later" })
        } else[
            res.status(201).json(rows)
        ]
    })
})


// get /places?country_id=.., showi only places for a selected country
app.get("/places", (req, res) => {
    const countryId = req.query.country_id

    if (!countryId) {
        res.send(400).json("The query parameter is missing")
    } else {
        db.all(`SELECT * FROM places WHERE country_id = ?`,
            [countryId],
            (err, rows) => {
                if (err) {
                    res.status(500).json({ error: 'Internal server error' })
                } else {
                    res.send(rows).json("Here are the places")
                }
            }
        )
    }
})


// posting a new place
app.post("/places", (req, res) => {
    const {
        country_id, name, description, image_url, rating_culture, rating_scenery,
        rating_fun, rating_safety } = req.body




    if (!country_id || !name) {
        return res.status(404).json({ error: "Missing required fields: country_id or name" })
    }

    const query =
        `INSERT INTO places (
         country_id, name, description, image_url, rating_culture, rating_scenery,
        rating_fun, rating_safety
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         `

    const VALUES = [
        Number(country_id),
        name,
        description || null,
        image_url || null,
        rating_culture || null,
        rating_scenery || null,
        rating_fun || null,
        rating_safety || null
    ]

    db.run(query, VALUES, function (err) {
        if (err) {
            res.status(500).json({ error: "Failed to insert places" })
        } else {
            res.status(201).json({
                message: "Place added succesfully",
                place_id: this.lastID
            })
        }
    })
})


// editing an existing trip
app.put("/places/:id", (req, res) => {
    const placesId = req.params.id
    const {
        country_id, name, description, image_url, rating_culture, rating_scenery,
        rating_fun, rating_safety
    } = req.body

    if (!name) {
        return res.status(404).json({ error: "Missing data" })
    }

    const query = `
    UPDATE places
    SET country_id = ?, name = ?, description = ?, image_url = ?, rating_culture = ?, rating_scenery = ?, 
    rating_fun = ?, rating_safety = ?
    WHERE id = ?
    `
    const values = [country_id, name, description, image_url, rating_culture, rating_scenery,
        rating_fun, rating_safety, placesId]

    db.run(query, values, function (err) {
        if (err) {
            res.stutus(500).json({ error: "Internal server error" })
        } else if (this.change = 0) {
            res.status(404).json({ error: "No changes were made" })
        } else {
            res.status(201).json({ message: "The place has been edited successfully" })
        }
    })



})






// posting a new trip plan
app.post("/plannedtrips", (req, res) => {
    const { country_id, city, startDate, endDate, companions, notes } = req.body

    if (!country_id || !city || !startDate || !endDate) {
        res.status(500).json({ error: "Missing required fields" })
    }

    const query =
        `INSERT INTO plannedTrips
    (country_id, city, startDate, endDate, companions, notes) VALUES
    (?, ?, ?, ?, ?, ?)`

    const values = [country_id, city, startDate, endDate, companions, notes]

    db.run(query, values, function (err) {
        if (err) {
            res.status(500).json({ error: "Internal server error" })
        } else {
            res.status(201).json({
                message: "Trip added succesfully",
                tripId: this.lastID,
            })
        }
    })
})

// show all planned trips
app.get("/plannedtrips", (req, res) => {

    const countryId = req.query.country_id
    const sort = req.query.sort;
    const order = req.query.order || "asc" // Default to ascending order

    console.log("country id:", countryId);

    let query = `
    SELECT plannedtrips.*, countries.name AS country_name
    FROM plannedtrips
    JOIN countries ON plannedtrips.country_id = countries.id
    `

    const values = []

    if (countryId) {
        query += `WHERE plannedtrips.country_id = ?`; // Add the WHERE clause
        values.push(Number(countryId)) // Add the country ID to the values array
    }

    if (sort === "startDate") {
        query += `ORDER BY startDate ${order.toUpperCase() === "DESC" ? "DESC" : "ASC"}` // Use ASC or DESC based on the order parameter
    }


    console.log("Final query:", query);
    console.log("Values:", values);

    db.all(query, values, function (err, rows) {
        if (err) {
            res.status(500).json({ error: "Internal server error" })
        } else {
            res.status(200).json(rows)
        }
    })

})

// let the user edit existing trips
app.put("/plannedtrips/:id", (req, res) => {
    const plannedTripsId = req.params.id
    const { country_id, city, startDate, endDate, companions, notes } = req.body

    const query = `
    UPDATE plannedTrips
    SET country_id = ?, city = ?, startDate = ?, endDate = ?, companions = ?, notes = ?
    WHERE id = ?
    `
    const values = [country_id, city, startDate, endDate, companions, notes, plannedTripsId]

    db.run(query, values, function (err) {
        if (err) {
            res.status(501).json({ error: "Internal server error" })
        } else if (this.changes === 0) {
            res.status(404).json({ error: "Trip not found" })
        } else {
            res.status(201).json({
                message: "Trip edited succesfully"
            })
        }
    })
})


// Deleting planned trips
app.delete("/plannedtrips/:id", (req, res) => {
    const plannedTripsId = req.params.id

    const query = `
    DELETE FROM plannedTrips
    WHERE id = ?
    `

    db.run(query, [plannedTripsId], function (err) {
        if (err) {
            res.status(501).json({ err: "Internal server error" })
        } else if (this.changes === 0) {
            res.status(404).json({ err: "trip not found" })
        } else {
            res.status(200).json(
                { message: "Trip deleted succesfully" })
        }
    })
})



app.listen(5005, () => {
    console.log("The server is running on http://localhost:5005")
})