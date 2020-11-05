const express = require('express');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken") // library for creating & verifying tokens
const app = express();
const cookieParser = require("cookie-parser")

let JWT_SECRET = "holySecret"

let users = [
  { _id: "1", email: "marius@dci.com", password: "marius", role: 'Admin' },
  { _id: "2", email: "felix@dci.com", password: "felix", role: 'User' }
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

      // create JWT token 
      // do NOT store sensitive information in the token!
      let token = jwt.sign( { _id: userFound._id }, JWT_SECRET )

      // store the token in a cookie and send the cookie together with the response
      res.cookie('auth', token)
      
      return res.json({
        success: true,
        token // send the token along
        // user: userFound
      })
    }
  }

  // we did not found any user with given email password
  res.status(400).json({
    success: false    
  })

})

// SECURITY GUARD
// MIDDLEWARE to verify tokens
const auth = (req, res, next) => {

  let token = req.cookies.auth  // => here we expect to find the token!
  console.log("Token from cookie: ", token)

  try {
    // verify token and if it works => allow user to pass on to route
    let userInfo = jwt.verify(token, JWT_SECRET)
    req.user = userInfo // store user information in request for access later!
    next() // => we move on to the route!
  }
  // if verify fails, it will throw an error => we terminate the response
  catch(err) {
    // 401 = unauthorized => 401 you throw when accessing a resource where you do not have access to
    res.status(401).json({ 
      success: false,
      message: "You did not provide a valid token. Please login!"
    }) // => we CANCEL the request!
  }
}


/**
 * isAdmin should let only pass users with the role "Admin" set
 */
const isAdmin = (req, res, next) => {
  console.log(req.user)

  // find user with given ID and check his role!
  let userFound = users.find(user => user._id == req.user._id && user.role == "Admin")

  // this user is not admin? raise an error manually 
  if(!userFound) {
    let error = new Error("You do not belong here")
    error.status = 403 // = Forbidden
    return next(error)
  }

  next() // user is admin => progress to requested resource!
}

app.get('/logout', (req, res) => {
  res.clearCookie('auth')
  res.json({
    message: "Logged out successfully"
  })
})

// ROUTE PROTECTION
// we inject the auth middleware as a "security gate" that 
// the user needs to pass before reaching the route
app.get('/users', auth, (req, res) => {
  console.log("Users route reached...")
  res.send(users);
});

app.get('/admin', auth, isAdmin, (req, res) => {
  res.json({
    message: "You entered secret admin area successfully"
  })
})

app.get('/', (req, res) => res.send("Hello from API")) // home route

// GENERIC ERROR HANDLER
app.use( (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message
  })
})

app.listen(5000, () => {
  console.log('Example app listening on port 5000!');
});

//Run app, then load http://localhost:5000 in a browser to see the output.

