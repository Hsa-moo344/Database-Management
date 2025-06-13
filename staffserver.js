const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
// app.use(cors({ origin: "http://localhost:3000" }));  // allow frontend
// app.use(express.json());  // parse JSON body

// Allow requests from your frontend's origin
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL Connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "hsamoomoo",
  password: "123456",
  database: "timesheet",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database!");
    connection.release();
  }
});

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

function formatDate(input) {
  if (!input) return null;
  const date = new Date(input);
  return date.toISOString().slice(0, 10);
}

//  Attendance form insert
app.post("/attendancefunction", (req, res) => {
  const {
    name,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    approvedBy,
  } = req.body;

  const sql = `
    INSERT INTO tbl_attendance (
      name, gender, position, department, email, type, date,
      timeIn, timeOut, workingHours,
      startLeaveDay, endLeaveDay, totalLeaveDaysThisMonth, approvedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [
      name,
      gender,
      position,
      department,
      email || null,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours || null,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth || null,
      approvedBy,
    ],
    (err, results) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res.status(200).json({
        message: "Insert successful",
        id: results.insertId,
      });
    }
  );
});

// PUT - Update Attendance
app.put("/attendancefunction/:id", (req, res) => {
  const id = req.params.id;
  const {
    name,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    approvedBy,
  } = req.body;

  const sql = `
    UPDATE tbl_attendance SET
      name=?, gender=?, position=?, department=?, email=?, type=?, date=?,
      timeIn=?, timeOut=?, workingHours=?, startLeaveDay=?, endLeaveDay=?,
      totalLeaveDaysThisMonth=?, approvedBy=?
    WHERE id=?
  `;

  pool.query(
    sql,
    [
      name,
      gender,
      position,
      department,
      email,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth,
      approvedBy,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Update error:", err.message);
        return res.status(500).json({ error: "Update failed" });
      }
      res.status(200).json({ message: "Attendance updated successfully" });
    }
  );
});

// DELETE - Attendance
app.delete("/attendancefunction/:id", (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM tbl_attendance WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Delete error:", err.message);
      return res.status(500).json({ error: "Delete failed" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  });
});

// GET - All Attendance
app.get("/attendancefunction", (req, res) => {
  pool.query("SELECT * FROM tbl_attendance", (err, result) => {
    if (err) {
      console.error("Fetch error:", err.message);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.status(200).json(result);
  });
});

// Download Attendance PDF
app.get("/api/attendancefunction", (req, res) => {
  const query = `
    SELECT 
      name,
      gender,
      position,
      department,
      email,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth,
      approvedBy,
      id
    FROM attendance`;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching attendance data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
});

// POST - Insert Individual Timesheet
app.post("/individualfunction", (req, res) => {
  const {
    name,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    activities,
    approvedBy,
  } = req.body;

  const sql = `
    INSERT INTO tbl_individual (
      name, gender, position, department, email, type, date,
      timeIn, timeOut, workingHours,
      startLeaveDay, endLeaveDay, totalLeaveDaysThisMonth, activities, approvedBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [
      name,
      gender,
      position,
      department,
      email || null,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours || null,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth || null,
      activities || null,
      approvedBy,
    ],
    (err, results) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res
        .status(200)
        .json({ message: "Insert successful", id: results.insertId });
    }
  );
});

// PUT - Update individual
app.put("/individualfunction/:id", (req, res) => {
  const id = req.params.id;
  const {
    name,
    gender,
    position,
    department,
    email,
    type,
    date,
    timeIn,
    timeOut,
    workingHours,
    startLeaveDay,
    endLeaveDay,
    totalLeaveDaysThisMonth,
    approvedBy,
  } = req.body;

  const sql = `
    UPDATE tbl_individual SET
      name=?, gender=?, position=?, department=?, email=?, type=?, date=?,
      timeIn=?, timeOut=?, workingHours=?, startLeaveDay=?, endLeaveDay=?,
      totalLeaveDaysThisMonth=?, approvedBy=?
    WHERE id=?
  `;

  pool.query(
    sql,
    [
      name,
      gender,
      position,
      department,
      email,
      type,
      formatDate(date),
      timeIn,
      timeOut,
      workingHours,
      formatDate(startLeaveDay),
      formatDate(endLeaveDay),
      totalLeaveDaysThisMonth,
      approvedBy,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Update error:", err.message);
        return res.status(500).json({ error: "Update failed" });
      }
      res.status(200).json({ message: "Attendance updated successfully" });
    }
  );
});

// DELETE - individual
app.delete("/individualfunction/:id", (req, res) => {
  const id = req.params.id;
  pool.query("DELETE FROM tbl_individual WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Delete error:", err.message);
      return res.status(500).json({ error: "Delete failed" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  });
});

