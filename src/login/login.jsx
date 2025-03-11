import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { MessageDialog } from "./messageDialog";

export function Login(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(props.username || "");
  const [password, setPassword] = useState("");
  const [displayError, setDisplayError] = useState(null);

  async function loginUser() {
    loginOrCreate("/api/auth/login");
  }

  async function createAccountAPI() {
    loginOrCreate("/api/auth/create");
  }

  async function loginOrCreate(endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(username));
        localStorage.setItem("movies", data.movies? JSON.stringify(data.movies) : "[]" );
        // props.onLogin(username);
        navigate("/home");
      } else {
        const body = await response.json();
        setDisplayError(`⚠ Error: ${body.msg}`);
      }
    } catch (error) {
      setDisplayError(`⚠ Error: ${error.message}`);
    }
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <main className="container-fluid text-center">
      <div className="container">
        <div className="row min-vh-80 align-items-center">
          <div className="col-md-6">
            <h1 className="display-1">Watch with Me!</h1>
            <p className="text-secondary">The movie night helper!</p>
            <div className="movie-projector">
              <img
                src="movieclipart.png"
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-2 justify-content-center">
                  <Button
                    variant="primary"
                    onClick={() => loginUser()}
                    disabled={!username || !password}
                  >
                    Login
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => createAccountAPI()}
                    disabled={!username || !password}
                  >
                    Create
                  </Button>
                </div>
                <MessageDialog
                  message={displayError}
                  onHide={() => setDisplayError(null)}
                />
              </form>
              {displayError && <p className="text-danger">{displayError}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
