import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="home mt-36">
        <div>
          <h1 className=" font-bold">
            Welcome to the Smart Attendance System! This system leverages the
            power of computer vision and machine learning to automate the
            attendance process. By using a webcam to capture images of students,
            the system can recognize faces and mark attendance automatically.
            This not only saves time but also reduces errors and ensures
            accurate record-keeping.
          </h1>
        </div>

        <div className="button-container">
          <div>
            <Link to={"/createdataset"} className="p-5 bg-blue-300">
              Create Dataset
            </Link>
          </div>
          <div>
            <Link to={"/takeattendance"} className="p-5 bg-blue-300">
              Take Attendance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
