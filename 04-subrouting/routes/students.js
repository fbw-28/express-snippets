const express = require("express")
const router = express.Router()

// ROUTES FOR MANAGING STUDENTS 

let students = [
  { name: 'Vasilis', id: '1' },
  { name: 'Andrea', id: '2' },
  { name: 'Edgar', id: '3' },
]


router.get('/', (req, res) => {
  console.log('Route /students called');
  res.json(students);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log('Requested single student');
  console.log(`Student ID sent to us: ${id}`);

  let student = students.find((student) => student.id == id);

  res.json(student);
});

router.post('/', (req, res) => {
  console.log('POST students route called');
  console.log(req.body) // this is the data that the frontend SENT to us
  
  let studentNew = { id: Date.now().toString(), ...req.body }
  students.push(studentNew)
  
  console.log(students)
  res.json(studentNew);
});


module.exports = router