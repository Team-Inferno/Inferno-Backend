import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setError } from "../../../redux/error.slice";
import { useHistory } from "react-router-dom";
import qs from "qs";
import "../css/auth.css";
const axios = require("axios");

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const error = useSelector((state) => {
    return state.errorReducer.error;
  });

  const dispatch = useDispatch();
  const history = useHistory();


  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      dispatch(setError({ confirmPassword: "password doesn't match" }));
      return;
    }
    const data = qs.stringify({
      email: email,
      username: username,
      password: password,
    });

    axios
      .post(
        "https://inferrno.azurewebsites.net/http://localhost:8080/api/auth/register",
        data
      )
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.message);
          history.push("/login", { message: res.data.message });
        }
        dispatch(setError(null));
      })
      .catch((error) => {
        if (error.response) {
          dispatch(setError(error.response.data.error));
        }
      });
  };

  return (
    <div className="container">
      <form>
        <h1>Register</h1>
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
          <label htmlFor="">username</label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="enter username"
          />
          <span className="error">{error === null ? "" : error.username}</span>
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
        <div className="form-group">
          <label htmlFor="">Confirm password</label>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            placeholder="re-enter password"
          />
          <span className="error">
            {error === null ? "" : error.confirmPassword}
          </span>
        </div>
        <button
          id="submit-button"
          type="button"
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
        <p className="redirect">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
