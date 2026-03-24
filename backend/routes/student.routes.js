const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ Get student profile + mentor name
router.get("/:userId/profile", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT 
      s.id, s.roll_no, s.class, s.section, s.backlog,
      u.name, u.email,
      mu.name AS mentor_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN mentor_student ms ON ms.student_id = s.id
    LEFT JOIN users mu ON ms.mentor_id = mu.id
    WHERE s.user_id = ?
    LIMIT 1
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(results[0]);
  });
});

// ✅ Get attendance for student
router.get("/:userId/attendance", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT a.date, a.status
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    WHERE s.user_id = ?
    ORDER BY a.date ASC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get marks for student
router.get("/:userId/marks", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT m.subject, m.exam_type, m.marks, m.max_marks
    FROM marks m
    JOIN students s ON m.student_id = s.id
    WHERE s.user_id = ?
    ORDER BY m.subject, m.exam_type
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get feedbacks received by student
router.get("/:userId/feedbacks", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT mf.id, mf.message, mf.created_at, 'Mentor' AS from_role
    FROM mentor_feedback mf
    JOIN students s ON mf.student_id = s.id
    WHERE s.user_id = ?
    ORDER BY mf.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get meetings for student
router.get("/:userId/meetings", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT m.id, m.topic, m.date, m.time, m.status
    FROM meetings m
    JOIN students s ON (m.student_id = s.id OR m.student_id IS NULL)
    JOIN mentor_student ms ON ms.mentor_id = m.mentor_id AND ms.student_id = s.id
    WHERE s.user_id = ?
    ORDER BY m.date DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Submit petition to mentor
router.post("/petition", (req, res) => {
  const { student_id, message } = req.body;

  // Get student's id from user_id
  db.query("SELECT id FROM students WHERE user_id = ?", [student_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Student not found" });

    const sId = results[0].id;
    db.query(
      "UPDATE students SET petition = ? WHERE id = ?",
      [message, sId],
      (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Petition sent successfully" });
      }
    );
  });
});

module.exports = router;