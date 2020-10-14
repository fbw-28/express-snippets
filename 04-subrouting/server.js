const express = require('express');
const app = express();
const port = 5000;

// Import by sub APIs
const teacherRouter = require("./routes/teachers")
const studentRouter = require("./routes/students")

// MIDDLEWARE
app.use(express.json()) 
// => takes the incoming body STRING, parses the JSON inside
// and stores the data in => req.body

app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to our API</h1>');
});

// Hook in our sub APIs into our main API

// hook in routes
app.use('/teachers', teacherRouter)
app.use('/students', studentRouter)


