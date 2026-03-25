const express = require("express");
const adminController = require("../controllers/admin.controller");
const db = require("../config/db");

const router = express.Router();

// ✅ Students
router.post("/students", adminController.addStudent);
router.get("/students", (req, res) => {
  db.query(
    "SELECT s.id, u.name, u.email, s.roll_no, s.class, s.section FROM students s JOIN users u ON s.user_id = u.id",
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
});

// ✅ Teachers
router.post("/teachers", adminController.addTeacher);
router.get("/teachers", (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE role = 'teacher'",
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
});

// ✅ Mentors
router.post("/mentors", adminController.addMentor);
router.get("/mentors", (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE role = 'mentor'",
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
});

// ✅ Assign Mentor to Student
router.post("/assign-mentor", (req, res) => {
  const { student_id, mentor_id } = req.body;
  db.query(
    "UPDATE students SET mentor_id = ? WHERE id = ?",
    [mentor_id, student_id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Mentor assigned successfully" });
    }
  );
});

// ✅ Stats
router.get("/stats", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM students", (err, students) => {
    if (err) return res.status(500).json({ message: err.message });
    db.query("SELECT COUNT(*) AS total FROM users WHERE role='teacher'", (err, teachers) => {
      if (err) return res.status(500).json({ message: err.message });
      db.query("SELECT COUNT(*) AS total FROM users WHERE role='mentor'", (err, mentors) => {
        if (err) return res.status(500).json({ message: err.message });
        db.query("SELECT COUNT(*) AS total FROM subjects", (err, subjects) => {
          const subjectCount = err ? 0 : subjects[0].total;
          res.json({
            students: students[0].total,
            teachers: teachers[0].total,
            mentors: mentors[0].total,
            subjects: subjectCount
          });
        });
      });
    });
  });
});

// ✅ Analytics
router.get("/analytics", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM students", (err, students) => {
    if (err) return res.status(500).json({ message: err.message });
    db.query("SELECT COUNT(*) AS total FROM users WHERE role='teacher'", (err, teachers) => {
      if (err) return res.status(500).json({ message: err.message });
      db.query("SELECT COUNT(*) AS total FROM users WHERE role='mentor'", (err, mentors) => {
        if (err) return res.status(500).json({ message: err.message });
        db.query("SELECT COUNT(*) AS total FROM subjects", (err, subjects) => {
          const subjectCount = err ? 0 : subjects[0].total;
          db.query("SELECT COUNT(*) AS total FROM students WHERE attendance_percent > 80", (err, green) => {
            const greenCount = err ? 0 : green[0].total;
            db.query("SELECT COUNT(*) AS total FROM students WHERE attendance_percent BETWEEN 50 AND 80", (err, orange) => {
              const orangeCount = err ? 0 : orange[0].total;
              db.query("SELECT COUNT(*) AS total FROM students WHERE attendance_percent < 50", (err, red) => {
                const redCount = err ? 0 : red[0].total;
                res.json({
                  students: students[0].total,
                  teachers: teachers[0].total,
                  mentors: mentors[0].total,
                  subjects: subjectCount,
                  green: greenCount,
                  orange: orangeCount,
                  red: redCount
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;