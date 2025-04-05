const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
const app = express();
const authCookieName = "token";
const DB = require("./database.js");
DB.connect();
const { peerProxy } = require("./peerProxy.js");

// let movies = [
//   {
//     id: 1,
//     title: "Inception",
//     description:
//       "A thief who steals corporate secrets through the use of dream-sharing technology.",
//     rating: 4.8,
//     totalNumberOfRatings: 100,
//     totalScore: 480,
//     ratedBy: [],
//   },
//   {
//     id: 2,
//     title: "The Matrix",
//     description:
//       "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
//     rating: 4.7,
//     totalNumberOfRatings: 90,
//     totalScore: 423,
//     ratedBy: [],
//   },
//   {
//     id: 3,
//     title: "Interstellar",
//     description:
//       "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
//     rating: 4.6,
//     totalNumberOfRatings: 80,
//     totalScore: 368,
//     ratedBy: [],
//   },
// ];

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

var apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.post("/auth/create", async (req, res) => {
  if (await findUser("username", req.body.username)) {
    res.status(409).json({ msg: "Username already exists" });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    movies = await DB.getMovies(movies);
    res.send({ user: user.username, movies: movies });
  }
});

apiRouter.post("/auth/login", async (req, res) => {
  const user = await findUser("username", req.body.username);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    user.token = uuid.v4();
    let movies = [];
    await DB.updateUser(user);
    movies = await DB.getMovies();
    setAuthCookie(res, user.token);
    res.send({ username: user.username, movies: movies });
  } else {
    res.status(401).json({ msg: "Invalid username or password" });
  }
});

apiRouter.delete("/auth/logout", async (req, res) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.sendStatus(204);
});

apiRouter.post("/movies/add", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ msg: "Title is required" });
  }

  try {
    const searchUrl = `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(
      title
    )}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!Array.isArray(data.description) || data.description.length === 0) {
      return res.status(404).json({ msg: "Movie not found in IMDb API" });
    }

    const addedMovies = [];
    movies = await DB.getMovies();

    for (const movieData of data.description) {
      const newMovie = {
        id: movies.length + 1 + addedMovies.length,
        title: movieData["#TITLE"] || "Unknown Title",
        description: `${movieData["#ACTORS"] || "No actors listed"}, ${
          movieData["#YEAR"] || "Unknown Year"
        }`,
        rating: 0.0,
        totalNumberOfRatings: 0,
        totalScore: 0,
        ratedBy: [],
      };

      const movieExists = movies.some(
        (movie) => movie.title === newMovie.title
      );
      if (!movieExists) {
        addedMovies.push(newMovie);
      }
    }
    await DB.addMovies(addedMovies);
    movies = await DB.getMovies();

    res.status(201).json({ msg: "Movies added successfully", movies: movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

apiRouter.post("/movies/update", async (req, res) => {
  const updatedMovie = req.body;

  if (!updatedMovie || !updatedMovie.id) {
    return res.status(400).json({
      msg: "Invalid request. Movie object with a valid ID is required.",
    });
  }

  const movieIndex = await DB.getMovieID(updatedMovie.id);

  if (movieIndex === -1) {
    return res.status(404).json({ msg: "Movie not found" });
  }

  await DB.updateMovie(updatedMovie);

  const movies = await DB.getMovies();

  res.status(200).json({ msg: "Movie updated", movies: movies });
});

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === "token") {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}

httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);
