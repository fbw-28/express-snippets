const express = require('express')
const app = express()

app.get("/", (req, res, next) => {
  res.send("Hey, this deploy thing is working!")
})

app.get("/animals", async (req, res, next) => {
  res.json([
    { name: "Giraffe" },
    { name: "Koala" }
  ])
})

let port = 5000
app.listen(port, () => console.log("API up and running..."))
