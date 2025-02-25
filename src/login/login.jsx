import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavButton_login = ({ text, onClick, disabled }) => {
  return (
    <button className="btn btn-success" onClick={onClick}>
      {text}
    </button>
  );
};

const NavButton_create = ({ text, onClick, disabled }) => {
  return (
    <button className="btn btn-secondary" onClick={onClick}>
      {text}
    </button>
  );
};

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    setTimeout(() => {
      const userData = {
        username: username,
        isAuthenticated: true,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/home");
    }, 1000);
  };

  const createAccount = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Enter username and password");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const userData = {
        username: username,
        isAuthenticated: true,
        isNewUser: true,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      existingUsers.push({
        username: username,
      });

      localStorage.setItem("users", JSON.stringify(existingUsers));
      navigate("/home");
    }, 1000);
  };

  return (
    <main className="container-fluid text-center">
      <div className="container">
        <div className="row min-vh-100 align-items-center">
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
                  <NavButton_login text="Login" onClick={handleLogin} Login />
                  <NavButton_create text="Create" onClick={createAccount} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
