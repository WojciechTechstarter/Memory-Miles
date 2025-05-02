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

// db.run(`INSERT INTO countries (name, continent_id) VALUES ("Portugal", 1)`);
// db.run(`INSERT INTO countries (name, continent_id) VALUES ("Japan", 2)`);
// db.run(`INSERT INTO countries (name, continent_id) VALUES ("Cyprus", 1)`);






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





app.listen(5005, () => {
    console.log("The server is running on http://localhost:5005")
})