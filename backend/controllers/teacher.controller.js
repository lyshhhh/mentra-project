const db = require("../config/db");

/* =========================
   GET STUDENTS (Teacher view)
   =========================
   NOTE:
   For now, teacher can see all students.
   Later, you can filter by subject/session.
*/
exports.getStudents = (req, res) => {
  const sql = `
    SELECT s.id, s.roll_no, s.session, s.class_name, u.name
    FROM students s
    JOIN users u ON s.user_id = u.id
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   ADD / UPDATE ATTENDANCE
   ========================= */
exports.addAttendance = (req, res) => {
  const { student_id, subject, percentage } = req.body;

  const sql = `
    INSERT INTO attendance (student_id, subject, percentage)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE percentage = ?
  `;

  db.query(sql, [student_id, subject, percentage, percentage], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "✅ Attendance saved" });
  });
};

/* =========================
   ADD / UPDATE MARKS
   ========================= */
exports.addMarks = (req, res) => {
  const { student_id, subject, marks } = req.body;

  const sql = `
    INSERT INTO marks (student_id, subject, marks)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE marks = ?
  `;

  db.query(sql, [student_id, subject, marks, marks], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "✅ Marks saved" });
  });
};

/* =========================
   ADD TEACHER FEEDBACK
   ========================= */
exports.addFeedback = (req, res) => {
  const { student_id, message } = req.body;

  const sql = `
    INSERT INTO mentor_feedback (student_id, from_role, message)
    VALUES (?, 'teacher', ?)
  `;

  db.query(sql, [student_id, message], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "✅ Feedback added" });
  });
};
