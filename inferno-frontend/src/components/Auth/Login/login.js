import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../redux/user.slice";
import { setError } from "../../../redux/error.slice";
import { useHistory } from "react-router-dom";
import qs from "qs";
import "../css/auth.css";
const axios = require("axios");

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = useSelector((state) => {
    return state.errorReducer.error;
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = qs.stringify({
      email: email,
      password: password,
    });

    axios
      .post("https://inferrno.azurewebsites.net/api/auth/login", data)
      .then((res) => {
        const userData = {
          email: res.data.user.email,
          uid: res.data.user._id,
          username: res.data.user.username,
        };
        dispatch(setUser(userData));
        dispatch(setError(null));
        if (res.data.success) {
          history.push("/");
        }
      })
      .catch((error) => {
        if (error.response) {
          dispatch(setError(error.response.data.error));
        }
      });
  };

  return (
    <div className="container">
      {/*if user gets registered and needs to display verification email message from the props*/}
      {props.location.state ? (
        <div className="message">
          <span>{props.location.state.message}</span>
        </div>
      ) : (
        ""
      )}

      <form>
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="">Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="enter email"
          />
          <span className="error">{error === null ? "" : error.email}</span>
        </div>
        <div className="form-group">
          <label htmlFor="">password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="enter password"
          />
          <span className="error">{error === null ? "" : error.password}</span>
        </div>

        <button
          id="submit-button"
          type="button"
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
        <p className="redirect">
          Don't have an account? <Link to="/Register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
