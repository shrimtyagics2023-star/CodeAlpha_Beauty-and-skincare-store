const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",      // <-- your MySQL password
    database: "skincare_app"   // <-- your DB name
});

db.connect(err => {
    if(err) console.log("❌ DB Connection Failed", err);
    else console.log("✅ DB Connected");
});

// User registration
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.json({ success: false, message: "All fields required" });

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if(err) return res.json({ success: false, message: "Email already exists" });
        res.json({ success: true, message: "User registered successfully" });
    });
});

// User login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.json({ success: false, message: "Email and password required" });

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if(err) return res.json({ success: false, message: "Server error" });
        if(result.length > 0) res.json({ success: true, message: "Login successful", user: result[0] });
        else res.json({ success: false, message: "Invalid email or password" });
    });
});

// Get products by skin type
app.get("/products", (req, res) => {
    const skinType = req.query.type;
    const sql = "SELECT * FROM products WHERE skin_type = ?";
    db.query(sql, [skinType], (err, results) => {
        if(err) return res.json({ success: false, message: "Server error" });
        res.json({ success: true, products: results });
    });
});

// Start server
app.listen(3001, () => console.log("🚀 Server running on port 3001"));