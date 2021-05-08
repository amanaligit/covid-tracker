import axios from "axios";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { CgPlayListAdd } from "react-icons/cg";
import { TiDeleteOutline } from "react-icons/ti";

// using react-hook-form library for form submission and validation.
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// using yup resolver to validate our form
import * as yup from "yup";

function UpdateForm({ signedIn }) {
  const token = localStorage.getItem("jwtToken");

  // state that keeps the current number of entries in the form:
  const [numEntries, setnumEntries] = useState(1);

  // state the keeps the error message, if it happens during form submission.
  const [error, setError] = useState(null);

  // state whethe the form has been submitted successfullly
  const [success, setSuccess] = useState(false);

  // This state keeps the options for the dropdown list retrieved from the database from the backend using an API call.
  const [stateData, setStateData] = useState([]);

  // Our validation schema for form validation, strings in brackets are the error that are displayed if the requirement is not completed
  const schema = yup.object({
    entries: yup.array().of(
      yup.object().shape({
        state_id: yup
          .number("Please select a state")
          .typeError("Please select a state")
          .required("Please select a state"),
        newcases: yup
          .number()
          .positive("number must be positive")
          .typeError("you must specify a number")
          .required("Please enter a number"),
      })
    ),
  });

  // Using react hook form for easy form submission and validation, errors are displayed live as the state updates on change of any field
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // useEffect hook used to retrieve the list of all states to fill the options in the form
  useEffect(() => {
    // send the token in the request header for authentication.
    axios
      .get(`${process.env.REACT_APP_API_URL}api/states`, {
        headers: { "x-access-token": token },
      })
      .then((response) => {
        setStateData(response.data);
      })
      .catch((error) => {
        // if an error occurs, change the error state.
        setError(error?.response?.data?.message);
      });
  }, [token]);

  // form submission to backend
  const sendData = async (data) => {
    setSuccess(false);
    data.entries = data.entries.slice(0, numEntries);
    axios
      .post(`${process.env.REACT_APP_API_URL}api/data`, data.entries, {
        headers: { "x-access-token": token },
      })
      .then((response) => {
        // set success state to true and reset the form
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
        // reset form
        setnumEntries(1);
        reset();
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  };

  // if user is not logged in, redirect them to the login page (home page)
  if (!signedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="global-container">
      <div className="card update-form">
        <div className="card-body">
          <h3 className="card-title text-center">
            <CgPlayListAdd /> Add active COVID-19 cases:
          </h3>

          <div className="card-text">
            {success && (
              <div className="alert alert-success mb-4" role="alert">
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <strong>Success!</strong> Database has been updated successfully
              </div>
            )}

            <form onSubmit={handleSubmit(sendData)}>
              {/* dynamically update the form as the number of entries state changes (changed by user using the + - icon) */}
              {[...Array(numEntries).keys()].map((i) => (
                <div key={i} className="form-group">
                  <label>Entry: {i + 1} </label>
                  <select
                    name={`entries.${i}.state_id`}
                    {...register(`entries.${i}.state_id`)}
                    className={`form-control ${
                      errors.entries?.[i]?.state_id?.message ? "is-invalid" : ""
                    }`}
                  >
                    <option value={""}>Select State...</option>
                    {stateData.map((val, index) => (
                      <option key={index} value={val.state_id}>
                        {val.name}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="cases">Active Covid Cases:</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${
                      errors.entries?.[i]?.newcases?.message ? "is-invalid" : ""
                    }`}
                    placeholder="Enter active covid cases in this state"
                    id="cases"
                    name={`entries.${i}.newcases`}
                    {...register(`entries.${i}.newcases`)}
                  />
                  {errors.entries?.[i]?.newcases && (
                    <div className="alert alert-danger mt-2">
                      <span>{errors.entries?.[i]?.newcases?.message}</span>
                    </div>
                  )}
                </div>
              ))}

              <div className="row justify-content-center m-4">
                <button
                  className="btn btn-danger m-2"
                  type="button"
                  onClick={() => setnumEntries((n) => n + 1)}
                >
                  <CgPlayListAdd style={{ fontSize: "1.3rem" }} /> Add an Entry
                </button>
                {numEntries > 1 && (
                  <button
                    className="btn btn-danger m-2"
                    type="button"
                    onClick={() => setnumEntries((n) => n - 1)}
                  >
                    <TiDeleteOutline style={{ fontSize: "1.3rem" }} /> Remove
                    Entry
                  </button>
                )}
              </div>
              <p>
                *Click on add entry to insert multiple entries in the database
                in one go.
              </p>
              <button type="submit" className="btn btn-primary btn-block">
                Submit
              </button>
              {error && (
                <div className="alert alert-danger mt-2 text-center">
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateForm;
