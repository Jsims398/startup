import React from "react";

export function Add() {
  return (
    <main className="container-fluid text-center">
      <div className="container mt-5">
        <h1 className="display-1 mb-4">Movie</h1>
        <div className="row">
          <div className="movie col-md-8">
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
          <div className="col-md-4">
            <img src="AddMovieClip.png" alt="Movie projector illustration" className="img-fluid"/>
          </div>
          <div className="col-md-8 padding">
            <button className="btn btn-success px-4">Add</button>
          </div>
        </div>
      </div>
    </main>
  );
}
