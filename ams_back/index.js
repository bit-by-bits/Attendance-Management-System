const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3001;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "prateek.pk12",
  database: "ams_db",
  port: 3306,
});

// Attempt to catch disconnects
db.on("connection", (connection) => {
  console.log("DB Connection established");

  connection.on("error", (err) =>
    console.error(new Date(), " MySQL error ", err.code)
  );

  connection.on("close", (err) =>
    console.error(new Date(), " MySQL close ", err)
  );
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`\nApp listening to Port: ${port}\n`);
});

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
    "CREATE TABLE IF NOT EXISTS Permission(Date DATE NOT NULL, Status VARCHAR(20) NOT NULL, Student_ID VARCHAR(30) NOT NULL, Course_ID VARCHAR(30) NOT NULL, PRIMARY KEY (Student_ID, Course_ID), FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID), FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID));";
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
  console.log("Student Selected: " + ID);

  const sqlSelect =
    "SELECT E.Course_ID, C.Name , S.Date, S.Status FROM student_att_record S JOIN Enrollment E on S.Enroll_ID = E.Enroll_ID JOIN Course C on E.Course_ID = C.Course_ID WHERE E.Student_ID = ? AND S.Date BETWEEN  DATE_ADD(current_date(), INTERVAL -7 DAY) AND CURRENT_DATE() ORDER BY E.Course_ID;";

  db.query(sqlSelect, [ID], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});

app.get("/api/getCourses", (req, res) => {
  const ID = req.query.id;
  console.log("Teacher Selected: " + ID);

  const sqlSelect =
    "SELECT t.Course_ID, c.Name FROM Takes t JOIN Course c ON c.Course_ID = t.Course_ID Where Employee_ID = ?;";

  db.query(sqlSelect, [ID], (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
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

app.get("/api/getAllCourses", (req, res) => {
  const sqlSelect = "SELECT Course_ID, Name FROM Course c;";

  db.query(sqlSelect, (err, result) => {
    if (result?.length) res.send(result);
    else res.status(404).send({ error: err });
  });
});