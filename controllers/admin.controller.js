const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ─── Helpers ──────────────────────────────────────────────────────────────────

// "Riya D'Silva" → "riya.dsilva"
function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .join(".");
}

// Emails
function studentEmail(name, roll_no) {
  const first = name.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/)[0];
  return `${first}.${roll_no}@mentra.edu`;
}

function staffEmail(name) {
  return `${nameToSlug(name)}@mentra.edu`;
}

// ✅ Passwords
function studentRawPassword(name, roll_no) {
  const first = name.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/)[0];
  return `${first}@${roll_no}`;                  // e.g. riya@2305841
}

function staffRawPassword(name) {
  return `${nameToSlug(name)}@mentra`;            // e.g. john.pereira@mentra
}

function parentRawPassword(roll_no) {
  return `parent@${roll_no}`;                     // e.g. parent@2305841
}

// ─── Add Student ─────────────────────────────────────────────────────────────
exports.addStudent = async (req, res) => {
  const { name, roll_no, className, section, parentName, parentPhone } = req.body;

  try {
    const email      = studentEmail(name, roll_no);
    const rawPassword = studentRawPassword(name, roll_no);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 1️⃣ Create student user
    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, "student"],
      (err, userResult) => {
        if (err) return res.status(500).json({ message: err.message || "Database error" });

        const studentUserId = userResult.insertId;

        // 2️⃣ Insert student profile
        db.query(
          "INSERT INTO students (user_id, roll_no, class, section) VALUES (?,?,?,?)",
          [studentUserId, roll_no, className, section],
          (err, studentResult) => {
            if (err) return res.status(500).json({ message: err.message || "Database error" });

            const studentId = studentResult.insertId;

            // 3️⃣ Create parent user
            const parentEmail    = `parent.${roll_no}@mentra.edu`;
            const rawParentPass  = parentRawPassword(roll_no);

            bcrypt.hash(rawParentPass, 10).then((parentHash) => {
              db.query(
                "INSERT INTO users (name, email, password, role, phone) VALUES (?,?,?,?,?)",
                [parentName, parentEmail, parentHash, "parent", parentPhone || null],
                (err, parentResult) => {
                  if (err) return res.status(500).json({ message: err.message || "Database error" });

                  // 4️⃣ Link parent ↔ student
                  db.query(
                    "INSERT INTO parent_student (parent_user_id, student_id) VALUES (?,?)",
                    [parentResult.insertId, studentId],
                    (err) => {
                      if (err) return res.status(500).json({ message: err.message || "Database error" });

                      res.json({
                        message: "Student added successfully",
                        studentLogin: { email, password: rawPassword },
                        parentLogin:  { email: parentEmail, password: rawParentPass }
                      });
                    }
                  );
                }
              );
            });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ─── Add Teacher ─────────────────────────────────────────────────────────────
exports.addTeacher = async (req, res) => {
  const { name, subjects } = req.body;

  try {
    const email       = staffEmail(name);
    const rawPassword = staffRawPassword(name);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, "teacher"],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message || "Database error" });

        res.json({
          message: "Teacher added successfully",
          teacherLogin: { email, password: rawPassword },
          teacher: { id: result.insertId, name, email, subjects }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ─── Add Mentor ──────────────────────────────────────────────────────────────
exports.addMentor = async (req, res) => {
  const { name } = req.body;

  try {
    const email       = staffEmail(name);
    const rawPassword = staffRawPassword(name);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, "mentor"],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message || "Database error" });

        res.json({
          message: "Mentor added successfully",
          mentorLogin: { email, password: rawPassword },
          mentor: { id: result.insertId, name, email }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};