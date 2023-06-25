require ("dotenv").config();
const { validateMovie, validateUser } = require("./validators.js");
const { hashPassword } = require ("./auth.js");
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 6008;

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

const welcome = (req, res) => {
  console.log("page d'accueil")
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.post("/api/users", hashPassword, validateUser, userHandlers.postUser);

app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.put("/api/users/:id", hashPassword, validateUser, userHandlers.updateUser);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", movieHandlers.deleteUser);


