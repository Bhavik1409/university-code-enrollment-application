const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000; 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'university_enrollment'
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
app.use(express.json());
app.get('/courses', (req, res) => {
  const query = 'SELECT * FROM courses;';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err);
      res.status(500).json({ error: 'Error fetching courses' });
      return;
    }
    res.json(results);
  });
});
app.post('/enroll/:courseId', (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const studentName = req.body.studentName; 
  const capacityQuery = `SELECT capacity FROM courses WHERE id = ${courseId};`;
  connection.query(capacityQuery, (err, results) => {
    if (err) {
      console.error('Error fetching course capacity:', err);
      res.status(500).json({ error: 'Error enrolling in the course' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const courseCapacity = results[0].capacity;
    const enrollmentQuery = `SELECT COUNT(*) AS num_enrollments FROM enrollments WHERE course_id = ${courseId};`;
    connection.query(enrollmentQuery, (err, results) => {
      if (err) {
        console.error('Error fetching course enrollments:', err);
        res.status(500).json({ error: 'Error enrolling in the course' });
        return;
      }

      const numEnrollments = results[0].num_enrollments;

      if (numEnrollments >= courseCapacity) {
        res.json({ success: false, message: 'Course is already at maximum capacity.' });
      } else {
        const enrollmentInsertQuery = `INSERT INTO enrollments (student_name, course_id) VALUES ('${studentName}', ${courseId});`;
        connection.query(enrollmentInsertQuery, (err) => {
          if (err) {
            console.error('Error enrolling in the course:', err);
            res.status(500).json({ error: 'Error enrolling in the course' });
            return;
          }
          res.json({ success: true });
        });
      }
    });
  });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
