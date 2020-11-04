const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { Schema, model } = mongoose

let PORT = 5000
app.listen(PORT, () => console.log("Served started up"))

app.use(express.json()) // make sure we get this req.body thing in our routes!!!

mongoose.connect('mongodb://localhost/blog_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log("Connected to DB successfully"))
.catch(err => console.log("Connection failed", err.message))

// Things we need: Blog Posts, Comments

// Comment structure: { text: "abc", username: 'efg }
// Author structure: username, email
// Post -> can have 0 up to many comments

const AnswerSchema = new Schema({
  text: { type: String, required: true }  
})

const AuthorSchema = new Schema({
  name: { type: String, required: true },
  email: String
},
{ versionKey: false })


// EXAMPLE: EMBEDDING / NESTING A SCHEMA
const PostSchema = new Schema({
  title: { type: String, required: true },
  author: { // REFERENCING a document!
    type: mongoose.ObjectId,
    ref: 'Author' // => this tells mongoose WHERE to look for the document with the given ID 
  },
  // author: AuthorSchema, // Embedding the author directly into the post
  answers: [ AnswerSchema ] // a post can have MULTIPLE comments
}, 
{ versionKey: false })

const Author = model('Author', AuthorSchema) // Author => equivalent: collection "authors" in MongoDB
const Post = model('Post', PostSchema) // Post => equivalent: collection "posts"


app.get('/seed', async (req, res, next) => {

  await Author.deleteMany() // 
  await Post.deleteMany() // deletes all records from Post collection

  let authors = await Author.insertMany([
    { name: "Me", email: "rob@dci.what" },
    { name: "Vadim" }
  ])

  /** this it what MongoDB will return to us => the data we inserted + IDs (!) for every record
   * { _id: 12345, name: "Me", email: "rob@dci.what" },
     { _id: 67890, name: "Vadim" } 
     // = authors
   */

  // => insertMany creates an array of documents in MongoDB
  const posts = await Post.insertMany([
    {
      title: "Mongoose sucks - can anyone help?",
      author: authors[0]._id,
      answers: [
        { text: "Mongoose is not that bad. Try harder!" },
        { text: "The author is right, Mongoose sucks, there is no point!" },
      ]
    },
    {
      title: "Redux sucks - why is it still used that often?",
      author: authors[1]._id,
      answers: [
        { text: "Because Redux is more performant. We always need best performance" },
        { text: "Yeah, but in 95% of apps you actually cannot tell the difference!" },
        { text: "Yes, but maybe at some point you will have one of those 5% apps that have thousdand of users! Prepare for that!" }
      ]
    },
    {
      title: "US & NSA suck - who is going to change that? Stand up, you sheep people",
      author: authors[1]._id,
      answers: [
        { text: "Government here. Sorry, we do not understand your request" }
      ]
    }
  ])

  res.send(posts)
})


app.get('/authors', async (req, res, next) => {
  let authors = await Author.find()  
  res.send(authors)
})

app.get('/posts', async (req, res, next) => {
  let posts = await Post.find()
    .populate('author')

  res.send(posts)
})

app.get("/posts/:id", async (req, res, next) => {
  
  let { id } = req.params

  // findOne we use if we want to search by some criteria other than ID
  // await Post.findOne({ email: 'rob@dci.org' })

  // findById we use if we want to grab a record by ID
  let post = await Post.findById(id)
    .populate('author') 
    // what does populate do? 
    // it looks up the documents BEHIND the IDs and replace the ID by the actual document content
    // so that way we can provide all data the frontend needs in ONE requests
    
  res.send(post)
})



// UPDATING referenced data
//
// find a author by id
// update the fields of that author
app.patch('/author/:id', async (req, res, next) => {

  const { id } = req.params
  // update an item
  // the {new:true} option is necessary if we want to retrieve back
  // the UPDATED item from the database (not the item how it was before)
  let author = await Author.findByIdAndUpdate(id, req.body, { new: true })
  res.send(author)
})


// DB TERMINOLOGY

// DOCUMENT => JAVASCRIPT OBJECT STORED IN A DATABASE
//  => synonyms: record, entry

// COLLECTION => ARRAY OF JS OBJECTS STORED IN A DATABASE
//  => synonyms: table, files


/** WHY a DB and not just work with a JSON file ???

  - JSON file could grow very large => operations will slow down significantly!
  - concurrent access => if two people write file at the same time, you can get into trouble!
  - security reasons => limiting access to people

  => main reasons in a nutshell: performance & security
*/


// EMBEDDING vs REFERENCING

// EMBEDDING you use when
// - the related data is TIGHTLY COUPLED to its parent document. and not used anywhere else!
// examples: links to your social media profiles, phone numbers, etc

// REFERENCING you use when
// - the related data could also be used by OTHER documents
// - the related data could grow endlessly (or very large)
// examples: authors of posts, products in an order
