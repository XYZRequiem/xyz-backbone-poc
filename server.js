const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
const port = 3000;

const startApp = () => {
  mongoose.connect("mongodb://localhost/bloglisttut");
  app.listen(port);
  console.log("listening on port 3000");
};

const Schema = mongoose.Schema;
const BlogSchema = new Schema({
  author: String,
  title: String,
  url: String,
});

mongoose.model("Blog", BlogSchema);

const Blog = mongoose.model("Blog");

app.get("/api/blogs", (req, res) => {
  Blog.find((err, blogs) => {
    res.send(blogs);
  });
});

app.post("/api/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog.save((err, blog) => {
    console.log("its alive");
    res.send(blog);
  });
});

app.put("/api/blogs/:id", (req, res) => {
    Blog.update({_id:req.params.id}, req.body, err =>{
        res.send({ _id: req.params.id })
    })
});

app.delete("/api/blogs/:id", (req, res) => {
  Blog.remove({ _id: req.params.id }, (err) => {
    res.send({ _id: req.params.id });
  });
});

startApp();
