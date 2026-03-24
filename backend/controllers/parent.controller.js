const db = require("../config/db");

/* =========================
   GET CHILD PROFILE
   ========================= */
exports.getChildProfile = (req, res) => {
  const parentUserId = req.user.id;

  const sql = `
    SELECT 
      s.id AS student_id,
      s.roll_no,
      s.session,
      s.class_name,
      u.name,
      u.email
    FROM parents p
    JOIN students s ON p.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE p.user_id = ?
  `;

  db.query(sql, [parentUserId], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0)
      return res.status(404).json({ message: "Child not found" });

    res.json(rows[0]);
  });
};

/* =========================
   GET CHILD ATTENDANCE
   ========================= */
exports.getChildAttendance = (req, res) => {
  const parentUserId = req.user.id;

  const sql = `
    SELECT a.subject, a.percentage
    FROM parents p
    JOIN attendance a ON a.student_id = p.student_id
    WHERE p.user_id = ?
  `;

  db.query(sql, [parentUserId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   GET CHILD MARKS
   ========================= */
exports.getChildMarks = (req, res) => {
  const parentUserId = req.user.id;

  const sql = `
    SELECT m.subject, m.marks
    FROM parents p
    JOIN marks m ON m.student_id = p.student_id
    WHERE p.user_id = ?
  `;

  db.query(sql, [parentUserId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   GET CHILD FEEDBACK
   ========================= */
exports.getChildFeedback = (req, res) => {
  const parentUserId = req.user.id;

  const sql = `
    SELECT mf.from_role, mf.message, mf.created_at
    FROM parents p
    JOIN mentor_feedback mf ON mf.student_id = p.student_id
    WHERE p.user_id = ?
    ORDER BY mf.created_at DESC
  `;

  db.query(sql, [parentUserId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   GET CHILD NOTIFICATIONS
   ========================= */
exports.getChildNotifications = (req, res) => {
  const parentUserId = req.user.id;

  const sql = `
    SELECT n.type, n.message, n.created_at
    FROM parents p
    JOIN notifications n ON n.student_id = p.student_id
    WHERE p.user_id = ?
    ORDER BY n.created_at DESC
  `;

  db.query(sql, [parentUserId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
