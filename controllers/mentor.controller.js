const db = require("../config/db");

/* =========================
   GET ASSIGNED MENTEES
   ========================= */
exports.getMentees = (req, res) => {
  const mentorUserId = req.user.id;

  const sql = `
    SELECT s.id AS student_id, s.roll_no, s.session, s.class_name, u.name
    FROM mentor_student ms
    JOIN mentors m ON ms.mentor_id = m.id
    JOIN students s ON ms.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE m.user_id = ?
  `;

  db.query(sql, [mentorUserId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

/* =========================
   VIEW PERFORMANCE (Marks + Attendance)
   ========================= */
exports.getStudentPerformance = (req, res) => {
  const { student_id } = req.params;

  const marksSql = "SELECT subject, marks FROM marks WHERE student_id = ?";
  const attendanceSql =
    "SELECT subject, percentage FROM attendance WHERE student_id = ?";

  db.query(marksSql, [student_id], (err, marks) => {
    if (err) return res.status(500).json(err);

    db.query(attendanceSql, [student_id], (err, attendance) => {
      if (err) return res.status(500).json(err);

      res.json({ marks, attendance });
    });
  });
};

/* =========================
   ADD MENTOR FEEDBACK
   ========================= */
exports.addMentorFeedback = (req, res) => {
  const { student_id, message } = req.body;

  const sql = `
    INSERT INTO mentor_feedback (student_id, from_role, message)
    VALUES (?, 'mentor', ?)
  `;

  db.query(sql, [student_id, message], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "✅ Mentor feedback added" });
  });
};

/* =========================
   PERFORMANCE ALERT (COLOR LOGIC)
   ========================= */
exports.getPerformanceAlert = (req, res) => {
  const { student_id } = req.params;

  const sql =
    "SELECT AVG(percentage) AS avgAttendance FROM attendance WHERE student_id = ?";

  db.query(sql, [student_id], (err, result) => {
    if (err) return res.status(500).json(err);

    const avg = result[0].avgAttendance || 0;
    let status = "green";

    if (avg < 50) status = "red";
    else if (avg < 80) status = "orange";

    res.json({
      averageAttendance: avg,
      status
    });
  });
};

/* =========================
   SCHEDULE MENTOR MEETING
   ========================= */
exports.scheduleMeeting = (req, res) => {
  const { student_id, meeting_date, message } = req.body;

  const sql = `
    INSERT INTO notifications (student_id, type, message)
    VALUES (?, 'meeting', ?)
  `;

  db.query(
    sql,
    [student_id, `Meeting on ${meeting_date}: ${message}`],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "✅ Meeting scheduled" });
    }
  );
};
