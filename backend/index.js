const express = require("express")
const app = express()

//Middleware to parse JSON data from incoming requests
app.use(express.json())

// Test route to check if the server is running
app.get("/", (req, res) => {
    res.send("MemoryMiles backend is running!")
})

app.listen(5005, () => {
    console.log("The server is running on http://localhost:5005")
})