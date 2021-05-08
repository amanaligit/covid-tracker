import React from "react";
import { FiLogOut } from "react-icons/fi";

// logout the user by removing the token stored in browser storage and changed the signed in statte to false
function Logout({ setSignedIn }) {
  const logout = () => {
    localStorage.removeItem("jwtToken");
    setSignedIn(false);
  };
  return (
    <div>
      <button
        className="btn mt-0 btn-danger"
        onClick={logout}
        style={{ fontSize: "1.25rem" }}
      >
        <FiLogOut />
        Logout
      </button>
    </div>
  );
}

export default Logout;
