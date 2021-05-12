import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Row, Col, Navbar, Button } from "react-bootstrap";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import { setMovies } from "../../actions/actions";
import MoviesList from '../movies-list/movies-list';
import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { RegistrationView } from "../registration-view/registration-view";
import { DirectorView } from "../director-view/director-view";
import { UpdateProfile } from "../update-profile/update-profile";
import { GenreView } from "../genre-view/genre-view";
import { ProfileView } from "../profile-view/profile-view";
import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';

import '../main-view/main-view.scss';

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
  }

  getMovies(token) {
    axios
      .get("https://paytonmoviedatabase.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    // <button onClick={() => { this.onLoggedOut() }}>Logout</button>
    // const { movies, user } = this.state;

    let { movies, visibilityFilter } = this.props;
    let { user } = this.state;

    // if (!user) return <Row>
    //   <Col>
    //     <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
    //   </Col>
    // </Row>
    // if (movies.length === 0) return <div className="main-view" />;

    return (
      <Router>
        <Navbar
          expand="lg"
          sticky="top"
          variant="btn-lg btn-dark btn-block"
          expand="lg"
          className="navbar shadow-sm mb-5"
        >
          <Navbar.Brand href="http://localhost:1234" className="navbar-brand">
            FlixNET
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            {/* <VisibilityFilterInput visibilityFilter={visibilityFilter} /> */}
            {!user ? (
              <ul>
                <Link to={`/`}>
                  <Button variant="link" className="navbar-link">
                    Sign In
                  </Button>
                </Link>
                <Link to={`/register`}>
                  <Button variant="link" className="navbar-link">
                    Register
                  </Button>
                </Link>
              </ul>
            ) : (
              <ul>
                <Link to={`/`}>
                  <Button
                    variant="link"
                    className="navbar-link"
                    onClick={() => this.logOut()}
                  >
                    Sign Out
                  </Button>
                </Link>
                <Link to={`/users/${user}`}>
                  <Button variant="link" className="navbar-link">
                    My Account
                  </Button>
                </Link>
                <Link to={`/`}>
                  <Button variant="link" className="navbar-link">
                    Movies
                  </Button>
                </Link>
                {/* <Link to={`/about`}>
                  <Button 
                    variant="link"
                    className="navbar-link"
                  >
                    About
                  </Button>
                </Link> */}
              </ul>
            )}
          </Navbar.Collapse>
        </Navbar>
        {/* <div className="movie-list-heading">
          <h1 id="myHeader">
            MOVIE LIST
          </h1>
        </div> */}
        <Row className="main-view justify-content-md-center">
          {/* <Route
            exact
            path="/"
            render={() => {
              if (!user)
                return (
                  <Col>
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  </Col>
                );
              return movies.map((m) => (
                <Col md={3} key={m._id}>
                  <MovieCard movie={m} />
                </Col>
              ));
            }}
          /> */}

          <Route exact path="/" render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              return <MoviesList movies={movies} />;
            }} />


          <Route
            path="/register"
            render={() => {
              if (user) return <Redirect to="/" />;
              return (
                <Col>
                  <RegistrationView />
                </Col>
              );
            }}
          />

          <Route
            exact
            path="/users/:userId"
            render={() => <ProfileView movies={movies} />}
          />

          <Route
            path="/update/:userId"
            render={() => {
              return <UpdateProfile />;
            }}
          />

          <Route
            path="/movies/:movieId"
            render={({ match }) => {
              return (
                <Col md={8}>
                  <MovieView
                    movie={movies.find((m) => m._id === match.params.movieId)}
                  />
                </Col>
              );
            }}
          />

          <Route
            path="/directors/:name"
            render={({ match }) => {
              if (movies.length === 0) return <div className="main-view" />;
              return (
                <Col md={8}>
                  <DirectorView
                    director={movies.find(
                      (m) => m.Director.Name === match.params.name
                    )}
                    movies={movies}
                  />
                </Col>
              );
            }}
          />

          <Route
            path="/genres/:name"
            render={({ match }) => {
              if (movies.length === 0) return <div className="main-view" />;
              return (
                <Col md={8}>
                  <GenreView
                    genre={movies.find(
                      (m) => m.Genre.Name === match.params.name
                    )}
                    movies={movies}
                  />
                </Col>
              );
            }}
          />
        </Row>
      </Router>
    );
  }
}

// #7
let mapStateToProps = state => {
  return { movies: state.movies }
}

// #8
export default connect(mapStateToProps, { setMovies } )(MainView);