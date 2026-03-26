require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // ✅ DB connection

const authRoutes    = require("./routes/auth.routes");
const adminRoutes   = require("./routes/admin.routes");
const mentorRoutes  = require("./routes/mentor.routes");
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes");
const parentRoutes  = require("./routes/parent.routes");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth",    authRoutes);
app.use("/api/admin",   adminRoutes);
app.use("/api/mentor",  mentorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/parent",  parentRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Mentra Backend Running");
});


// 🔥 CREATE ADMIN TABLE
db.query(`
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
)
`, (err) => {
  if (err) console.log(err);
  else console.log("Admin table ready ✅");
});


// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});