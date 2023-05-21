// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

// Create an Express app
const app = express();
const port = 3001;

// Create a MySQL database connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "ams_db",
  timezone: "ist",
});

// Attempt to catch disconnects from the database
db.on("connection", (connection) => {
  console.log("DB Connection established");

  // Handle MySQL connection errors
  connection.on("error", (err) =>
    console.error(new Date(), " MySQL error ", err.code)
  );

  // Handle MySQL connection close
  connection.on("close", (err) =>
    console.error(new Date(), " MySQL close ", err)
  );
});

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`\nApp listening to Port: ${port}\n`);
});

// APIS follow:

app.get("/api/initiate", (req, res) => {
  const sqlCreateDB = "CREATE DATABASE IF NOT EXISTS ams_db;";
  db.query(
    sqlCreateDB,
    (e, r) => e && console.log("\nsqlCreateDB: " + e.sqlMessage)
  );

  const sqlUseDB = "USE ams_db;";
  db.query(sqlUseDB, (e, r) => e && console.log("\nsqlUseDB: " + e.sqlMessage));

  const sqlCreateAdminTable =
    "CREATE TABLE IF NOT EXISTS Admin(Password VARCHAR(20) NOT NULL, First_Name VARCHAR(20) NOT NULL, Last_Name VARCHAR(20) NOT NULL, Middle_Name VARCHAR(20) NOT NULL, Admin_ID VARCHAR(30) NOT NULL, Email VARCHAR(30) NOT NULL, Phone_No VARCHAR(10) NOT NULL, PRIMARY KEY (Admin_ID), UNIQUE (Email));";
  db.query(
    sqlCreateAdminTable,
    (e, r) => e && console.log("\nsqlCreateAdminTable: " + e.sqlMessage)
  );

  const sqlCreateTeachingStaffTable =
    "CREATE TABLE IF NOT EXISTS Teaching_Staff(Middle_Name VARCHAR(20) NOT NULL, Last_Name VARCHAR(20) NOT NULL, First_Name VARCHAR(20) NOT NULL, Employee_ID VARCHAR(30) NOT NULL, Password VARCHAR(30) NOT NULL, Email VARCHAR(30) NOT NULL, Phone_No VARCHAR(10) NOT NULL, PRIMARY KEY (Employee_ID), UNIQUE (Email));";
  db.query(
    sqlCreateTeachingStaffTable,
    (e, r) => e && console.log("\nsqlCreateTeachingStaffTable: " + e.sqlMessage)
  );

  const sqlCreateCourseTable =
    "CREATE TABLE IF NOT EXISTS Course ( Course_ID VARCHAR(30) NOT NULL, Name VARCHAR(50) NOT NULL, PRIMARY KEY (Course_ID));";
  db.query(
    sqlCreateCourseTable,
    (e, r) => e && console.log("\nsqlCreateCourseTable: " + e.sqlMessage)
  );

  const sqlCreateTakesTable =
    "CREATE TABLE IF NOT EXISTS Takes(Takes_ID VARCHAR(30) NOT NULL, Employee_ID VARCHAR(30) NOT NULL, Course_ID VARCHAR(30) NOT NULL, PRIMARY KEY (Takes_ID, Employee_ID, Course_ID), FOREIGN KEY (Employee_ID) REFERENCES Teaching_Staff(Employee_ID), FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID));";
  db.query(
    sqlCreateTakesTable,
    (e, r) => e && console.log("\nsqlCreateTakesTable: " + e.sqlMessage)
  );

  const sqlCreateDateTable =
    "CREATE TABLE IF NOT EXISTS Date_Table(Date DATE NOT NULL, PRIMARY KEY (Date));";
  db.query(
    sqlCreateDateTable,
    (e, r) => e && console.log("\nsqlCreateDateTable: " + e.sqlMessage)
  );

  const sqlCreateTeacherAttRecordTable =
    "CREATE TABLE IF NOT EXISTS Teacher_Att_Record(Status VARCHAR(10) NOT NULL, Takes_ID VARCHAR(30) NOT NULL, Date DATE NOT NULL, PRIMARY KEY (Takes_ID, Date), FOREIGN KEY (Takes_ID) REFERENCES Takes(Takes_ID), FOREIGN KEY (Date) REFERENCES Date_Table(Date));";
  db.query(
    sqlCreateTeacherAttRecordTable,
    (e, r) =>
      e && console.log("\nsqlCreateTeacherAttRecordTable: " + e.sqlMessage)
  );

  const sqlCreateCityInStateTable =
    "CREATE TABLE IF NOT EXISTS City_In_State(City VARCHAR(30) NOT NULL, State VARCHAR(30) NOT NULL, PRIMARY KEY (City));";
  db.query(
    sqlCreateCityInStateTable,
    (e, r) => e && console.log("\nsqlCreateCityInStateTable: " + e.sqlMessage)
  );

  const sqlCreateStudentTable =
    "CREATE TABLE IF NOT EXISTS Student(House VARCHAR(30) NOT NULL, First_Name VARCHAR(20) NOT NULL, Middle_Name VARCHAR(20) NOT NULL, Last_Name VARCHAR(20) NOT NULL, Student_ID VARCHAR(30) NOT NULL, Email VARCHAR(30) NOT NULL, Password VARCHAR(30) NOT NULL, Phone_No VARCHAR(10) NOT NULL, City VARCHAR(30) NOT NULL, PRIMARY KEY (Student_ID), FOREIGN KEY (City) REFERENCES City_In_State(City), UNIQUE (Email));";
  db.query(
    sqlCreateStudentTable,
    (e, r) => e && console.log("\nsqlCreateStudentTable: " + e.sqlMessage)
  );

  const sqlCreateEnrollmentTable =
    "CREATE TABLE IF NOT EXISTS Enrollment(Enroll_ID VARCHAR(30) NOT NULL, Student_ID VARCHAR(30) NOT NULL, Course_ID VARCHAR(30) NOT NULL, PRIMARY KEY (Enroll_ID, Student_ID, Course_ID), FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID), FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID));";
  db.query(
    sqlCreateEnrollmentTable,
    (e, r) => e && console.log("\nsqlCreateEnrollmentTable: " + e.sqlMessage)
  );

  const sqlCreatePermissionTable =
    "CREATE TABLE IF NOT EXISTS Permission(Date DATE NOT NULL, Status VARCHAR(20) NOT NULL, Student_ID VARCHAR(30) NOT NULL, Course_ID VARCHAR(30) NOT NULL, PRIMARY KEY (Student_ID, Course_ID, Date), FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID), FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID));";
  db.query(
    sqlCreatePermissionTable,
    (e, r) => e && console.log("\nsqlCreatePermissionTable: " + e.sqlMessage)
  );

  const sqlCreateStudentAttRecordTable =
    "CREATE TABLE IF NOT EXISTS Student_Att_Record(Status VARCHAR(10) NOT NULL, Enroll_ID VARCHAR(30) NOT NULL, Date DATE NOT NULL, PRIMARY KEY (Enroll_ID, Date), FOREIGN KEY (Enroll_ID) REFERENCES Enrollment(Enroll_ID), FOREIGN KEY (Date) REFERENCES Date_Table(Date));";
  db.query(
    sqlCreateStudentAttRecordTable,
    (e, r) =>
      e && console.log("\nsqlCreateStudentAttRecordTable: " + e.sqlMessage)
  );

  const sqlInsertAdmin =
    "INSERT IGNORE INTO Admin (Password, First_Name, Last_Name, Middle_Name, Admin_ID, Email, Phone_No) VALUES ('adminpass1', 'John', 'Doe', 'A.', 'A1', 'johndoe1@admin.com', '1234567890'), ('adminpass2', 'Jane', 'Smith', 'B.', 'A2', 'janesmith2@admin.com', '2345678901'), ('adminpass3', 'Bob', 'Johnson', 'C.', 'A3', 'bobjohnson3@admin.com', '3456789012');";
  db.query(
    sqlInsertAdmin,
    (e, r) => e && console.log("\nsqlInsertAdmin: " + e.sqlMessage)
  );

  const sqlInsertTeachingStaff =
    "INSERT IGNORE INTO Teaching_Staff (Middle_Name, Last_Name, First_Name, Employee_ID, Password, Email, Phone_No) VALUES ('Smith', 'Johnson', 'John', 'T1', 'password1', 'john.t1@example.com', '9876543210'), ('Doe', 'Jane', 'Jane', 'T2', 'password2', 'jane.t2@example.com', '9876543211'), ('Williams', 'David', 'David', 'T3', 'password3', 'david.t3@example.com', '9876543212'), ('Brown', 'Emily', 'Emily', 'T4', 'password4', 'emily.t4@example.com', '9876543213'), ('Jones', 'James', 'James', 'T5', 'password5', 'james.t5@example.com', '9876543214'), ('Taylor', 'Liam', 'Liam', 'T6', 'password6', 'liam.t6@example.com', '9876543215');";
  db.query(
    sqlInsertTeachingStaff,
    (e, r) => e && console.log("\nsqlInsertTeachingStaff: " + e.sqlMessage)
  );

  const sqlInsertCities =
    "INSERT IGNORE INTO City_In_State (City, State) VALUES ('New York', 'New York'), ('Los Angeles', 'California'), ('Chicago', 'Illinois');";
  db.query(
    sqlInsertCities,
    (e, r) => e && console.log("\nsqlInsertCities: " + e.sqlMessage)
  );

  const sqlInsertStudents =
    "INSERT IGNORE INTO Student (House, First_Name, Middle_Name, Last_Name, Student_ID, Email, Password, Phone_No, City) VALUES ('101', 'John', 'A', 'Doe', 'S1', 'john.doe@example.com', 'password', '1234567890', 'New York'), ('203', 'Jane', 'B', 'Doe', 'S2', 'jane.doe@example.com', 'password', '2345678901', 'Los Angeles'), ('305', 'Alice', 'C', 'Smith', 'S3', 'alice.smith@example.com', 'password', '3456789012', 'Chicago'), ('102', 'Bob', 'D', 'Johnson', 'S4', 'bob.johnson@example.com', 'password', '4567890123', 'New York'), ('202', 'Charlie', 'E', 'Lee', 'S5', 'charlie.lee@example.com', 'password', '5678901234', 'Los Angeles'), ('302', 'David', 'F', 'Brown', 'S6', 'david.brown@example.com', 'password', '6789012345', 'Chicago'), ('104', 'Emily', 'G', 'Taylor', 'S7', 'emily.taylor@example.com', 'password', '7890123456', 'New York'), ('201', 'Frank', 'H', 'Wilson', 'S8', 'frank.wilson@example.com', 'password', '8901234567', 'Los Angeles'), ('303', 'George', 'I', 'Martin', 'S9', 'george.martin@example.com', 'password', '9012345678', 'Chicago'), ('106', 'Hannah', 'J', 'Anderson', 'S10', 'hannah.anderson@example.com', 'password', '0123456789', 'New York');";
  db.query(
    sqlInsertStudents,
    (e, r) => e && console.log("\nsqlInsertStudents: " + e.sqlMessage)
  );

  const sqlInsertCourse =
    "INSERT IGNORE INTO Course (Course_ID, Name) VALUES ('C01', 'Introduction to Computer Science'), ('C02', 'Data Structures and Algorithms'), ('C03', 'Database Systems'), ('C04', 'Operating Systems'), ('C05', 'Artificial Intelligence'), ('C06', 'Computer Networks'), ('C07', 'Web Development'), ('C08', 'Computer Graphics');";
  db.query(
    sqlInsertCourse,
    (e, r) => e && console.log("\nsqlInsertCourse: " + e.sqlMessage)
  );

  const sqlInsertTakes =
    "INSERT IGNORE INTO Takes (Takes_ID, Employee_ID, Course_ID) VALUES ('Ta1', 'T1', 'C01'), ('Ta2','T1', 'C02'), ('Ta3','T2', 'C03'), ('Ta4', 'T2', 'C04'), ('Ta5','T3', 'C05'), ('Ta6', 'T4', 'C06'), ('Ta7','T7', 'C07'), ('Ta8','T6', 'C08');";
  db.query(
    sqlInsertTakes,
    (e, r) => e && console.log("\nsqlInsertTakes: " + e.sqlMessage)
  );

  const sqlInsertDateTable =
    "INSERT IGNORE INTO Date_Table (Date) VALUES ('2023-04-04'), ('2023-04-05'), ('2023-04-06'), ('2023-04-07'), ('2023-04-08'), ('2023-04-09'), ('2023-04-10');";
  db.query(
    sqlInsertDateTable,
    (e, r) => e && console.log("\nsqlInsertDateTable: " + e.sqlMessage)
  );

  const sqlInsertEnrollment =
    "INSERT IGNORE INTO Enrollment (Enroll_ID, Student_ID, Course_ID) VALUES ('E01', 'S1', 'C01'), ('E02', 'S2', 'C01'), ('E03', 'S3', 'C02'), ('E04', 'S4', 'C02'), ('E05', 'S5', 'C03'), ('E06', 'S6',  'C04'), ('E07', 'S7', 'C05'), ('E08', 'S8', 'C06'), ('E09', 'S9', 'C07'), ('E10', 'S10', 'C08');";
  db.query(
    sqlInsertEnrollment,
    (e, r) => e && console.log("\nsqlInsertEnrollment: " + e.sqlMessage)
  );

  const sqlInsertPermission = `INSERT IGNORE INTO Permission (Student_ID, Course_ID, Date, Status) SELECT e.Student_ID, e.Course_ID, sar.Date, CASE WHEN sar.Status = "ABSENTWP" THEN "ACCEPTED" WHEN sar.Status = "ABSENTWOP" THEN "REJECTED" END AS Status FROM Enrollment e JOIN Student_Att_Record sar ON e.Enroll_ID = sar.Enroll_ID WHERE sar.Status IN ("ABSENTWP", "ABSENTWOP");`;
  db.query(
    sqlInsertPermission,
    (e, r) => e && console.log("\nsqlInsertPermission: " + e.sqlMessage)
  );

  const sqlInsertStudentAttendanceRecord =
    "INSERT IGNORE INTO Student_Att_Record (Enroll_ID, Date, Status) SELECT e.Enroll_ID, dt.Date, CASE WHEN RAND() < 0.75 THEN 'PRESENT' WHEN RAND() < 0.875 THEN 'ABSENTWP' ELSE 'ABSENTWOP' END AS Status FROM Date_Table dt CROSS JOIN Enrollment e ORDER BY dt.Date, e.Enroll_ID;";
  db.query(
    sqlInsertStudentAttendanceRecord,
    (e, r) =>
      e && console.log("\nsqlInsertStudentAttendanceRecord: " + e.sqlMessage)
  );

  const sqlInsertTeachingStaffAttendanceRecord =
    "INSERT IGNORE INTO Teacher_Att_Record (Takes_ID, Date, Status) SELECT t.Takes_ID, dt.Date, CASE WHEN RAND() < 0.85 THEN 'PRESENT' ELSE 'ABSENT' END AS Status FROM Date_Table dt CROSS JOIN Takes t ORDER BY dt.Date, t.Takes_ID;";
  db.query(
    sqlInsertTeachingStaffAttendanceRecord,
    (e, r) =>
      e &&
      console.log("\nsqlInsertTeachingStaffAttendanceRecord: " + e.sqlMessage)
  );
});

