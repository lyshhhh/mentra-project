const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // ✅ Include password_changed in response
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          password_changed: user.password_changed  // 0 or 1
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Change Password (only allowed once)
router.post("/change-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // Check if already changed
    db.query("SELECT password_changed FROM users WHERE id = ?", [userId], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      if (results[0].password_changed === 1) {
        return res.status(403).json({
          message: "Password already changed. Please contact your faculty/admin to reset it."
        });
      }

      // Hash new password and update
      const hashed = await bcrypt.hash(newPassword, 10);
      db.query(
        "UPDATE users SET password = ?, password_changed = 1 WHERE id = ?",
        [hashed, userId],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error" });
          res.json({ message: "Password changed successfully" });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;