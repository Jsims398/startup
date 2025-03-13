import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Login } from "./login/login";
import { Home } from "./home/home";
import { Add } from "./add/add";

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (!user) return;

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];

    const updateActivity = () => {
      setLastActivity(Date.now());
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    updateActivity();

    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    const inactivityCheckInterval = setInterval(() => {
      const lastActivityTime = parseInt(
        localStorage.getItem("lastActivity") || Date.now().toString()
      );
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivityTime;

      if (inactiveTime > 1800000 && user) {
        console.log("Session timeout due to inactivity");
        handleLogout();
      }
    }, 60000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(inactivityCheckInterval);
    };
  }, [user]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  function handleLogout() {
    fetch(`/api/auth/logout`, {
      method: "delete",
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("movies");
        localStorage.removeItem("lastActivity");
        // props.onLogout();
        // navigate("/");
      });
  }

  return (
    <BrowserRouter>
      <div className="app bg-dark text-light">
        <header className="container-fluid">
          <nav className="navbar top navbar-dark">
            <div className="navbar-brand">
              What to Watch<sup></sup>
            </div>
            <menu className="navbar-nav">
              <li className="nav-item">
                {!user && (
                  <NavLink className="nav-link" to="">
                    Login
                  </NavLink>
                )}
              </li>
              <li className="nav-item">
                {user && (
                  <NavLink className="nav-link" to="" onClick={handleLogout}>
                    Logout
                  </NavLink>
                )}
              </li>
              <li className="nav-item">
                {user && (
                  <NavLink className="nav-link" to="home">
                    Rate Movies
                  </NavLink>
                )}
              </li>
              <li className="nav-item">
                {user && (
                  <NavLink className="nav-link" to="add">
                    Add Movie
                  </NavLink>
                )}
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Login />} exact />
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="bg-dark text-white-50">
          <div className="container-fluid">
            <a
              href="https://github.com/Jsims398/startup/tree/main"
              class="text-light"
            >
              Jsims GitHub
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
