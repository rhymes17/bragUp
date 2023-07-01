import React from "react";

function Loader() {
  return (
    <div className="loader-container flex justify-center items-center min-h-screen">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
