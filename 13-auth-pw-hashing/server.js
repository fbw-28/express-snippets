const express = require('express');
const app = express();
const bcrypt = require("bcryptjs"); // npm i bcryptjs (=> NOT npm i bcrypt)

app.use( express.json() ) // setup body parser middleware

app.get('/', (req, res) => {
  res.send('Hello World!');
});


let users = [
  { _id:  "1", email: "andrea@buffetti.org", password: "halloween" },
  { _id:  "2", email: "donald@trump.gov", password: "fakenews" },
  { _id:  "3", email: "joe@biden.gov", password: "imtooold" }
]

/**
 * Create a user in DB
 * Hash the plain text password
 * Store user together with HASHED password
 */
app.post('/signup', (req, res) => {

  let userNew = req.body // we expect email & password

  // hash the goddam plain text password
  // second parameter of hashSync => salting ROUNDS 
  // (=> we add a salt 10 times ! and hash after each round again)
  userNew.password = bcrypt.hashSync( userNew.password, 10 )
  userNew._id = Date.now().toString() // generate some random ID

  users.push( userNew )
  res.json(userNew)
})

/**
 * Login an existing user
 * 
 * Check incoming email & password if such a user exists in our DB
 * 
 * 
 */
app.post('/login', (req, res, next) => {

  const { email, password } = req.body

  // lookup user by email
  let userFound = users.find(user => user.email == email)

  if(!userFound) {
    let error = new Error("User with given email not found in our system")
    error.status = 400
    return next(error) // return right away out of route
  }

  // bcrypt compare => compares our plain text password given by user
  // with HASHED password stored for user
  let pwMatch = bcrypt.compareSync(password, userFound.password)

  if(!pwMatch) {
    let error = new Error("Passwords do not match!")
    error.status = 400
    return next(error)
  }

  res.json({
    success: true,
    user: userFound
  })

})


app.get('/users', (req, res, next) => {
  res.json(users)
})  


app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message
  })
})


let port = 5000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

//Run app, then load http://localhost:port in a browser to see the output.