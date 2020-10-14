const express = require('express');
const app = express();

let users = [
  { id: '1', email: 'joseph@dci.com', password: 'joseph123'},
  { id: '2', email: 'marcell@dci.com', password: 'marcel456'},
]

app.use( express.json() ) // => req.body

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// expect to get fields: email, password
app.post('/login', (req, res) => {

  console.log(req.body)

  if(!req.body.email && !req.body.password) {
    return res.json({message: 'I told you, I need email & password!'})
  }

  let userFound = users.find(user => user.email == req.body.email && user.password == req.body.password)

  if(!userFound) {
    res.json({ message: 'Login not susscesful'})
  }
  else {
    res.json({ message: 'Logged you in successfully'})
  }
  
})

// SIGNUP
app.post('/signup', (req, res) => {
  let userNew = req.body
  users.push(userNew)
  res.json(userNew)
})

// GET ME ALL USERS
app.get('/users', (req, res) => {
  res.json(users)
})

app.delete('/users/:id', (req, res) => {

  let { id } = req.params
  users = users.filter(user => id != user.id)
  res.json({ message: `Item with ID ${id} was deleted successfully ` })
})

app.patch('/users/:id', (req, res) => {

  let { id } = req.params
  let fields = req.body

  console.log(id, fields)

  // HOW THE FUCK DO I UPDATE A FUCKING OBJECT 
  // IN A FUCKING ARRAY?

  let userFound = users.find(user => user.id == id)

  if(userFound) {
    Object.assign(userFound, {...req.body})
    res.send(userFound)
  }
  else {
    res.json({ message: 'What do you think we are here? Please provide someone we know!!!' })
  }

})

let PORT = 5000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Run app, then load http://localhost:port in a browser to see the output.

