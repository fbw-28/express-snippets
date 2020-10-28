const express = require("express")
const app = express()

let PORT = 5000
app.listen(PORT, () => console.log("Served started up"))

/***
 * API PROTOTYPING: HARDCODE YOUR RESPONSE FOR YOUR FRONTEND COLLEAGUE
 * 
 * => provide the data that our frontend people expect
 * => let's use this as a discussion base to communicate our data exchange
 *    to clear up any misunderstandings
 *    and test already the connection between frontend & backend
 */
app.get("/posts/:id", (req, res, next) => {

  let { id } = req.params // => grab ID from url

  res.send({
    _id: "123",
    title: "Most efficient structure of mongoose Schema",
    answers: [
      // subdocuments, embedded documents, nested documents (= all mean the same)
      { _id: 1, title: "I think mongoose populate will help you here." },
      { _id: 2, title: "Please look this Models and queries that can help you do build your schemas.." },
    ]
  })

})