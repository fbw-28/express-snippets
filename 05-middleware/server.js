const express = require('express');
const app = express();
const morgan = require("morgan")

app.use( express.json() ) // JSON body parser middleware

app.use( morgan('dev') ) // setup morgan request logger middleware

/** MIDDLEWARE (generic) */
// app.use( (req, res, next) => {
//   console.log(`We called a route ${req.url} `)
//   next()
// })

/** MIDDLEWARE (route specific)
 *  this will just run when we call the /get route */
const checkUser = (req, res, next) => {
  console.log(`We know who you are `)
  next()
  
}

const checkTicket = (req, res, next) => {
  console.log("We validate your ticket now...")

  // REJECT a request in middleware!
  // res.json({
  //   error: "Your ticket is not valid"
  // })
  next()
}

/** MIDDLEWARE CHAINING */
app.get('/get', checkUser, checkTicket, (req, res) => {
  // console.log("GET route / called")  => not needed anymore! Middleware will do it now
  res.json({
    message: 'Hello World GET!'
  });
});

app.post('/post', (req, res) => {
  // console.log("POST route / called") => not needed anymore! Middleware will do it now  
  res.json({
    message: "Hello World POST"
  })
})

app.listen(5000, () => {
  console.log('Example app listening on port 5000!');
});

//Run app, then load http://localhost:5000 in a browser to see the output.