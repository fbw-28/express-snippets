const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
  res.cookie('auth', 'ey12345') // => SESSION COOKIE
  res.cookie('iwillexpire', "hello world",  // => NORMAL COOKIE WITH EXPIRATION TIME
    { maxAge: 2*60*1000 } // = 2 minutes (=2 * 60 seconds * 1000 mseconds) 
  )

  res.send({
    message: "Logged in successfully"
  })
})

app.get('/logout', (req, res) => {
  res.clearCookie('auth')
  res.send({
    message: "Logged out successfully"
  })
})

app.listen(7000, () => {
  console.log('Example app listening on port 7000!');
});

//Run app, then load http://localhost:7000 in a browser to see the output.