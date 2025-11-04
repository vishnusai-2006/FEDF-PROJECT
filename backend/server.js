const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')

// Database: try SQLite, otherwise use an in-memory demo store (avoids native-binary failures on hosts)
let db = null
let usingSqlite = false
const inMemory = {
  students: [
    { id: 1, name: "John Doe", email: "john@gmail.com", password: "password123" },
    { id: 2, name: "Jane Smith", email: "jane@gmail.com", password: "password123" },
    { id: 3, name: "Admin User", email: "admin@gmail.com", password: "admin123" },
    { id: 4, name: "Test Student", email: "test@gmail.com", password: "test123" },
    { id: 5, name: "Vishnu Sai Konchada", email: "vishnusaikonchada@gmail.com", password: "Google!2006" }
  ],
  activities: [
    { id: 1, name: "Music Concert", type: "Cultural", subcategory: "Music", date: "2025-10-20" },
    { id: 2, name: "Basketball Tournament", type: "Sports", subcategory: "Team Sports", date: "2025-09-30" },
    { id: 3, name: "Science Fair", type: "Academic", subcategory: "Science", date: "2025-10-15" }
  ],
  participation: []
}

try {
  const sqlite3 = require("sqlite3").verbose();
  db = new sqlite3.Database("database.sqlite", (err) => {
    if (err) {
      console.error("DB error:", err);
      db = null
    } else {
      usingSqlite = true
      console.log("Connected to SQLite database.");
    }
  });
} catch (err) {
  console.warn("SQLite not available; using in-memory store for demo. To persist data in production, use a managed DB.", err && err.message)
}

