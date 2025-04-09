import React, { useState, useEffect } from "react";
import { MovieEvent, MovieNotifier } from "./movieNotifier.js";

export function Home() {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    rating: 0.0,
    totalNumberOfRatings: 0,
    totalScore: 0,
    ratedBy: [],
  });

  const [recommendedMovie, setRecommendedMovie] = useState({
    title: "",
    description: "",
    rating: 0.0,
  });

  const [allMovies, setAllMovies] = useState([]);
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchNextUnratedMovie();
    fetchAllMovies();
    fetchRecommendedMovie();

    const handleMovieEvent = (event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
    };

    MovieNotifier.addHandler(handleMovieEvent);

    const interval = setInterval(() => {
      fetchRecommendedMovie();
    }, 5000);

    return () => {
      clearInterval(interval);
      MovieNotifier.removeHandler(handleMovieEvent);
    };
  }, []);

  const getMovies = async () => {
    try {
      const response = await fetch("/api/movies/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.movies && data.movies.length > 0) {
          localStorage.setItem("movies", JSON.stringify(data.movies));
        } else {
          console.log("No movies found, local storage remains unchanged.");
        }
      } else {
        console.error("Failed to fetch movies:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleRating = async (score) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    getMovies();
    const { _id, ...updatedMovie } = {
      ...movie,
      totalScore: movie.totalScore + score,
      totalNumberOfRatings: movie.totalNumberOfRatings + 1,
      ratedBy: [...movie.ratedBy, currentUser],
    };

    updatedMovie.rating = parseFloat(
      (updatedMovie.totalScore / updatedMovie.totalNumberOfRatings).toFixed(1)
    );

    try {
      const response = await fetch("/api/movies/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMovie),
      });

      if (!response.ok) {
        console.error("Failed to update movie on server");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
    }

    const ratingText =
      score === 5 ? "liked" : score === 3 ? "might watch" : "disliked";
    const message = `${ratingText} "${movie.title}"`;

    MovieNotifier.broadcastEvent(currentUser, MovieEvent.Rating || "rating", {
      movie: movie.title,
      score,
      message,
    });

    saveMovieToLocalStorage(updatedMovie);
    fetchNextUnratedMovie();
  };

  const handleYesRating = () => handleRating(5);
  const handleMaybeRating = () => handleRating(3);
  const handleNoRating = () => handleRating(1);

  const fetchNextUnratedMovie = () => {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");
    const nextMovie = movies.find(
      (movie) =>
        !movie.ratedBy || !movie.ratedBy.some((user) => user === currentUser)
    );
    if (nextMovie) {
      const movieWithDefaults = {
        ...nextMovie,
        rating: nextMovie.rating || 0,
        totalNumberOfRatings: nextMovie.totalNumberOfRatings || 0,
        totalScore: nextMovie.totalScore || 0,
        ratedBy: nextMovie.ratedBy || [],
      };
      setMovie(movieWithDefaults);
    } else {
      setMovie({
        title: "No more movies to rate!",
        description: "You've rated all available movies.",
        rating: 0,
        totalNumberOfRatings: 0,
        totalScore: 0,
        ratedBy: [],
      });
    }
  };

  const saveMovieToLocalStorage = (updatedMovie) => {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");
    const updatedMovies = movies.map((m) =>
      m.id === updatedMovie.id ? updatedMovie : m
    );
    localStorage.setItem("movies", JSON.stringify(updatedMovies));
    setAllMovies(updatedMovies);
  };

  const fetchAllMovies = () => {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");
    setAllMovies(movies);
  };

  const fetchRecommendedMovie = () => {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");
    const ratedMovies = movies.filter(
      (movie) =>
        movie.ratedBy && movie.ratedBy.some((user) => user.name === currentUser)
    );
    if (ratedMovies.length > 0) {
      const topRated = [...ratedMovies].sort((a, b) => b.rating - a.rating)[0];
      setRecommendedMovie(topRated);
    } else if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setRecommendedMovie(movies[randomIndex]);
    } else {
      setRecommendedMovie({
        title: "No recommendations available",
        description: "Rate some movies to get recommendations!",
        rating: 0,
      });
    }
  };

  const createMessageArray = () => {
    getMovies();
    return events.map((event, index) => {
      let message = "unknown event";
      const userName =
        typeof event.from === "string" ? event.from.split("@")[0] : event.from;

      if (event.value && event.value.msg) {
        message = event.value.msg;
      } else if (event.value && event.value.message) {
        message = event.value.message;
      } else if (
        event.rating === MovieEvent.Rating ||
        event.rating === "rating"
      ) {
        message = event.value
          ? event.value.message || `rated a movie ${event.value.score || ""}`
          : "rated a movie";
      } else if (
        event.rating === MovieEvent.System ||
        event.rating === "system"
      ) {
        message = event.value
          ? event.value.msg || "system event"
          : "system event";
      }

      return (
        <div key={index} className="event">
          <span className="player-event">{userName}</span> {message}
        </div>
      );
    });
  };

  return (
    <main className="container-fluid text-center">
      <div className="container mt-4">
        <div className="row mb-4">
          <h2 className="mb-3">Rate This Movie</h2>
          <div className="col-md-3 padding">
            <div className="row gap-2">
              <button
                className="btn btn-success row-2"
                onClick={handleYesRating}
              >
                Yes
              </button>
              <button
                className="btn btn-warning row-2"
                onClick={handleMaybeRating}
              >
                Maybe
              </button>
              <button className="btn btn-danger row-2" onClick={handleNoRating}>
                No
              </button>
            </div>
          </div>
          <div className="col-md-9 text-center">
            <div className="movie">
              <label htmlFor="current-title">Title:</label>
              <input
                type="text"
                id="current-title"
                name="title"
                value={movie.title}
                readOnly
                className="form-control bg-secondary text"
              />
              <br />
              <label htmlFor="current-description">Actors:</label>
              <textarea
                id="current-description"
                name="description"
                value={movie.description}
                readOnly
                className="form-control bg-secondary textarea"
              ></textarea>
              <br />
              {movie.rating > 0 && (
                <p>
                  Current Rating: {movie.rating} ({movie.totalNumberOfRatings}{" "}
                  ratings)
                </p>
              )}
            </div>
          </div>
        </div>
        <h2 className="mb-3">All Movies</h2>
        <div className="container my-5">
          <MovieCarousel allMovies={allMovies} />
        </div>
        <div className="recommended-section">
          <h2>Recommended Movie</h2>
          <div className="row align-items-center">
            <div className="movie">
              <label htmlFor="recommended-title">Title:</label>
              <input
                type="text"
                id="recommended-title"
                name="title"
                value={recommendedMovie.title}
                readOnly
                className="form-control bg-secondary text"
              />
              <br />
              <label htmlFor="recommended-description">Actors:</label>
              <textarea
                id="recommended-description"
                name="description"
                value={recommendedMovie.description}
                readOnly
                className="form-control bg-secondary textarea width:75%"
              ></textarea>
              <br />
              {recommendedMovie.rating > 0 && (
                <p>Rating: {recommendedMovie.rating}/5</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <h3>User Activity</h3>
        </div>
        <div className="card mt-4 mb-4 bg-secondary border-2 border-white">
          <div className="text-white">
            <span className="player-name text-muted">
              Current User: {currentUser}
            </span>
          </div>
          <div className="card-body">
            <div id="player-messages" className="message-container">
              {events.length === 0 ? (
                <p className="text-muted">No activity yet. Rate some movies!</p>
              ) : (
                createMessageArray()
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function MovieCarousel({ allMovies }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextItem = (step) => {
    if (allMovies.length === 0) return;
    const nextIndex =
      (currentIndex + step + allMovies.length) % allMovies.length;
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="carousel slide">
      <div className="carousel-inner">
        {allMovies.length === 0 ? (
          <div className="carousel-item active">
            <p>No movies available</p>
          </div>
        ) : (
          allMovies.map((m, index) => (
            <div
              key={m.id || index}
              className={`carousel-item ${
                index === currentIndex ? "active" : ""
              }`}
            >
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <p>Rating: {m.rating || "Not yet rated"}</p>
            </div>
          ))
        )}
      </div>
      {allMovies.length > 1 && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            onClick={() => nextItem(-1)}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            onClick={() => nextItem(1)}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
          </button>
        </>
      )}
    </div>
  );
}
