
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export const MovieCard = ({ movie, user }) => {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken ? storedToken : null);


  const handleSubmit = (event) => {
    if (!user.favoriteMovies.includes(movie.id)) {
      event.preventDefault();

      fetch(`https://justinsmoviedb-6d40ef42c02f.herokuapp.com/users/${user.username}/movies/${movie.id}`, {
        method: "POST",
        body: movie.id,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        if (response.ok) {
          alert("Movie added to favorites");
          fetch(`https://justinsmoviedb-6d40ef42c02f.herokuapp.com/users/${user.username}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
          ).then((response) => response.json())
            .then((data) => {
              localStorage.setItem("user", JSON.stringify(data));
              window.location.reload();
            })
        } else {
          alert("Favorite failed");
        }
      }).catch((error) => {
        console.error("Error:", error);
        alert("An error occurred, please try again.");
      });
    } else {
      event.preventDefault();

      fetch(`https://justinsmoviedb-6d40ef42c02f.herokuapp.com/users/${user.username}/movies/${movie.id}`, {
        method: "DELETE",
        body: movie.id,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        if (response.ok) {
          alert("Movie removed from favorites");
          fetch(`https://justinsmoviedb-6d40ef42c02f.herokuapp.com/users/${user.username}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
          ).then((response) => response.json())
            .then((data) => {
              localStorage.setItem("user", JSON.stringify(data));
              window.location.reload();
            })
        } else {
          alert("Favorite failed to remove");
        }
      }).catch((error) => {
        console.error("Error:", error);
        alert("An error occurred, please try again.");
      });
    }

  }
  return (
    <Card>
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.author}</Card.Text>

        <>
          {!user.favoriteMovies.includes(movie.id) ? (
             <Button variant="primary" onClick={handleSubmit}>
             Favorite
           </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
             Remove Favorite
           </Button>
          )}
        </>


        {/* <Button variant="primary" onClick={handleSubmit}>
          Favorite
        </Button> */}
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button variant="link">Open</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};


MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    director: PropTypes.string
  }).isRequired,
  // onMovieClick: PropTypes.func.isRequired
};