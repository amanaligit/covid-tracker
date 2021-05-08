import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

// using react-hook-form library for form submission and validation.
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// using yup resolver to validate our form
import * as yup from "yup";

function Register() {
  // useState hook is used to create states for error and success of registeration.
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Our validation schema for form validation, strings in brackets are the error that are displayed if the requirement is not completed
  const schema = yup.object({
    fullname: yup.string().required("Name is required"),
    // automated email string verification:
    email: yup
      .string("invalid email")
      .email("invalid email")
      .required("email is required"),
    // password matched using custom regular expression
    password: yup
      .string()
      .min(8, "password is too weak")
      .matches(
        /^([a-zA-Z0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[*.!@$%^&(){}[])[A-Za-z\d@$!%*#?&]{8,24}$/,
        "Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character except the first character"
      )
      .required("password is required"),
    // phone number verification using regular-expression
    phone: yup.string().matches(/^[6-9]\d{9}$/, {
      message: "Please enter valid 10 digit phone-number.",
      excludeEmptyString: false,
    }),
    // check if the two passwords are same
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  // Using react hook form for easy form submission and validation, errors are displayed live as the state updates on change of any field
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  // POST request to server with credentials to register the user
  const registerUser = async (data) => {
    setError(null);
    setSuccess(false);
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/user`, data)
      .then((response) => {
        setSuccess(true);
        reset();
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  return (
    <div className="global-container">
      <div className="card login-form">
        <div className="card-body">
          <h3 className="card-title text-center">Register to Covid Tracker</h3>
          <div className="card-text">
            <form onSubmit={handleSubmit(registerUser)}>
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    dirtyFields.fullname
                      ? errors.fullname
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  id="fullname"
                  {...register("fullname")}
                />
                {errors.fullname && (
                  <div className="alert alert-danger mt-2">
                    <span>{errors.fullname.message}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  className={`form-control ${
                    dirtyFields.email
                      ? errors.email
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <div className="alert alert-danger mt-2">
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  className={`form-control ${
                    dirtyFields.phone
                      ? errors.phone
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  id="phone"
                  {...register("phone")}
                />
                {errors.phone && (
                  <div className="alert alert-danger mt-2">
                    <span>{errors.phone.message}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    dirtyFields.password
                      ? errors.password
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  id="password"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="alert alert-danger mt-2">
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirmation">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    dirtyFields.passwordConfirmation
                      ? errors.passwordConfirmation
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  id="passwordConfirmation"
                  {...register("passwordConfirmation")}
                />
                {errors.passwordConfirmation && (
                  <div className="alert alert-danger mt-2">
                    <span>{errors.passwordConfirmation.message}</span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <FaSignInAlt /> Sign up
              </button>

              {error && (
                <div className="alert alert-danger mt-2 text-center">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="alert alert-success mt-2 text-center">
                  <span>
                    Your account has been created successfully! Please login to
                    continue.
                  </span>
                </div>
              )}

              <div className="sign-up">
                Already have an account? <Link to="/login">Log in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
