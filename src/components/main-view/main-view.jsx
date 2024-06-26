import React, { useEffect, useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { NavigationBar } from "../navigation-bar/navigation-bar"
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SearchBar } from '../search-bar/search-bar';

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);




  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://justinsmoviedb-6d40ef42c02f.herokuapp.com/movies",
      {
        headers: {
          Authorization: `Bearer ${token}`
        },

      }
    )
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            title: movie.title,
            director: movie.director.name,
            image: movie.imageUrl,
            description: movie.description
          };
        });

        setMovies(moviesFromApi);
        setFilteredMovies(moviesFromApi);
      });
  }, [token]);

  const handleSearch = (searchTerm) => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear()
        }}
      />
      <Row className="justify-content-md-center">
        <Col>
          <SearchBar handleSearch={handleSearch} />
        </Col>
      </Row>


      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              user ? <Navigate to="/" /> : <Col md={5}><SignupView /></Col>
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <Col md={5}><LoginView onLoggedIn={(user) => setUser(user)} /></Col>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              !user ? <Navigate to="/login" replace /> : movies.length === 0 ? <Col>The list is empty!</Col> : <Col md={8}><MovieView movies={movies} /></Col>
            }
          />
          <Route
            path="/users/:userId"
            element={
              !user ? <Navigate to="/login" replace /> : movies.length === 0 ? <Col>The list is empty!</Col> : <Col md={8}><ProfileView movies={movies} user={user} onLoggedOut={() => { setUser(null); setToken(null); localStorage.clear(); }} /></Col>
            }
          />
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : movies.length === 0 ? (
                <Col>The list is empty!</Col>
              ) : (
                filteredMovies.map((movie) => (
                  <Col className="mb-4" key={movie.id} md={3}>
                    <MovieCard movie={movie} user={user} />
                  </Col>
                ))
              )
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
