const fs = require('fs'); // Importing the fs module to work with the file system
const sqlite3 = require('sqlite3').verbose(); // Importing the sqlite3 module to work with SQLite databases
const path = require('path'); // Importing the path module to work with file and directory paths

// Paths to database and SQL file
const dbPath = path.join(__dirname, 'database', 'traveljournal.db');
const sqlPath = path.join(__dirname, 'init.sql');

// Read SQL commands from file
const sql = fs.readFileSync(sqlPath, 'utf8');

// Connect to SQLite database (creates the file if it doesn't exist)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('❌ Failed to connect to the database:', err.message);
    }
    console.log('✅ Connected to SQLite database.');
});

// Execute SQL commands from the file
db.exec(sql, (err) => {
    if (err) {
        console.error('❌ Failed to execute SQL commands:', err.message);
    } else {
        console.log('✅ Database initialized successfully from init.sql.');
    }

    // Close the database connection
    db.close((err) => {
        if (err) {
            return console.error('❌ Error while closing the database:', err.message);
        }
        console.log('🛑 Database connection closed.');
    });
});


