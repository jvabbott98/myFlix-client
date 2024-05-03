import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { MovieCard } from '../movie-card/movie-card';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import './profile-view.scss';
import Form from "react-bootstrap/Form";

export const ProfileView = ({ user, movies, onLoggedOut }) => {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const { userId } = useParams();
  const formattedDate = new Date(user.birthday).toLocaleDateString();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  useEffect(() => {
    // Filter the movies array based on favoriteMovies IDs
    const filteredMovies = movies.filter(movie => user.favoriteMovies.includes(movie.id));
    setFavoriteMovies(filteredMovies);
  }, [movies, user.favoriteMovies]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password,
      email: email,
      birthday: birthday
    };
    fetch(`https://justinsmoviedb-6d40ef42c02f.herokuapp.com/users/${user.username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        alert("Update Successfull");
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
        alert("Update Failed");
      }
    });

  }

  const handleDelete = () => {
    fetch(`https://justinsmoviedb-6d40ef42c02f.herokuapp.com/users/${user.username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        alert("User Was Deleted");
        onLoggedOut();
      }
      })
    
  }



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

      <div className="updateUser">

        <Form onSubmit={handleSubmit} className="form">
          <h1 className="formHeader">Update User Information</h1>
          <Form.Group controlId="formUsernameSignup">
            <Form.Label>Username: </Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
            />
          </Form.Group>

          <Form.Group controlId="formPasswordSignup">
            <Form.Label>Password: </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmailSignup">
            <Form.Label>Email: </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBirthdaySignup">
            <Form.Label>Birthday: </Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </Form.Group>
          <button variant="primary" type="submit">Submit</button>
        </Form>
      </div>

      <div className="favoriteMoviesList">
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

      <div className="deregister">
        <Button variant="primary" onClick={handleDelete}>
          Delete My Account
        </Button>
      </div>
    </div>

  )
}