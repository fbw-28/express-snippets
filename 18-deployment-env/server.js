const express = require('express')
const mongoose = require('mongoose')
const { Schema, model } = mongoose
const app = express()
const connOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }

// Sensitive information:
// - credentials to other services => mongo DB connection string
// - security secrets => JWT secret 
// => outsource these secret info to environment file .env

// ENVIRONMENTS
//  development (=> our local machine)
//  production (=> our live system)

// process.env.NODE_ENV 
// => this determines if we are local or "in the clouds"

// on deployment servers typically the 
// env variable "NODE_ENV" is already SET with the value "production"
if(process.env.NODE_ENV == "production") {
  require("dotenv").config()
}
// if not production => load our LOCAL environment configuration
else {
  require("dotenv").config({ path: "./.env.dev" })
}
  // loads contents from .env file and stores them in process.env object
  // => process.env.JWT_SECRET
  // => process.env.MONGODB_URI

// *** MONGODB ***
mongoose.connect(process.env.MONGODB_URI, connOptions)
.then(() => console.log("Database connection established"))

const AnimalSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 15 },
})

const Animal = model("Animal", AnimalSchema);


// *** ROUTES ***
app.get("/", (req, res, next) => {
  res.send("Hey, this deploy thing is working!")
})

app.get('/env', (req, res, next) => {
  res.json({
    mongouri: process.env.MONGODB_URI,
    environment: process.env.NODE_ENV, // environment
  })
})

app.get("/animals", async (req, res, next) => {
  try {
    const animals = await Animal.find()
    res.send(animals)
  }
  catch(err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.status(err.status).json({
    error: err.message
  })
})

let port = 5000
app.listen(port, () => console.log("API up and running..."))
