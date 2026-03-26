const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// ✅ LOGIN (ADMIN)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT * FROM admin WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    console.log("DB ERROR:", err);
    console.log("RESULTS:", results);

    // ❌ DB error
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    // ❌ No user found
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    try {
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // ✅ Success
      res.json({
        message: "Login successful ✅",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: "admin"
        }
      });

    } catch (error) {
      console.error("COMPARE ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
});

module.exports = router;