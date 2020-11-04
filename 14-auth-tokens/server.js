const express = require('express');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken") // library for creating & verifying tokens
const app = express();
const cookieParser = require("cookie-parser")

let JWT_SECRET = "holySecret"

let users = [
  { _id: "1", email: "marius@dci.com", password: "marius" },
  { _id: "2", email: "felix@dci.com", password: "felix" },
]

app.use( cookieParser() ) // parse incoming cookies => req.cookies
app.use( express.json() ) // JSON body parser middleware

// create hashes for passwords using bcrypt library
app.get('/hash', (req, res, next) => {

  // TODO: for every user: hash the password
  users.map(user => {
    user.password = bcrypt.hashSync(user.password, 10)
    return user
  })

  res.send({ 
    message: "Hashed user passwords", 
    users
  })
})

app.post('/login', (req, res, next) => {

  const { email, pwPlain } = req.body

  const userFound = users.find(user => user.email == email)

  // if user with given email found => let's check the password!
  if(userFound) {

    // compare the plain text password with the one stored in "database"
    let pwMatch = bcrypt.compareSync(pwPlain, userFound.password)

    // email & password matches => return success!
    if(pwMatch) {

      // create token
      let token = jwt.sign( { _id: userFound._id }, JWT_SECRET )

      res.cookie('auth', token)
      
      return res.json({
        success: true,
        token
        // user: userFound
      })
    }
  }

  // we did not found any user with given email password
  res.status(400).json({
    success: false    
  })

})

// MIDDLEWARE to verify tokens
const auth = (req, res, next) => {

  let token = req.cookies.auth  // => here we expect to find the token!
  console.log("Token from cookie: ", token)

  try {
    // verify token and allow user to pass on to route
    let infoInToken = jwt.verify(token, JWT_SECRET)
    next() // => we move on to the route!
  }
  catch(err) {
    res.json({ success: false } ) // => we CANCEL the request!
  }

}

// ROUTE PROTECTION
app.get('/users', auth, (req, res) => {
  console.log("Users route reached...")
  res.send(users);
});

app.get('/', (req, res) => res.send("Hello from API")) // home route

app.listen(5000, () => {
  console.log('Example app listening on port 5000!');
});

//Run app, then load http://localhost:5000 in a browser to see the output.


