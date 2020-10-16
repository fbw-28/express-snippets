const express = require('express');
const cors = require("cors")

const app = express();
const PORT = 5000;

// MIDDLEWARE

app.use(cors()) // allow sending of data to our API from everywhere! 
  // (= more precisely from a frontend that uses a different domain / port than our backend)

app.use(express.json()) // parses incoming body fields and 
  // stores them in object req.body

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});

let teachers = [
  { name: 'Joseph', id: 1 },
  { name: 'Bleda', id: 2 },
  { name: 'Benjamin', id: 3 },
  { name: 'Mariam', id: 4 },
  { name: 'Martina', id: 5 },
  { name: 'Naqvi', id: 6 },
  { name: 'Vasilis', id: 7 },
  { name: 'Rob', id: 8 }
];

app.get('/', (req, res) => {
  res.send('<h1>Welcome to our API</h1>');
});

app.get('/teachers', (req, res) => {
  console.log('Route /teachers called');
  res.json(teachers);
});

app.get('/teachers/add', (req, res) => {
  console.log("Teacher Form called")
  console.log("Current directory", __dirname)

  // construct an absolute path to that goddam file
  // why? because sendFile does not allow RELATIVE (./) paths
  res.sendFile(__dirname + '/ui/teacher_add.html')
})

app.get('/teachers/:id', (req, res) => {
  console.log('Requested single teacher');
  console.log('params sent to us', req.params);

  const { id } = req.params;

  console.log(`ID sent to us: ${id}`);

  let teacher = teachers.find((teacher) => teacher.id == id);

  res.json(teacher);
});

app.post('/teachers', (req, res) => {
  console.log('POST teachers route called');
  console.log(req.body) // this is the data that the frontend SENT to us
  
  teachers.push(req.body)
  
  console.log(teachers)
  res.json(req.body);
});
