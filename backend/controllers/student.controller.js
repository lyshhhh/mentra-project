const db = require("../config/db");

/* =========================
   GET STUDENT PROFILE
   ========================= */
exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT s.id AS student_id, s.roll_no, s.session, s.class_name, u.name, u.email
    FROM students s
    JOIN users u ON s.user_id = u.id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0)
      return res.status(404).json({ message: "Student not found" });

    res.json(rows[0]);
  });
};

/* =========================
   GET ATTENDANCE
   ========================= */
exports.getAttendance = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT a.subject, a.percentage
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    WHERE s.user_id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   GET MARKS
   ========================= */
exports.getMarks = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT m.subject, m.marks
    FROM marks m
    JOIN students s ON m.student_id = s.id
    WHERE s.user_id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   GET FEEDBACK
   ========================= */
exports.getFeedback = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT mf.from_role, mf.message, mf.created_at
    FROM mentor_feedback mf
    JOIN students s ON mf.student_id = s.id
    WHERE s.user_id = ?
    ORDER BY mf.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   GET NOTIFICATIONS
   ========================= */
exports.getNotifications = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT n.type, n.message, n.created_at
    FROM notifications n
    JOIN students s ON n.student_id = s.id
    WHERE s.user_id = ?
    ORDER BY n.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
