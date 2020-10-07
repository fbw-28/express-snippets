const express = require('express')
const teachers = require('./data')

const app = express()
const port = 5000

app.listen(port, () => {
  console.log(`Started server on port ${port}`)
})

app.get('/html', (req, res) => {
  res.send('<h1>Welcome, I am HTML</h1>')
})

app.get('/teachers', (req, res) => {
  console.log("Route /teachers called")
  res.json(teachers)
})

app.get('/teachers/:id', (req, res) => {
  console.log("Requested single teacher")
  console.log("params sent to us", req.params)

  const { id } = req.params

  console.log(`ID sent to us: ${id}`)

  let teacher = teachers.find( teacher => teacher.id == id )

  res.json(teacher)
})