if (usingSqlite && db) {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      subcategory TEXT,
      date TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS participation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER,
      activityId INTEGER,
      FOREIGN KEY(studentId) REFERENCES students(id),
      FOREIGN KEY(activityId) REFERENCES activities(id)
    )`);

    db.get("SELECT COUNT(*) as count FROM students", (err, row) => {
      if (!err && row && row.count === 0) {
        const sampleStudents = inMemory.students
        sampleStudents.forEach(student => {
          db.run("INSERT INTO students (name, email, password) VALUES (?, ?, ?)", [student.name, student.email, student.password]);
        });
      }
    });

    db.get("SELECT COUNT(*) as count FROM activities", (err, row) => {
      if (!err && row && row.count === 0) {
        const sampleActivities = inMemory.activities
        sampleActivities.forEach(activity => {
          db.run("INSERT INTO activities (name, type, subcategory, date) VALUES (?, ?, ?, ?)", [activity.name, activity.type, activity.subcategory, activity.date]);
        });
      }
    });
  });
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password, userType } = req.body;

  // Normalize and validate the email (trim + lowercase) to avoid false negatives from casing or spaces
  const normalizedEmail = String(email || '').trim().toLowerCase();

  // Check if it's a Gmail address
  if (normalizedEmail.endsWith('@gmail.com')) {
    // Allow any Gmail address with any password in this demo server
    // Extract name from email for display (capitalize words)
    const localPart = normalizedEmail.split('@')[0] || 'User';
    const name = localPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    res.json({ 
      success: true, 
      user: { 
        id: Math.floor(Math.random() * 1000), // Generate random ID
        name: name, 
        email: normalizedEmail, 
        userType: userType 
      } 
    });
  } else {
    res.status(401).json({ message: "Please use a Gmail address" });
  }
});

// Get activities
app.get("/api/activities", (req, res) => {
  if (usingSqlite && db) {
    db.all("SELECT * FROM activities", (err, rows) => {
      if (err) {
        console.error("Activities error:", err);
        res.status(500).json({ message: "Server error" });
      } else {
        res.json(rows);
      }
    });
  } else {
    res.json(inMemory.activities);
  }
});

// Admin API endpoints

// Get all students (admin only)
app.get("/api/admin/students", (req, res) => {
  if (usingSqlite && db) {
    db.all("SELECT id, name, email FROM students", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    res.json(inMemory.students.map(s => ({ id: s.id, name: s.name, email: s.email })));
  }
});

// Get all activities with participation details (admin only)
app.get("/api/admin/activities", (req, res) => {
  const query = `
    SELECT 
      a.id,
      a.name,
      a.type,
      a.subcategory,
      a.date,
      COUNT(p.studentId) as participantCount
    FROM activities a
    LEFT JOIN participation p ON a.id = p.activityId
    GROUP BY a.id, a.name, a.type, a.subcategory, a.date
    ORDER BY a.date DESC
  `;
  
  if (usingSqlite && db) {
    db.all(query, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    // Aggregate participant counts from inMemory.participation
    const activities = inMemory.activities.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      subcategory: a.subcategory,
      date: a.date,
      participantCount: inMemory.participation.filter(p => p.activityId === a.id).length
    })).sort((a,b)=> (a.date < b.date ? 1 : -1));
    res.json(activities);
  }
});

// Get participation details for a specific activity (admin only)
app.get("/api/admin/activity/:id/participants", (req, res) => {
  const activityId = req.params.id;
  const query = `
    SELECT 
      s.id,
      s.name,
      s.email,
      p.id as participationId
    FROM students s
    JOIN participation p ON s.id = p.studentId
    WHERE p.activityId = ?
    ORDER BY s.name
  `;
  
  if (usingSqlite && db) {
    db.all(query, [activityId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    const participants = inMemory.participation
      .filter(p => String(p.activityId) === String(activityId))
      .map(p => {
        const s = inMemory.students.find(x => x.id === p.studentId) || {};
        return { id: s.id, name: s.name, email: s.email, participationId: p.id };
      });
    res.json(participants);
  }
});

// Create new activity (admin only)
app.post("/api/admin/activities", (req, res) => {
  const { name, type, subcategory, date } = req.body;
  
  const query = "INSERT INTO activities (name, type, subcategory, date) VALUES (?, ?, ?, ?)";
  if (usingSqlite && db) {
    db.run(query, [name, type, subcategory, date], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, type, subcategory, date });
    });
  } else {
    const newId = inMemory.activities.length ? Math.max(...inMemory.activities.map(a=>a.id)) + 1 : 1;
    const activity = { id: newId, name, type, subcategory, date };
    inMemory.activities.push(activity);
    res.json(activity);
  }
});

// Record student participation in activity (admin only)
app.post("/api/admin/participation", (req, res) => {
  const { studentId, activityId } = req.body;
  
  // Check if participation already exists
  if (usingSqlite && db) {
    db.get("SELECT id FROM participation WHERE studentId = ? AND activityId = ?", [studentId, activityId], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) return res.status(400).json({ error: "Student already participating in this activity" });
      db.run("INSERT INTO participation (studentId, activityId) VALUES (?, ?)", [studentId, activityId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, studentId, activityId, message: "Participation recorded successfully" });
      });
    });
  } else {
    const exists = inMemory.participation.find(p => p.studentId === studentId && p.activityId === activityId);
    if (exists) return res.status(400).json({ error: "Student already participating in this activity" });
    const newId = inMemory.participation.length ? Math.max(...inMemory.participation.map(p=>p.id)) + 1 : 1;
    const record = { id: newId, studentId, activityId };
    inMemory.participation.push(record);
    res.json({ id: record.id, studentId, activityId, message: "Participation recorded successfully" });
  }
});

// Remove student participation (admin only)
app.delete("/api/admin/participation/:participationId", (req, res) => {
  const participationId = req.params.participationId;
  if (usingSqlite && db) {
    db.run("DELETE FROM participation WHERE id = ?", [participationId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Participation removed successfully" });
    });
  } else {
    const idx = inMemory.participation.findIndex(p => String(p.id) === String(participationId));
    if (idx === -1) return res.status(404).json({ error: "Participation not found" });
    inMemory.participation.splice(idx, 1);
    res.json({ message: "Participation removed successfully" });
  }
});

// Get dashboard statistics (admin only)
app.get("/api/admin/stats", (req, res) => {
  const queries = [
    "SELECT COUNT(*) as totalStudents FROM students",
    "SELECT COUNT(*) as totalActivities FROM activities", 
    "SELECT COUNT(*) as totalParticipations FROM participation"
  ];
  if (usingSqlite && db) {
    Promise.all(queries.map(query => 
      new Promise((resolve, reject) => {
        db.get(query, [], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      })
    )).then(results => {
      res.json({
        totalStudents: results[0].totalStudents,
        totalActivities: results[1].totalActivities,
        totalParticipations: results[2].totalParticipations
      });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
  } else {
    res.json({
      totalStudents: inMemory.students.length,
      totalActivities: inMemory.activities.length,
      totalParticipations: inMemory.participation.length
    });
  }
});

// If frontend has been built into ../frontend/dist, serve it as static files
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))

  // Serve index.html for any non-API route (for SPA routing)
  app.get(/.*/, (req, res, next) => {
    // Ensure API routes are not intercepted
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});