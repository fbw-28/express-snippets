const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { Schema, model } = mongoose

let PORT = 5000
app.listen(PORT, () => console.log("Served started up"))

mongoose.connect('mongodb://localhost/blog_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log("Connected to DB successfully"))
.catch(err => console.log("Connection failed", err.message))

const AnswerSchema = new Schema({
  text: { type: String, required: true }  
})

// EMBEDDING answers into our posts
const PostSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  answers: [ AnswerSchema ] // a post can have MULTIPLE comments
})

const Post = model('Post', PostSchema)


// seed in "embedded data"
app.get('/seed', async (req, res, next) => {

  await Post.deleteMany() // deletes all records from Post collection

  const posts = await Post.insertMany([
    {
      title: "Mongoose sucks - can anyone help?",
      author: "Me",
      answers: [
        { text: "Mongoose is not that bad. Try harder!" },
        { text: "The author is right, Mongoose sucks, there is no point!" },
      ]
    },
    {
      title: "Redux sucks - why is it still used that often?",
      author: "Me",
      answers: [
        { text: "Because Redux is more performant. We always need best performance" },
        { text: "Yeah, but in 95% of apps you actually cannot tell the difference!" },
      ]
    }]
  )

  res.send(posts)
})


app.get('/posts', async (req, res, next) => {
  let posts = await Post.find()  
  res.send(posts)
})

app.get("/posts/:id", async (req, res, next) => {
  let { id } = req.params // => grab ID from url
  let post = await Post.findById(id)
  res.send(post)
})