app.post("/api/login", (req, res) => {
  const MAIL = req.body.email;
  const PASS = req.body.password;
  const TYPE = req.body.type;

  let tableName = "";

  switch (TYPE) {
    case "admin":
      tableName = "Admin";
      break;

    case "student":
      tableName = "Student";
      break;

    case "teacher":
      tableName = "Teaching_Staff";
      break;
  }

  const sqlSelect = `SELECT * FROM ${tableName} WHERE Email = ? AND Password = ?;`;

  db.query(sqlSelect, [MAIL, PASS], (err, result) => {
    if (result?.length) res.send(result[0]);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getAttendance", (req, res) => {
  const ID = req.query.id;

  const sqlSelect =
    "SELECT E.Course_ID, C.Name , S.Date, S.Status FROM student_att_record S JOIN Enrollment E on S.Enroll_ID = E.Enroll_ID JOIN Course C on E.Course_ID = C.Course_ID WHERE E.Student_ID = ? AND S.Date BETWEEN  DATE_ADD(current_date(), INTERVAL -7 DAY) AND CURRENT_DATE() ORDER BY E.Course_ID;";

  db.query(sqlSelect, [ID], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getStudentProfile", (req, res) => {
  const ID = req.query.id;

  const sqlSelect1 =
    "SELECT cin.State FROM City_In_State cin JOIN Student s ON cin.City = s.City WHERE s.Student_ID = ?;";
  db.query(sqlSelect1, [ID], (err1, result1) => {
    if (result1?.length) {
      const sqlSelect2 = "SELECT * FROM Student WHERE Student_ID = ?;";
      db.query(sqlSelect2, [ID], (err2, result2) => {
        if (result2?.length) res.send([result1[0], result2[0]]);
        else res.status(404).send({ error: err2 });
      });
    } else res.status(404).send({ error: err1 });
  });
});

app.get("/api/getTeacherProfile", (req, res) => {
  const ID = req.query.id;

  const sqlSelect1 = "SELECT * FROM Teaching_Staff WHERE Employee_ID = ?;";

  db.query(sqlSelect1, [ID], (err, result) => {
    if (result?.length) res.send(result[0]);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getCourses", (req, res) => {
  const ID = req.query.id;

  const sqlSelect =
    "SELECT t.Course_ID, c.Name FROM Takes t JOIN Course c ON c.Course_ID = t.Course_ID Where Employee_ID = ?;";

  db.query(sqlSelect, [ID], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getCourseStudents", (req, res) => {
  const TID = req.query.tid;
  const CID = req.query.cid;

  const sqlSelect =
    "SELECT E.Student_ID, S.First_Name, S.Middle_Name, S.Last_Name FROM Enrollment E JOIN Takes T ON E.Course_ID = T.Course_ID JOIN Student S ON E.Student_ID = S.Student_ID WHERE T.Employee_ID = ? AND E.Course_ID = ?";

  db.query(sqlSelect, [TID, CID], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getEnrollments", (req, res) => {
  const ID = req.query.id;

  const sqlSelect =
    "SELECT c.Course_ID, c.Name, CONCAT(ts.First_Name, ' ', ts.Middle_Name, ' ', ts.Last_Name) as Teacher FROM Enrollment e JOIN Course c ON c.Course_ID = e.Course_ID  JOIN Takes t ON e.Course_ID = t.Course_ID JOIN Teaching_Staff ts ON ts.Employee_ID = t.Employee_ID WHERE E.Student_ID = ?;";

  db.query(sqlSelect, [ID], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.post("/api/updateStudentProfile1", (req, res) => {
  const CITY = req.body.city;
  const STATE = req.body.state;

  const sqlUpdate =
    "INSERT IGNORE INTO City_In_State(City, State) VALUE(?, ?);";

  db.query(sqlUpdate, [CITY, STATE], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/updateStudentProfile2", (req, res) => {
  const ID = req.body.id;
  const FIRST = req.body.first;
  const MIDDLE = req.body.middle;
  const LAST = req.body.last;
  const EMAIL = req.body.email;
  const PASS = req.body.password;
  const PHONE = req.body.phone;
  const HOUSE = req.body.house;
  const CITY = req.body.city;

  const sqlUpdate =
    "UPDATE Student SET First_Name = ?, Middle_Name = ?, Last_Name = ?, Email = ?, Password = ?, Phone_No = ?, House = ?, City = ? WHERE Student_ID = ?;";

  db.query(
    sqlUpdate,
    [FIRST, MIDDLE, LAST, EMAIL, PASS, PHONE, HOUSE, CITY, ID],
    (err, result) => {
      if (err) res.status(404).send({ error: err });
      else res.send(result);
    }
  );
});

app.post("/api/updateTeacherProfile", (req, res) => {
  const ID = req.body.id;
  const FIRST = req.body.first;
  const MIDDLE = req.body.middle;
  const LAST = req.body.last;
  const EMAIL = req.body.email;
  const PASS = req.body.password;
  const PHONE = req.body.phone;

  const sqlUpdate =
    "UPDATE Teaching_Staff SET First_Name = ?, Middle_Name = ?, Last_Name = ?, Email = ?, Password = ?, Phone_No = ? WHERE Employee_ID = ?;";

  db.query(
    sqlUpdate,
    [FIRST, MIDDLE, LAST, EMAIL, PASS, PHONE, ID],
    (err, result) => {
      if (err) res.status(404).send({ error: err });
      else res.send(result);
    }
  );
});

app.post("/api/applyLeave1", (req, res) => {
  const DATE = req.body.date;

  const sqlInsert = "INSERT IGNORE INTO Date_Table (Date) VALUES (?);";

  db.query(sqlInsert, [DATE], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/applyLeave2", (req, res) => {
  const SID = req.body.id;
  const CID = req.body.course;
  const DATE = req.body.date;

  const sqlInsert =
    "INSERT INTO Permission (Status, Date, Student_ID, Course_ID) VALUE('PENDING', ?, ?, ?);";

  db.query(sqlInsert, [DATE, SID, CID], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.get("/api/getApplications", (req, res) => {
  const ID = req.query.id;

  const sqlSelect =
    "SELECT P.Student_ID, S.First_Name, S.Middle_Name, S.Last_Name, P.Date, P.Status FROM Permission P JOIN Student S ON P.Student_ID = S.Student_ID WHERE P.Status = 'PENDING' AND P.Course_ID = ?";

  db.query(sqlSelect, [ID], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.post("/api/acceptApplication", (req, res) => {
  const SID = req.body.sid;
  const CID = req.body.cid;
  const DATE = req.body.date;

  const sqlUpdate =
    "UPDATE Permission SET Status = 'ACCEPTED' WHERE Student_ID = ? AND Course_ID = ? AND Date = ?;";

  db.query(sqlUpdate, [SID, CID, DATE], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/rejectApplication", (req, res) => {
  const SID = req.body.sid;
  const CID = req.body.cid;
  const DATE = req.body.date;

  const sqlUpdate =
    "UPDATE Permission SET Status = 'REJECTED' WHERE Student_ID = ? AND Course_ID = ? AND Date = ?;";

  db.query(sqlUpdate, [SID, CID, DATE], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/markStudentAttendance1", (req, res) => {
  const DATE = req.body.date;

  const sqlInsert = "INSERT IGNORE INTO Date_Table (Date) VALUES (?);";

  db.query(sqlInsert, [DATE], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/markStudentAttendance2", (req, res) => {
  const SID = req.body.sid;
  const CID = req.body.cid;
  const DATE = req.body.date;
  const STATUS = req.body.status;

  if (STATUS === "PRESENT") {
    const sqlInsert =
      "INSERT INTO Student_Att_Record (Enroll_ID, Date, Status) SELECT Enrollment.Enroll_ID, ?, 'PRESENT' FROM Enrollment WHERE Enrollment.Student_ID = ? AND Enrollment.Course_ID = ? AND NOT EXISTS (SELECT * FROM Student_Att_Record WHERE Student_Att_Record.Enroll_ID = Enrollment.Enroll_ID AND Student_Att_Record.Date = ?);";

    db.query(sqlInsert, [DATE, SID, CID, DATE], (err, result) => {
      if (err) res.status(404).send({ error: err });
      else res.send(result);
    });
  } else {
    const sqlInsert =
      "INSERT IGNORE INTO Student_Att_Record (Enroll_ID, Date, Status) SELECT E.Enroll_ID, ?, CASE WHEN P.Status IN ('ACCEPTED') THEN 'ABSENTWP' ELSE 'ABSENTWOP' END FROM Enrollment E JOIN Permission P ON E.Student_ID = P.Student_ID AND E.Course_ID = P.Course_ID AND P.Date = ? WHERE E.Student_ID = ? AND E.Course_ID = ?;";

    db.query(sqlInsert, [DATE, DATE, SID, CID], (err, result) => {
      if (err) res.status(404).send({ error: err });
      else res.send(result);
    });
  }
});

app.post("/api/markTeacherAttendance2", (req, res) => {
  const EID = req.body.eid;
  const CID = req.body.cid;
  const DATE = req.body.date;
  const STATUS = req.body.status;

  const sqlInsert =
    "INSERT INTO Teacher_Att_Record(Status, Takes_ID, Date) SELECT ?, T.Takes_ID, ? FROM Takes AS T WHERE T.Employee_ID = ? AND T.Course_ID = ?;";

  db.query(sqlInsert, [STATUS, DATE, EID, CID], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/markTeacherAttendance1", (req, res) => {
  const DATE = req.body.date;

  const sqlInsert = "INSERT IGNORE INTO Date_Table (Date) VALUES (?);";

  db.query(sqlInsert, [DATE], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/markTeacherAttendance2", (req, res) => {
  const EID = req.body.eid;
  const CID = req.body.cid;
  const DATE = req.body.date;
  const STATUS = req.body.status;

  const sqlInsert =
    "INSERT INTO Teacher_Att_Record(Status, Takes_ID, Date) SELECT ?, T.Takes_ID, ? FROM Takes AS T WHERE T.Employee_ID = ? AND T.Course_ID = ?;";

  db.query(sqlInsert, [STATUS, DATE, EID, CID], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/getClassAttendance", (req, res) => {
  const CID = req.body.course;
  const DATE = req.body.date;

  const sqlSelect =
    "SELECT Enrollment.Student_ID, Student.First_Name, Student.Middle_Name, Student.Last_Name, Student_Att_Record.Status FROM Enrollment INNER JOIN Student_Att_Record ON Enrollment.Enroll_ID = Student_Att_Record.Enroll_ID INNER JOIN Student ON Enrollment.Student_ID = Student.Student_ID WHERE Enrollment.Course_ID = ? AND Student_Att_Record.Date = ?;";

  db.query(sqlSelect, [CID, DATE], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.post("/api/getTeacherAttendance", (req, res) => {
  const DATE = req.body.date;

  const sqlSelect =
    "SELECT ts.Employee_ID, ts.First_Name, ts.Middle_Name, ts.Last_name, tar.Status FROM Teacher_Att_Record tar JOIN Takes t ON tar.Takes_ID = t.Takes_ID JOIN Teaching_staff ts ON t.Employee_ID = ts.Employee_ID WHERE Date = ?;";

  db.query(sqlSelect, [DATE], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getAllCourses", (req, res) => {
  const sqlSelect = "SELECT Course_ID, Name FROM Course c;";

  db.query(sqlSelect, (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getAllTeachers", (req, res) => {
  const sqlSelect =
    "SELECT t.Takes_ID, t.Employee_ID,  ts.First_Name, ts.Middle_Name, ts.Last_Name, c.Course_ID, c.Name FROM Takes t JOIN Teaching_Staff ts ON t.Employee_ID = ts.Employee_ID JOIN Course c ON t.Course_ID = c.Course_ID";

  db.query(sqlSelect, (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.post("/api/addStudent1", (req, res) => {
  const CITY = req.body.city;
  const STATE = req.body.state;

  const sqlInsert1 =
    "INSERT IGNORE INTO City_In_State (City, State) VALUES (?, ?);";

  db.query(sqlInsert1, [CITY, STATE], (err, result) => {
    if (err) res.status(404).send({ error: err });
    else res.send(result);
  });
});

app.post("/api/addStudent2", (req, res) => {
  const ID = req.body.id;
  const EMAIL = req.body.email;
  const FIRST = req.body.first;
  const MID = req.body.middle;
  const LAST = req.body.last;
  const PASS = req.body.password;
  const PHONE = req.body.phone;
  const HOUSE = req.body.house;
  const CITY = req.body.city;
  const STATE = req.body.state;

  const sqlInsert1 =
    "INSERT INTO Student (House, First_Name, Middle_Name, Last_Name, Student_ID, Email, Password, Phone_No, City) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";

  db.query(
    sqlInsert1,
    [HOUSE, FIRST, MID, LAST, ID, EMAIL, PASS, PHONE, CITY],
    (err, result) => {
      if (err) res.status(404).send({ error: err });
      else res.send(result);
    }
  );
});

app.post("/api/addTeacher", (req, res) => {
  const ID = req.body.id;
  const EMAIL = req.body.email;
  const FIRST = req.body.first;
  const MID = req.body.middle;
  const LAST = req.body.last;
  const PASS = req.body.password;
  const PHONE = req.body.phone;

  const sqlInsert =
    "INSERT INTO Teaching_Staff (Middle_Name, Last_Name, First_Name, Employee_ID, Password, Email, Phone_No) VALUES (?, ?, ?, ?, ?, ?, ?);";

  db.query(
    sqlInsert,
    [MID, LAST, FIRST, ID, PASS, EMAIL, PHONE],
    (err, result) => {
      if (err) res.status(404).send({ error: err });
      else res.send(result);
    }
  );
});

app.post("/api/addAdmin", (req, res) => {
  const ID = req.body.id;
  const EMAIL = req.body.email;
  const FIRST = req.body.first;
  const MID = req.body.middle;
  const LAST = req.body.last;
  const PASS = req.body.password;
  const PHONE = req.body.phone;

  const sqlInsert =
    "INSERT INTO Admin (Password, First_Name, Last_Name, Middle_Name, Admin_ID, Email, Phone_No) VALUES (?, ?, ?, ?, ?, ?, ?);";

  db.query(
    sqlInsert,
    [PASS, FIRST, LAST, MID, ID, EMAIL, PHONE],
    (err, result) => {
      if (err) res.status(404).send({ error: err });
      else res.send(result);
    }
  );
});

app.get("/api/getStudents1", (req, res) => {
  const sqlSelect = "SELECT * FROM Student;";

  db.query(sqlSelect, (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getStudents2", (req, res) => {
  const FIRST = req.query.first;
  const LAST = req.query.last;

  const sqlSelect =
    "SELECT * FROM Student WHERE First_Name = ? OR Last_Name = ?;";

  db.query(sqlSelect, [FIRST, LAST], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getStudents3", (req, res) => {
  const PERCENT = req.query.percent;

  const sqlSelect =
    "SELECT Student.Student_ID, Student.First_Name, Student.Last_Name, COUNT(Student_Att_Record.Status) AS Total_Classes, COUNT(CASE WHEN Student_Att_Record.Status = 'PRESENT' THEN 1 END) AS Present_Classes, (COUNT(CASE WHEN Student_Att_Record.Status = 'PRESENT' THEN 1 END) / COUNT(Student_Att_Record.Status)) * 100 AS Attendance_Percentage FROM Student INNER JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID INNER JOIN Course ON Enrollment.Course_ID = Course.Course_ID INNER JOIN Student_Att_Record ON Enrollment.Enroll_ID = Student_Att_Record.Enroll_ID GROUP BY Student.Student_ID HAVING Attendance_Percentage >= ? ORDER BY Attendance_Percentage DESC;";

  db.query(sqlSelect, [PERCENT], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getStudents4", (req, res) => {
  const sqlSelect =
    "SELECT DISTINCT s.* FROM Student s INNER JOIN Permission p ON s.Student_ID = p.Student_ID;";

  db.query(sqlSelect, (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getStudents5", (req, res) => {
  const sqlSelect =
    "SELECT s.First_Name, s.Last_Name, s.Student_ID FROM Student s INNER JOIN Enrollment e ON s.Student_ID = e.Student_ID INNER JOIN Student_Att_Record sar ON e.Enroll_ID = sar.Enroll_ID WHERE sar.Status = 'ABSENTWOP';";

  db.query(sqlSelect, (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getStudents6", (req, res) => {
  const CID = req.query.cid;

  const sqlSelect =
    "SELECT s.Student_ID, s.First_Name, s.Last_Name, ROUND(AVG(CASE WHEN a.Status = 'PRESENT' THEN 1 ELSE 0 END) * 100, 2) AS Attendance_Percentage FROM Student s JOIN Enrollment e ON s.Student_ID = e.Student_ID JOIN Course c ON e.Course_ID = c.Course_ID LEFT JOIN Student_Att_Record a ON e.Enroll_ID = a.Enroll_ID WHERE c.Course_ID = ? GROUP BY s.Student_ID, s.First_Name, s.Last_Name;";

  db.query(sqlSelect, [CID], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});
