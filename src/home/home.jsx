import React from "react";

export function Home() {
  return (
    <main className="container-fluid text-center">
      <div className="container mt-4">
        <div className="row mb-4">
          <h1 className="display-4 mb-3">Movie</h1>
          <div className="col-md-3 padding">
            <div className="row gap-2">
              <button className="btn btn-success row-2">Yes</button>
              <button className="btn btn-warning row-2">Maybe</button>
              <button className="btn btn-danger row-2">No</button>
            </div>
          </div>
          <div className="col-md-9 text-center">
            <div className="movie">
              <label for="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="form-control bg-secondary text"
              />
              <br />
              <label for="description">Description:</label>
              <textarea
                id="description"
                name="description"
                required
                className="form-control bg-secondary textarea"
              ></textarea>
              <br />
            </div>
          </div>
        </div>

        <h2 className="mb-3">Movies</h2>
        <div className="container my-5">
          <div id="myCarousel" className="carousel slide">
            <div className="carousel-inner"></div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#myCarousel"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#myCarousel"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div className="recommended-section">
          <h2>Recommended Movie</h2>
          <div className="row align-items-center">
            <div className="movie">
              <label for="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="form-control bg-secondary text"
              />
              <br />
              <label for="description">Description:</label>
              <textarea
                id="description"
                name="description"
                required
                className="form-control bg-secondary textarea"
              ></textarea>
              <br />
            </div>
            <div className="aline-btn-row">
              <button className="btn btn-success px-4">Next</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
