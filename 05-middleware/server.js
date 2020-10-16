const express = require('express');
const app = express();
const morgan = require("morgan")

app.use( express.json() ) // JSON body parser middleware

app.use( morgan('dev') ) // setup morgan request logger middleware

/** MIDDLEWARE (generic) 
 * log all requests to routes
 * (we commented it out below, because morgan does it a bit better :) )
*/
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

// Another route specific middleware
const checkTicket = (req, res, next) => {
  console.log("We validate your ticket now...")

  /* example of REJECTING a request in middleware 
      (request will not pass through to the route)! */
  // res.json({
  //   error: "Your ticket is not valid"
  // })
  next()
}

/** MIDDLEWARE CHAINING 
 * On the /get route we apply TWO middlewares, which must be passed,
 * BEFORE the user reaches the actual route (=our service)
*/
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