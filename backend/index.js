const express = require("express")
const app = express()
// Importing the sqlite3 module to work with SQLite databases
const sqlite3 = require("sqlite3").verbose()
// db is the database connection object
const db = new sqlite3.Database("./database/traveljournal.db")
// Importing the cors module to enable Cross-Origin Resource Sharing


//Middleware to parse JSON data from incoming requests
app.use(express.json())

// Test route to check if the server is running
app.get("/", (req, res) => {
    res.send("MemoryMiles backend is running!")
})

db.run(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`, ["Portugal", 1]);
db.run(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`, ["Japan", 2]);
db.run(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`, ["Cyprus", 1]);

db.run(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`,
    ['Bulgaria', 1],
    function (err) {
        if (err) {
            return console.error(`Error inserting country:`, err.message)
        } else {
            console.log(`Country inserted with ID ${this.lastID}`)
        }
    }
),






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


app.listen(5005, () => {
    console.log("The server is running on http://localhost:5005")
})