const express = require("express")
// mini API for managing one resource only
const router = express.Router() 

let teachers = [
  { name: 'Joseph', id: '1' },
  { name: 'Bleda', id: '2' },
  { name: 'Benjamin', id: '3' },
  { name: 'Mariam', id: '4' },
  { name: 'Martina', id: '5' },
  { name: 'Naqvi', id: '6' },
  { name: 'Vasilis', id: '7' },
  { name: 'Rob', id: '8' }
];



// ROUTES FOR MANAGING TEACHERS 

router.get('/add', (req, res) => {
  console.log("Teacher Form called")
  console.log("Current directory", __dirname)

  // construct an absolute path to that goddam file
  // why? because sendFile does not allow RELATIVE (./) paths
  res.sendFile(__dirname + '/ui/teacher_add.html')
})


router.get('/', (req, res) => {
  console.log('Route /teachers called');
  res.json(teachers);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log('Requested single teacher');
  console.log(`Teacher ID sent to us: ${id}`);

  let teacher = teachers.find((teacher) => teacher.id == id);

  res.json(teacher);
});

router.post('/', (req, res) => {

  console.log('POST teachers route called');
  console.log(req.body) // this is the data that the frontend SENT to us
  
  let teacherNew = { id: Date.now().toString(), ...req.body }
  teachers.push(teacherNew)
  
  console.log(teachers)
  res.json(teacherNew);
});

// export our sub API
module.exports = router
