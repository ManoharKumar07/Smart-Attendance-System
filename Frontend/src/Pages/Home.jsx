import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div className="text-center m-20">
        <h1 className="text-3xl text-bold">Home Page</h1>
      </div>
      <div className="m-40 w-100 ">
        <Link to={"/createdataset"} className="p-5 bg-blue-300 ">
          Create Dataset
        </Link>
      </div>
      <div className="m-40 w-100 ">
        <Link to={"/takeattendance"} className="p-5 bg-blue-300 ">
          Take Attendance
        </Link>
      </div>
    </div>
  );
};

export default Home;
