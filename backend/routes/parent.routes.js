const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ Get parent's child info + mentor + teacher
router.get("/:userId/child", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT 
      s.id AS student_id,
      su.name AS student_name,
      s.roll_no, s.class, s.section, s.backlog,
      mu.name AS mentor_name,
      mu.email AS mentor_email,
      pu.phone AS mentor_phone
    FROM parent_student ps
    JOIN users pu ON ps.parent_user_id = pu.id
    JOIN students s ON ps.student_id = s.id
    JOIN users su ON s.user_id = su.id
    LEFT JOIN mentor_student ms ON ms.student_id = s.id
    LEFT JOIN users mu ON ms.mentor_id = mu.id
    WHERE pu.id = ?
    LIMIT 1
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Child not found" });
    res.json(results[0]);
  });
});

// ✅ Get child's attendance
router.get("/:userId/attendance", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT a.date, a.status
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN parent_student ps ON ps.student_id = s.id
    JOIN users pu ON ps.parent_user_id = pu.id
    WHERE pu.id = ?
    ORDER BY a.date DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get child's marks
router.get("/:userId/marks", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT m.subject, m.exam_type, m.marks, m.max_marks
    FROM marks m
    JOIN students s ON m.student_id = s.id
    JOIN parent_student ps ON ps.student_id = s.id
    JOIN users pu ON ps.parent_user_id = pu.id
    WHERE pu.id = ?
    ORDER BY m.subject, m.exam_type
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get child's feedback (from mentor + teacher)
router.get("/:userId/feedback", (req, res) => {
  const { userId } = req.params;

  // Mentor feedback
  const mentorSql = `
    SELECT mf.message, mf.created_at, 'Mentor' AS from_role
    FROM mentor_feedback mf
    JOIN students s ON mf.student_id = s.id
    JOIN parent_student ps ON ps.student_id = s.id
    JOIN users pu ON ps.parent_user_id = pu.id
    WHERE pu.id = ?
  `;

  // Teacher feedback
  const teacherSql = `
    SELECT f.message, f.created_at, 'Teacher' AS from_role
    FROM feedback f
    JOIN students s ON f.student_id = s.id
    JOIN parent_student ps ON ps.student_id = s.id
    JOIN users pu ON ps.parent_user_id = pu.id
    WHERE pu.id = ?
  `;

  db.query(mentorSql, [userId], (err, mentorResults) => {
    if (err) return res.status(500).json({ message: err.message });

    db.query(teacherSql, [userId], (err, teacherResults) => {
      if (err) return res.status(500).json({ message: err.message });

      const combined = [...mentorResults, ...teacherResults]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.json(combined);
    });
  });
});

// ✅ Get child's meetings
router.get("/:userId/meetings", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT m.topic, m.date, m.time, m.status
    FROM meetings m
    JOIN students s ON (m.student_id = s.id OR m.student_id IS NULL)
    JOIN mentor_student ms ON ms.mentor_id = m.mentor_id AND ms.student_id = s.id
    JOIN parent_student ps ON ps.student_id = s.id
    JOIN users pu ON ps.parent_user_id = pu.id
    WHERE pu.id = ?
    ORDER BY m.date DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get teachers info for child's subjects
router.get("/:userId/teachers", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT DISTINCT u.name AS teacher_name, u.email AS teacher_email, s.name AS subject
    FROM teacher_subjects ts
    JOIN teachers t ON ts.teacher_id = t.id
    JOIN users u ON t.user_id = u.id
    JOIN subjects s ON ts.subject_id = s.id
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;