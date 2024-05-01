import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { MovieCard } from '../movie-card/movie-card';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';

export const ProfileView = ({ user, movies }) => {
  const { userId } = useParams();
  const formattedDate = new Date(user.birthday).toLocaleDateString();
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    // Filter the movies array based on favoriteMovies IDs
    const filteredMovies = movies.filter(movie => user.favoriteMovies.includes(movie.id));
    setFavoriteMovies(filteredMovies);
  }, [movies, user.favoriteMovies]);

  return (
    <div>
      <div className="userInfo">
        <div>
          {`Username: ${user.username}`}
        </div>
        <div>
          {`Email: ${user.email}`}
        </div>
        <div>
          {`Birthday: ${formattedDate}`}
        </div>
      </div>
      <div className="deregister">
        <Button variant="primary" type="submit">
          Delete My Account
        </Button>
      </div>
      <div className="movieList">
        <div>
          <>
            {favoriteMovies.map((movie) => (
              <Col className="mb-4" key={movie.id} md={3}>
                <MovieCard
                  movie={movie}
                  user={user}
                />
              </Col>
            ))}
          </>
        </div>
      </div>


      <Link to={`/`}>
        <button className="back-button">Back</button>
      </Link>
    </div>

  )
}