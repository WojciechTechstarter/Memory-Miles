const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database/traveljournal.db");
const db = new sqlite3.Database(dbPath);

db.run(`ALTER TABLE places ADD COLUMN image_url TEXT`, (err) => {
    if (err) {
        if (err.message.includes("duplicate column name")) {
            console.log("🟡 Column already exists.");
        } else {
            console.error("❌ Error:", err.message);
        }
    } else {
        console.log("✅ Column image_url added.");
    }

    db.close();
});
