import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Button } from "antd";
import { usercontext } from "../context/user-context";
import "../styles/YourClassroom.css";
import { Link } from "react-router-dom";

const YourClassroom = () => {
  const { user } = useContext(usercontext);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/getclassroom",
          { email: user.email } // Send email in the request body
        );
        setClassrooms(response.data.classrooms); // Assuming response.data.classrooms is an array of classrooms
      } catch (error) {
        console.error("Error fetching classrooms:", error.message);
      }
    };

    fetchClassrooms();
  }, [user.email]);

  return (
    <div className="container">
      <div className="your-classrooms mt-56">
        {classrooms.map((classroom) => (
          <Link to={`/yourclassroom/${classroom._id}`} key={classroom._id}>
            <Card
              className="card"
              title={<span className="card-title">{classroom.classname}</span>}
            >
              <div className="card-content">
                <p>
                  <strong>Department:</strong> {classroom.department}
                </p>
                <p>
                  <strong>Subject:</strong> {classroom.subject}
                </p>
              </div>
              <div className="card-actions space-x-5">
                <Link to={`/viewattendancepage/${classroom._id}`}>
                  <Button type="primary">View Attendance</Button>
                </Link>
                <Link to={`/yourclassroom/takeattendance/${classroom._id}`}>
                  <Button type="primary">Take Attendance</Button>
                </Link>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default YourClassroom;
