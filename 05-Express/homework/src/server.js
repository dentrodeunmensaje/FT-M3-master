// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json()); //middleware para manejar json en las peticiones de express

// TODO: your code to handle requests

const PATH = "/posts";
let id = 1;

server.post(PATH, (req, res) => {
  const { author, title, contents } = req.body;
  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }

  const post = {
    author,
    title,
    contents,
    id: id++,
  };
  posts.push(post);
  res.status(200).json(post);
});

server.post(`${PATH}/author/:author`, (req, res) => {
  const { author } = req.params;
  const { title, contents } = req.body;
  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
  const post = {
    author,
    title,
    contents,
    id: id++,
  };
  posts.push(post);
  res.status(200).json(post);
});

server.get(PATH, (req, res) => {
  let { term } = req.query;
  if (term) {
    let filteredPosts = posts.filter(
      (post) => post.title.includes(term) || post.contents.includes(term)
    );
    return res.status(200).json(filteredPosts);
  } else {
    res.status(200).json(posts);
  }
});

server.get(`${PATH}/:author`, (req, res) => {
  const { author } = req.params;
  const filteredPosts = posts.filter((post) => post.author === author);
  if (filteredPosts.length > 0) {
    return res.status(200).json(filteredPosts);
  } else {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  }
});

server.get(`${PATH}/:author/:title`, (req, res) => {
  const { author, title } = req.params;
  const filteredPosts = posts.filter(
    (post) => post.author === author && post.title === title
  );
  if (filteredPosts.length > 0) {
    return res.status(200).json(filteredPosts);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  }
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;

  if (!id || !title || !contents)
    return res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para actualizar el Post",
    });

  const post = posts.find((post) => post.id === id);

  if (!post)
    return res.status(STATUS_USER_ERROR).json({
      error: "El id no corresponde con un Post existente",
    });

  post.title = title;
  post.contents = contents;

  return res.json(post);
});

server.delete("/posts", (req, res) => {
    const { id } = req.body;
    if (!id)
        return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});
    const post = posts.find((post) => post.id === id);
    if (!post)
        return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});
    posts.splice(posts.indexOf(post), 1);
    return res.status(200).json({success: true} );
});

server.delete('/author', (req, res) => {
    let { author } = req.body;
    const author_found = posts.find((post) => post.author === author);
    if (!author || !author_found)
        return res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"});
    let delete_authors = [];
     delete_authors = posts.filter((post) => post.author === author);
    posts = posts.filter((post) => post.author !== author);
    console.log(delete_authors);
    return res.json(delete_authors);
});

module.exports = { posts, server };
