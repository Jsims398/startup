const { MongoClient } = require("mongodb");
const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db("movieDB");
const userCollection = db.collection("users");
const movieCollection = db.collection("movies");

async function connect() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.log(
      `Unable to connect to database with ${url} because ${ex.message}`
    );
    process.exit(1);
  }
}

function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  return await userCollection.insertOne(user);
}

async function updateUser(user) {
  return await userCollection.updateOne(
    { username: user.username },
    { $set: user }
  );
}

async function getMovies() {
  return await movieCollection.find().toArray();
}

async function getMovieID(id) {
  const movies = await getMovies();
  return movies.findIndex((movie) => movie.id === id);
}

async function addMovies(moviesArray) {
  if (!Array.isArray(moviesArray) || moviesArray.length === 0) {
    return;
  }
  return await movieCollection.insertMany(moviesArray);
}

async function addMovie(movie) {
  return await movieCollection.insertOne(movie);
}

async function updateMovie(movie) {
  return await movieCollection.updateOne({ id: movie.id }, { $set: movie });
}

module.exports = {
  connect,
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  getMovies,
  getMovieID,
  addMovie,
  addMovies,
  updateMovie,
};
