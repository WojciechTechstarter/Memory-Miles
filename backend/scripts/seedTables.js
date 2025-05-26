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

// app.post("/seed-extended-countries", (req, res) => {
//     const insert = db.prepare(`INSERT INTO countries (name, continent_id) VALUES (?, ?)`);
//     extendedCountries.forEach((country) => {
//         insert.run(country.name, country.continent_id);
//     });
//     insert.finalize((err) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(201).json({ message: "Extended countries seeded" });
//     });
// });


// app.delete("/delete-all-places", (req, res) => {
//     db.run("DELETE FROM places", (err) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "All places deleted" });
//     });
// });