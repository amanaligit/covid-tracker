// The main component, all other components are imported from the components folder.

import { useState } from "react";
import "./App.css";
import Login from "./components/login";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Register from "./components/Register";
import UpdateForm from "./components/UpdateForm";
import Navbar from "./components/Navbar";

function App(props) {
  // state that keeps the information whether the user is signed in or not, if the browser storage already contains an authentication token, the user is logged in.
  const [signedIn, setSignedIn] = useState(
    localStorage.getItem("jwtToken") !== null
  );

  return (
    <div style={{ height: "100%" }}>
      {/* using browserRouter to swich between our pages*/}
      <BrowserRouter>
        <Navbar signedIn={signedIn} setSignedIn={setSignedIn} />

        <div className="app">
          <Switch>
            {/* route to homepage which is just the login page */}
            <Route
              path="/"
              exact
              component={() => (
                <Login signedIn={signedIn} setSignedIn={setSignedIn} />
              )}
            />

            {/* route to register new user */}
            <Route
              path="/register"
              exact
              component={() => <Register signedIn={signedIn} />}
            />

            {/* route to the form that is used to update the db. This route is protected */}
            <Route
              path="/update-form"
              exact
              component={() => <UpdateForm signedIn={signedIn} />}
            />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
