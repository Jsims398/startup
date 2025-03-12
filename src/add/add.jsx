import React, { useState } from "react";
export function Add() {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    rating: 0.0,
    totalNumberOfRatings: 0,
    totalScore: 0,
    ratedBy: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movie.title.trim() || !movie.description.trim()) {
      return;
    }
  
    try {
      const response = await fetch("/api/movies/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
  
      if (response.ok) {
        const data = await response.json();  // Parse the response JSON
        setMovie({ title: "", description: "" });
      
        // Store updated movies list in localStorage
        localStorage.setItem("movies", data.movies ? JSON.stringify(data.movies) : "[]");
      }
      
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };
  

  return (
    <main className="container-fluid text-center">
      <div className="container mt-5">
        <h1 className="display-1 mb-4">Add Movie</h1>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="movie col-md-8">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="form-control bg-secondary text-light"
                value={movie.title}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                required
                className="form-control bg-secondary text-light"
                rows="5"
                value={movie.description}
                onChange={handleChange}
              ></textarea>
              <br />
            </div>
            <div className="col-md-4">
              <img
                src="AddMovieClip.png"
                alt="Movie projector illustration"
                className="img-fluid"
              />
            </div>
            <div className="col-md-8 padding">
              <button type="submit" className="btn btn-success px-4">
                Add Movie
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
