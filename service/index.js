const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
const app = express();

const authCookieName = "token";

let users = [];
let movies = [
  {
    id: 1,
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
    rating: 4.8,
    totalNumberOfRatings: 100,
    totalScore: 480,
    ratedBy: [],
  },
  {
    id: 2,
    title: "The Matrix",
    description: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    rating: 4.7,
    totalNumberOfRatings: 90,
    totalScore: 423,
    ratedBy: [],
  },
  {
    id: 3,
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: 4.6,
    totalNumberOfRatings: 80,
    totalScore: 368,
    ratedBy: [],
  },
];

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

var apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.post("/auth/create", async (req, res) => {
  if (await findUser("username", req.body.username)) {
    res.status(400).json({ msg: "Username already exists" });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ user: user });
  }
});

apiRouter.post("/auth/login", async (req, res) => {
  const user = await findUser("username", req.body.username);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user.token);
    res.send({ user: user, movies: movies });
  } else {
    res.status(400).json({ msg: "Invalid username or password" });
  }
});

apiRouter.post("/auth/logout", async (req, res) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.sendStatus(204);
});

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});