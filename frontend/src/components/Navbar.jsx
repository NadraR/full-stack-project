import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ isLoggedIn, userData, handleLogout }) {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  // Unified pill button style for all nav items
  const pillBtn = {
    borderRadius: "999px",
    padding: "8px 22px",
    fontWeight: 600,
    fontSize: "1rem",
    border: "none",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(102,126,234,0.15)",
    transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
    margin: "0 6px",
    cursor: "pointer",
    outline: "none"
  };

  const pillBtnHover = {
    ...pillBtn,
    // Keep the same background and color as default
    // Only add lift and stronger shadow
    boxShadow: "0 8px 32px rgba(102,126,234,0.22)",
    transform: "translateY(-2px)"
  };

  const brandStyle = {
    fontWeight: 900,
    fontSize: "2rem",
    letterSpacing: "-1px",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent",
    textShadow: isDarkMode
      ? "0 2px 8px rgba(31,38,135,0.18)"
      : "0 2px 8px rgba(102,126,234,0.10)",
    margin: 0
  };

  // Helper for hover effect
  const handleHover = (e, hover) => {
    Object.assign(e.target.style, hover ? pillBtnHover : pillBtn);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{
      background: isDarkMode
        ? "linear-gradient(120deg, rgba(40,38,60,0.95) 60%, rgba(120,119,198,0.15) 100%)"
        : "linear-gradient(120deg, rgba(255,255,255,0.95) 60%, rgba(102,126,234,0.10) 100%)",
      backdropFilter: "blur(24px)",
      borderBottom: isDarkMode
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(0,0,0,0.08)",
      boxShadow: isDarkMode
        ? "0 8px 32px 0 rgba(31,38,135,0.25)"
        : "0 8px 32px 0 rgba(102,126,234,0.08)",
      borderRadius: "0 0 32px 32px",
      margin: "16px 24px 32px 24px",
      padding: 0,
      zIndex: 1000
    }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand mx-auto order-lg-2" to="/" style={brandStyle}>
          🚀 CrowdSpark
        </Link>
        <button
          className="navbar-toggler order-lg-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: "none",
            background: "rgba(102,126,234,0.12)",
            borderRadius: "12px",
            padding: "6px 12px"
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse order-lg-3" id="navbarNav">
          <ul className="navbar-nav mx-auto align-items-center gap-lg-2">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to="/"
                style={pillBtn}
                onMouseEnter={e => handleHover(e, true)}
                onMouseLeave={e => handleHover(e, false)}
              >
                🏠 Home
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link fw-semibold"
                style={pillBtn}
                onClick={() => handleProtectedClick("/create-project")}
                onMouseEnter={e => handleHover(e, true)}
                onMouseLeave={e => handleHover(e, false)}
              >
                ➕ Create Project
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link fw-semibold"
                style={pillBtn}
                onClick={() => handleProtectedClick("/my-projects")}
                onMouseEnter={e => handleHover(e, true)}
                onMouseLeave={e => handleHover(e, false)}
              >
                📋 My Projects
              </button>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span
                    style={{ 
                      ...pillBtn,
                      minWidth: 120,
                      display: "inline-block",
                      textAlign: "center",
                      cursor: "default"
                    }}
                    className="nav-link"
                  >
                    👤 {userData?.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn"
                    onClick={handleLogoutAndRedirect}
                    style={pillBtn}
                    onMouseEnter={e => handleHover(e, true)}
                    onMouseLeave={e => handleHover(e, false)}
                  >
                     Logout
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn"
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    style={{
                      ...pillBtn,
                      width: 44,
                      height: 44,
                      padding: 0,
                      fontSize: "1.3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={e => handleHover(e, true)}
                    onMouseLeave={e => handleHover(e, false)}
                  >
                    {isDarkMode ? "☀️" : "🌙"}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link fw-semibold"
                    to="/login"
                    style={pillBtn}
                    onMouseEnter={e => handleHover(e, true)}
                    onMouseLeave={e => handleHover(e, false)}
                  >
                    🔐 Login
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn"
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    style={{
                      ...pillBtn,
                      width: 44,
                      height: 44,
                      padding: 0,
                      fontSize: "1.3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={e => handleHover(e, true)}
                    onMouseLeave={e => handleHover(e, false)}
                  >
                    {isDarkMode ? "☀️" : "🌙"}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
} 