const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ Get teacher's assigned subjects with class info
router.get("/:teacherId/subjects", (req, res) => {
  const { teacherId } = req.params;
  const sql = `
    SELECT ts.id, s.id AS subject_id, s.name AS subject, s.department,
           t.id AS teacher_record_id, t.subject AS class_info
    FROM teacher_subjects ts
    JOIN subjects s ON ts.subject_id = s.id
    JOIN teachers t ON ts.teacher_id = t.id
    WHERE t.user_id = ?
  `;
  db.query(sql, [teacherId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get students for a subject (based on class/section from students table)
router.get("/:teacherId/students/:subjectId", (req, res) => {
  const { teacherId, subjectId } = req.params;
  const sql = `
    SELECT s.id, u.name, s.roll_no, s.class, s.section
    FROM students s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.roll_no
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// ✅ Get teacher stats
router.get("/:teacherId/stats", (req, res) => {
  const { teacherId } = req.params;

  db.query("SELECT COUNT(*) AS total FROM students", (err, students) => {
    const studentCount = err ? 0 : students[0].total;

    db.query(
      `SELECT COUNT(*) AS total FROM teacher_subjects ts
       JOIN teachers t ON ts.teacher_id = t.id WHERE t.user_id = ?`,
      [teacherId],
      (err, subjects) => {
        const subjectCount = err ? 0 : subjects[0].total;

        db.query(
          `SELECT COUNT(*) AS total FROM marks m
           JOIN teachers t ON t.user_id = ?
           WHERE 1=1`,
          [teacherId],
          (err, marks) => {
            const marksCount = err ? 0 : marks[0].total;

            db.query(
              `SELECT COUNT(*) AS total FROM feedback WHERE from_user_id = ?`,
              [teacherId],
              (err, feedback) => {
                const feedbackCount = err ? 0 : feedback[0].total;

                res.json({
                  students: studentCount,
                  subjects: subjectCount,
                  marksEntered: marksCount,
                  feedbackGiven: feedbackCount
                });
              }
            );
          }
        );
      }
    );
  });
});

// ✅ Mark attendance
router.post("/attendance", (req, res) => {
  const { records, date } = req.body;
  // records = [{ student_id, status }]

  if (!records || records.length === 0) {
    return res.status(400).json({ message: "No records provided" });
  }

  // Delete existing attendance for this date first (to avoid duplicates)
  const studentIds = records.map(r => r.student_id);
  db.query(
    `DELETE FROM attendance WHERE date = ? AND student_id IN (?)`,
    [date, studentIds],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });

      // Insert new records
      const values = records.map(r => [r.student_id, date, r.status]);
      db.query(
        "INSERT INTO attendance (student_id, date, status) VALUES ?",
        [values],
        (err) => {
          if (err) return res.status(500).json({ message: err.message });
          res.json({ message: "Attendance saved successfully" });
        }
      );
    }
  );
});

// ✅ Get attendance for a date
router.get("/attendance/:date", (req, res) => {
  const { date } = req.params;
  db.query(
    `SELECT a.student_id, a.status, u.name, s.roll_no
     FROM attendance a
     JOIN students s ON a.student_id = s.id
     JOIN users u ON s.user_id = u.id
     WHERE a.date = ?`,
    [date],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
});

// ✅ Add marks
router.post("/marks", (req, res) => {
  const { student_id, subject, exam_type, marks, max_marks } = req.body;

  if (!student_id || !subject || !exam_type || !marks || !max_marks) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "INSERT INTO marks (student_id, subject, exam_type, marks, max_marks) VALUES (?,?,?,?,?)",
    [student_id, subject, exam_type, marks, max_marks],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Marks added successfully" });
    }
  );
});

// ✅ Give feedback to student (visible to student, mentor, parent)
router.post("/feedback", (req, res) => {
  const { from_user_id, student_id, message } = req.body;

  if (!from_user_id || !student_id || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "INSERT INTO feedback (from_user_id, student_id, from_role, message) VALUES (?,?,'teacher',?)",
    [from_user_id, student_id, message],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Feedback submitted successfully" });
    }
  );
});

// ✅ Get feedback given by teacher
router.get("/:teacherId/feedback", (req, res) => {
  const { teacherId } = req.params;
  const sql = `
    SELECT f.id, f.message, f.created_at, u.name AS student_name
    FROM feedback f
    JOIN students s ON f.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE f.from_user_id = ?
    ORDER BY f.created_at DESC
  `;
  db.query(sql, [teacherId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

module.exports = router;