import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";

// using react-hook-form library for form submission and validation.
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// using yup resolver to validate our form
import * as yup from "yup";

function Login({ setSignedIn, signedIn }) {
  // set error state from useState hook to display the error
  const [error, setError] = useState(null);

  // login the user by api call to the auth/login route
  const login = async (data) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/login`, data)
      .then((response) => {
        // store the token in browser storage for future use to access protected routes and change the signed in state
        localStorage.setItem("jwtToken", response?.data?.token);
        setSignedIn(true);
      })
      .catch((error) => {
        setError(error.response?.data?.message);
      });
  };

  // initialeze the validation schema to verify our form. This just checks that the fields are not empty before sending the form data
  const schema = yup.object({
    email: yup.string().email("invalid email").required("email is required"),
    password: yup.string().required("password is required"),
  });

  // Using react hook form for easy form submission and validation, errors are displayed live as the state updates on change of any field
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // if user is already signed in, redirect them to the protected route.
  if (signedIn) {
    return <Redirect to="/update-form" />;
  }

  return (
    <div className="global-container">
      <div className="card login-form">
        <div className="card-body">
          <h3 className="card-title text-center ">Log in to Covid Tracker</h3>
          <div className="card-text">
            <form onSubmit={handleSubmit(login)}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  {...register("email")}
                />
                {errors?.email && (
                  <div className="alert alert-danger mt-2">
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  id="exampleInputPassword1"
                  {...register("password")}
                />
                {errors?.password && (
                  <div className="alert alert-danger mt-2">
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>
              {error && (
                <div className="alert alert-danger mt-2 text-center">
                  <span>{error}</span>
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-block">
                <FaSignInAlt /> Sign in
              </button>
              <div className="sign-up">
                Don't have an account? <Link to="register">Create One</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
