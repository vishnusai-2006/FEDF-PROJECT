const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const fs = require('fs')
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')

// Database setup
const db = new sqlite3.Database("database.sqlite", (err) => {
  if (err) {
    console.error("DB error:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create tables if not exist
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

  // Insert sample data if tables are empty
  db.get("SELECT COUNT(*) as count FROM students", (err, row) => {
    if (row.count === 0) {
      const sampleStudents = [
        { name: "John Doe", email: "john@gmail.com", password: "password123" },
        { name: "Jane Smith", email: "jane@gmail.com", password: "password123" },
        { name: "Admin User", email: "admin@gmail.com", password: "admin123" },
        { name: "Test Student", email: "test@gmail.com", password: "test123" },
        { name: "Vishnu Sai Konchada", email: "vishnusaikonchada@gmail.com", password: "Google!2006" }
      ];

      sampleStudents.forEach(student => {
        db.run("INSERT INTO students (name, email, password) VALUES (?, ?, ?)", 
               [student.name, student.email, student.password]);
      });
    }
  });

  db.get("SELECT COUNT(*) as count FROM activities", (err, row) => {
    if (row.count === 0) {
      const sampleActivities = [
        { name: "Basketball Tournament", type: "Sports", subcategory: "Team Sports", date: "2025-09-30" },
        { name: "Science Fair", type: "Academic", subcategory: "Science", date: "2025-10-15" },
        { name: "Music Concert", type: "Cultural", subcategory: "Music", date: "2025-10-20" }
      ];

      sampleActivities.forEach(activity => {
        db.run("INSERT INTO activities (name, type, subcategory, date) VALUES (?, ?, ?, ?)", 
               [activity.name, activity.type, activity.subcategory, activity.date]);
      });
    }
  });
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password, userType } = req.body;

  // Check if it's a Gmail address
  if (email.endsWith('@gmail.com')) {
    // Allow any Gmail address with any password
    // Extract name from email for display
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    res.json({ 
      success: true, 
      user: { 
        id: Math.floor(Math.random() * 1000), // Generate random ID
        name: name, 
        email: email, 
        userType: userType 
      } 
    });
  } else {
    res.status(401).json({ message: "Please use a Gmail address" });
  }
});

// Get activities
app.get("/api/activities", (req, res) => {
  db.all("SELECT * FROM activities", (err, rows) => {
    if (err) {
      console.error("Activities error:", err);
      res.status(500).json({ message: "Server error" });
    } else {
      res.json(rows);
    }
  });
});

// Admin API endpoints

// Get all students (admin only)
app.get("/api/admin/students", (req, res) => {
  db.all("SELECT id, name, email FROM students", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
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
  
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
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
  
  db.all(query, [activityId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create new activity (admin only)
app.post("/api/admin/activities", (req, res) => {
  const { name, type, subcategory, date } = req.body;
  
  const query = "INSERT INTO activities (name, type, subcategory, date) VALUES (?, ?, ?, ?)";
  
  db.run(query, [name, type, subcategory, date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ 
      id: this.lastID,
      name,
      type,
      subcategory,
      date
    });
  });
});

// Record student participation in activity (admin only)
app.post("/api/admin/participation", (req, res) => {
  const { studentId, activityId } = req.body;
  
  // Check if participation already exists
  db.get("SELECT id FROM participation WHERE studentId = ? AND activityId = ?", 
    [studentId, activityId], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) return res.status(400).json({ error: "Student already participating in this activity" });
      
      // Add participation
      db.run("INSERT INTO participation (studentId, activityId) VALUES (?, ?)", 
        [studentId, activityId], function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ 
            id: this.lastID,
            studentId,
            activityId,
            message: "Participation recorded successfully"
          });
        }
      );
    }
  );
});

// Remove student participation (admin only)
app.delete("/api/admin/participation/:participationId", (req, res) => {
  const participationId = req.params.participationId;
  
  db.run("DELETE FROM participation WHERE id = ?", [participationId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Participation removed successfully" });
  });
});

// Get dashboard statistics (admin only)
app.get("/api/admin/stats", (req, res) => {
  const queries = [
    "SELECT COUNT(*) as totalStudents FROM students",
    "SELECT COUNT(*) as totalActivities FROM activities", 
    "SELECT COUNT(*) as totalParticipations FROM participation"
  ];
  
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