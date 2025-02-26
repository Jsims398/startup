import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavButton_login = ({ text, onClick }) => {
  return (
    <button className="btn btn-success" onClick={onClick}>
      {text}
    </button>
  );
};

const NavButton_create = ({ text, onClick }) => {
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
      fetchMovies();
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
      fetchMovies();
      navigate("/home");
    }, 1000);
  };
  //API place holder
  const fetchMovies = () => {
    const mockMovies = [
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
    localStorage.setItem("movies", JSON.stringify(mockMovies));
  };

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
                  <NavButton_login text="Login" onClick={handleLogin} />
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
