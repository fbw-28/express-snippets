const mongoose = require('mongoose')

//const strConn = "mongodb://localhost/yourdatabasename"
const strConn = "mongodb+srv://<username>:<password>@robdciclusterr.6y8pq.mongodb.net/testing?retryWrites=true&w=majority"

mongoose.connect(strConn, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log("Connection to cloud database established!"))
.catch((err) => console.log("Connection failed"))

// RAPIDAPIS
// AWS

