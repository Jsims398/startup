import React from "react";

export function Login() {
  return (
    <main className="container-fluid text-center">
      <div className="container">
        <div className="row min-vh-100 align-items-center">
          <div className="col-md-6">
            <h1 className="display-1">Watch with Me!</h1>
            <p className="text-secondary">The movie night helper!</p>
            <div className="movie-projector">
              <img
                src="public/movieclipart.png"
                alt="Movie projector illustration"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="login-form">
              <h2 className="mb-4">Login</h2>
              <form>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
                <button className="btn btn-success w-100 mb-3">Login</button>
                <button className="btn btn-info w-100">Create Account</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
