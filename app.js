// Import the Express.js framework
const express = require('express');

//code for body-parser
const bodyParser = require('body-parser');
// Create an instance of the Express application. This app variable will be used to define routes and configure the server.
const app = express();

//Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Specify the port for the server to listen on
const port = 3000;

//set EJS as the view engine
app.set('view engine', 'ejs');
// In-memory data for students
let students = [
  { id: 1, name: 'Peter Tan', age: 20 },
  { id: 2, name: 'Mary Lim', age: 22 },
  { id: 3, name: 'John Ho', age: 21 }
];

// Routes for CRUD operations
// Route to retrieve and display all students
app.get('/', function(req, res) {
    //render a view called "index" and pass the variable 'students' to the view for rendering
    res.render('index', { students });
});

// Route to get a specific student by ID
app.get('/students/:id', function(req, res) {
    // Extracting the 'id' parameter from the request parameters and converting it to an integer
    const studentId = parseInt(req.params.id);
    // Searching for a student in the 'students' array with a matching 'id'
    const student = students.find((student) => student.id === studentId);

    // Checking if a student with the specified 'id' was found
    if (student) {
        //If the student is found, render a view called "studentInfo" and pass the variable 'students' to the view for rendering.
        res.render('studentInfo', { student })
    } 
});

// Add a new student form
app.get('/students', function(req, res) {
    //render a view called "addStudent"
    res.render('addStudent');
});

// Add a new student
app.post('/students', function(req, res) {
    //add a new student
    //This line retreives the value of 'name' and 'age' sent from addStudent.ejs form
    const { name, age } = req.body;
    // Assign a new ID to the new student
    const id = students[students.length-1].id + 1;
    // Creates a new student object with the new values
    const newStudent = { id, name, age };
    // Add the new student to the array
    students.push(newStudent);
    // redirect back to index page
    res.redirect('/');
});

// Update a student by ID - First Find the student
app.get('/students/:id/update', function(req, res)  {
    //find student to update based on student ID selected
    //capture the value specified in the URL for the id parameter and store in studentId variable
    const studentId = parseInt(req.params.id);
    
    //Finding a student in the 'students' array with a matching id to update
    //Student found will be stored in updateStudent variable
    const updateStudent = students.find(function(students) {
        return students.id === parseInt(studentId);
    });
    //render the view 'updateStudent' and pass the updateStudent varible to the page updateStudent.ejs to be displayed.
    res.render('updateStudent', {updateStudent});
});

// Update a student by ID - Update the student information
app.post('/students/:id/update', function(req, res) {
    // update student information entered in updateStudent form
    // Parse the 'id' parameter from the request URL into an integer and store it in 'studentId'.
    const studentId = parseInt(req.params.id);
    
    // Destructure the 'studentName' and 'age' properties from the request body.
    const {studentName, age} = req.body;
    
    // Create an object 'updatedStudent' containing the parsed 'id', 'studentName', and 'age'.
    const updatedStudent = {id: studentId, name: studentName, age: age};
    
    // Iterate over each element in the 'students' array using the 'map' function.
    students = students.map(student => {
        // Check if the 'id' of the current 'student' matches the 'studentId' parsed from the URL.  
        if (student.id === studentId) {
          // If there's a match, return a new object combining the existing 'student' properties with the updated ones.
          return { ...student, ...updatedStudent };
        }
        // If there's no match, return the 'student' object unchanged.
        return student;
    });
    // Redirect the user back to the root URL ('/') after updating the student information.
    res.redirect('/');
});

// Delete a student by ID
app.get('/students/:id/delete', function(req, res) {
    const studentId = parseInt(req.params.id);

    // Filter out the deleted student
    students = students.filter(students => students.id !== studentId);
    //Redirect back to index page after deleting the student
    res.redirect('/')
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully started
  console.log(`Server is running at http://localhost:${port}`);
});

