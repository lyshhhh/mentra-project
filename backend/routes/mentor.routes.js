const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ Get mentees assigned to this mentor
router.get("/:mentorId/mentees", (req, res) => {
  const { mentorId } = req.params;
  const sql = `
    SELECT 
      s.id, u.name, s.roll_no, s.class, s.section,
      COALESCE(s.attendance_percent, 0) AS attendance,
      COALESCE(s.avg_marks, 0) AS avg_marks,
      COALESCE(s.backlog, 0) AS backlog,
      s.petition
    FROM mentor_student ms
    JOIN students s ON ms.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE ms.mentor_id = ?
  `;
  db.query(sql, [mentorId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get stats for mentor
router.get("/:mentorId/stats", (req, res) => {
  const { mentorId } = req.params;

  db.query(
    "SELECT COUNT(*) AS total FROM mentor_student WHERE mentor_id = ?",
    [mentorId],
    (err, mentees) => {
      if (err) return res.status(500).json({ message: err.message });

      db.query(
        `SELECT COUNT(*) AS total FROM mentor_student ms
         JOIN students s ON ms.student_id = s.id
         WHERE ms.mentor_id = ? AND s.attendance_percent < 80`,
        [mentorId],
        (err, lowAtt) => {
          if (err) return res.status(500).json({ message: err.message });

          db.query(
            `SELECT COUNT(*) AS total FROM mentor_student ms
             JOIN students s ON ms.student_id = s.id
             WHERE ms.mentor_id = ? AND s.backlog = 1`,
            [mentorId],
            (err, backlogs) => {
              if (err) return res.status(500).json({ message: err.message });

              db.query(
                "SELECT COUNT(*) AS total FROM meetings WHERE mentor_id = ? AND status = 'Scheduled'",
                [mentorId],
                (err, meetings) => {
                  const meetingCount = err ? 0 : meetings[0].total;

                  res.json({
                    mentees: mentees[0].total,
                    lowAttendance: lowAtt[0].total,
                    backlogs: backlogs[0].total,
                    meetings: meetingCount,
                    parents: mentees[0].total
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// ✅ Get meetings for mentor
router.get("/:mentorId/meetings", (req, res) => {
  const { mentorId } = req.params;
  const sql = `
    SELECT m.*, u.name AS student_name
    FROM meetings m
    LEFT JOIN students s ON m.student_id = s.id
    LEFT JOIN users u ON s.user_id = u.id
    WHERE m.mentor_id = ?
    ORDER BY m.date DESC
  `;
  db.query(sql, [mentorId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Schedule a meeting
router.post("/meetings", (req, res) => {
  const { mentor_id, student_id, date, time, topic } = req.body;
  const sid = student_id === "all" ? null : student_id;

  db.query(
    "INSERT INTO meetings (mentor_id, student_id, date, time, topic, status) VALUES (?,?,?,?,?,'Scheduled')",
    [mentor_id, sid, date, time, topic],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({
        message: "Meeting scheduled",
        meeting: { id: result.insertId, mentor_id, student_id, date, time, topic, status: "Scheduled" }
      });
    }
  );
});

// ✅ Save mentor feedback
router.post("/feedback", (req, res) => {
  const { mentor_id, student_id, message } = req.body;
  db.query(
    "INSERT INTO mentor_feedback (mentor_id, student_id, message) VALUES (?,?,?)",
    [mentor_id, student_id, message],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Feedback saved successfully" });
    }
  );
});

// ✅ Get student feedbacks given to this mentor
router.get("/:mentorId/student-feedbacks", (req, res) => {
  const { mentorId } = req.params;
  const sql = `
    SELECT mf.id, u.name AS student_name, mf.message
    FROM mentor_feedback mf
    JOIN students s ON mf.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE mf.mentor_id = ?
    ORDER BY mf.id DESC
  `;
  db.query(sql, [mentorId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get parent contacts for mentor's mentees
router.get("/:mentorId/parents", (req, res) => {
  const { mentorId } = req.params;
  const sql = `
    SELECT 
      ps.id,
      su.name AS student_name,
      pu.name AS parent_name,
      pu.phone
    FROM mentor_student ms
    JOIN students s ON ms.student_id = s.id
    JOIN users su ON s.user_id = su.id
    JOIN parent_student pst ON pst.student_id = s.id
    JOIN users pu ON pst.parent_user_id = pu.id
    LEFT JOIN parent_student ps ON ps.student_id = s.id
    WHERE ms.mentor_id = ?
  `;
  db.query(sql, [mentorId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;