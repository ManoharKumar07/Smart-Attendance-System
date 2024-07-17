import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ClassRoomDetails.css";
import CreateDataset from "../components/CreateDataset";

const ClassRoomDetails = () => {
  const { id } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/getclass",
          { id }, // Pass the ID in the request body
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setClassroom(response.data.classroom);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClassroomDetails();
  }, [id]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  return (
    <>
      <div className="container">
        <div className="details-card text-white flex ">
          <p>
            <strong>Classname:</strong> {classroom.classname}
          </p>
          <p>
            <strong>Department:</strong> {classroom.department}
          </p>
          <p>
            <strong>Subject:</strong> {classroom.subject}
          </p>
        </div>
      </div>
      <div>
        <CreateDataset classId={id} classname={classroom.classname} />
      </div>
    </>
  );
};

export default ClassRoomDetails;