// GET - All individual
app.get("/individualfunction", (req, res) => {
  pool.query("SELECT * FROM tbl_individual", (err, result) => {
    if (err) {
      console.error("Fetch error:", err.message);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.status(200).json(result);
  });
});

// Staff Profile Insert with Image Upload
app.post("/staffdatabasefunction", upload.single("image"), (req, res) => {
  const { name, gender, position, departments, joinDate, staffCode, tags } =
    req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;

  const sql = `
    INSERT INTO tbl_staffprofile 
    (name, gender, position, image, departments, joinDate, staffCode, tags) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [name, gender, position, image, departments, joinDate, staffCode, tags],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err.message);
        return res.status(500).send("Failed to insert staff.");
      }
      res.status(200).send("Staff added successfully!");
    }
  );
});

//  Staff Profile Fetch
app.get("/api/staffdatabasefunction", (req, res) => {
  const sql = "SELECT * FROM tbl_staffprofile";

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Fetch error:", err.message);
      return res.status(500).send("Failed to fetch staff.");
    }

    const parsedResult = result.map((staff) => ({
      ...staff,
      tags:
        typeof staff.tags === "string" ? JSON.parse(staff.tags) : staff.tags,
    }));

    res.status(200).json(parsedResult);
  });
});

//  Update Staff Profile
app.put("/staffdatabasefunction/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, gender, position, departments, joinDate, staffCode, tags } =
    req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;

  if (!image) {
    pool.query(
      "SELECT image FROM tbl_staffprofile WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Fetch error:", err.message);
          return res.status(500).send("Failed to fetch existing image.");
        }
        const existingImage = results[0]?.image || null;

        const sql = `
          UPDATE tbl_staffprofile 
          SET name = ?, gender = ?, position = ?, image = ?, departments = ?, joinDate = ?, staffCode = ?, tags = ?
          WHERE id = ?
        `;

        pool.query(
          sql,
          [
            name,
            gender,
            position,
            existingImage,
            departments,
            joinDate,
            staffCode,
            tags,
            id,
          ],
          (err, result) => {
            if (err) {
              console.error("Update error:", err.message);
              return res.status(500).send("Failed to update staff.");
            }
            res.status(200).send("Staff updated successfully!");
          }
        );
      }
    );
  } else {
    const sql = `
      UPDATE tbl_staffprofile 
      SET name = ?, gender = ?, position = ?, image = ?, departments = ?, joinDate = ?, staffCode = ?, tags = ?
      WHERE id = ?
    `;

    pool.query(
      sql,
      [
        name,
        gender,
        position,
        image,
        departments,
        joinDate,
        staffCode,
        tags,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Update error:", err.message);
          return res.status(500).send("Failed to update staff.");
        }
        res.status(200).send("Staff updated successfully!");
      }
    );
  }
});

// Delete staff profile
app.delete("/staffdatabasefunction/:id", (req, res) => {
  const staffId = req.params.id;

  const deleteQuery = "DELETE FROM tbl_staffprofile WHERE id = ?";

  pool.query(deleteQuery, [staffId], (err, result) => {
    if (err) {
      console.error("Error deleting staff:", err);
      return res.status(500).json({ error: "Failed to delete staff" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.json({ message: "Staff deleted successfully" });
  });
});

// Create Payroll Record
app.post("/payrollfunction", (req, res) => {
  const {
    staffCode,
    fullName,
    banding,
    salaryYear,
    payMonth,
    workingDays,
    leaveDays,
    totalHours,
    hourlyRate,
    grossSalary,
    deductions,
    netSalary,
    paymentStatus,
  } = req.body;

  const sql = `
    INSERT INTO tbl_payroll 
    (staffCode, fullName, banding, salaryYear, payMonth, workingDays, leaveDays, totalHours, hourlyRate, grossSalary, deductions, netSalary, paymentStatus) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    staffCode,
    fullName,
    banding,
    salaryYear,
    payMonth,
    workingDays,
    leaveDays,
    totalHours,
    hourlyRate,
    grossSalary,
    deductions || 0, // make sure deductions is not empty string
    netSalary,
    paymentStatus || "Unpaid",
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).send("Error inserting payroll");
    }
    res.send("Payroll inserted successfully");
  });
});

// Get All Payroll Records
app.get("/payrollfunction", (req, res) => {
  pool.query("SELECT * FROM tbl_payroll", (err, results) => {
    if (err) {
      console.error("Select error:", err);
      return res.status(500).send("Error fetching payrolls");
    }
    res.json(results);
  });
});

// Update Payroll by ID
app.put("/payrollfunction/:id", (req, res) => {
  const payrollId = req.params.id;
  const updatedData = req.body;

  delete updatedData.createdAt; // prevent updating createdAt if it's autogenerated

  const {
    staffCode,
    fullName,
    banding,
    salaryYear,
    payMonth,
    workingDays,
    leaveDays,
    totalHours,
    hourlyRate,
    grossSalary,
    deductions,
    netSalary,
    paymentStatus,
  } = updatedData;

  const sql = `
    UPDATE tbl_payroll SET
      staffCode = ?,
      fullName = ?,
      banding = ?,
      salaryYear = ?,
      payMonth = ?,
      workingDays = ?,
      leaveDays = ?,
      totalHours = ?,
      hourlyRate = ?,
      grossSalary = ?,
      deductions = ?,
      netSalary = ?,
      paymentStatus = ?
    WHERE id = ?
  `;

  const values = [
    staffCode,
    fullName,
    banding,
    salaryYear,
    payMonth,
    workingDays,
    leaveDays,
    totalHours,
    hourlyRate,
    grossSalary,
    deductions,
    netSalary,
    paymentStatus,
    payrollId,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).send("Error updating payroll");
    }
    res.send("Payroll updated successfully");
  });
});

// Delete payroll
app.delete("/payrollfunction/:id", (req, res) => {
  pool.query("DELETE FROM tbl_payroll WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).send("Error deleting");
    }
    res.send("Deleted");
  });
});

// Download Payroll PDF
app.get("/api/payrollfunction", (req, res) => {
  const query = `
    SELECT 
      staffCode,
      fullName,
      banding,
      salaryYear,
      payMonth,
      workingDays,
      leaveDays,
      totalHours,
      hourlyRate,
      grossSalary,
      deductions,
      netSalary,
      paymentStatus
    FROM payroll`;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching payroll data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
});

//  Start Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
