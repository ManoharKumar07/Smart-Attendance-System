import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Button, Pagination } from "antd";
import { usercontext } from "../context/user-context";
import "../styles/YourClassroom.css";

const YourClassroom = () => {
  const { user } = useContext(usercontext);
  const [classrooms, setClassrooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of items per page

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/getclassroom",
          { email: user.email }, // Send email in the request body
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setClassrooms(response.data.classrooms); // Assuming response.data.classrooms is an array of classrooms
      } catch (error) {
        console.error("Error fetching classrooms:", error.message);
      }
    };

    fetchClassrooms();
  }, [user.email]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = classrooms.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-white text-center"></h2>
      <div className="your-classrooms text-white">
        {currentItems.map((classroom) => (
          <Card
            key={classroom._id}
            className="card"
            title={<span className="card-title">{classroom.classname}</span>} // Custom title styling
          >
            <div className="card-content">
              <p>
                <strong>Department:</strong> {classroom.department}
              </p>
              <p>
                <strong>Subject:</strong> {classroom.subject}
              </p>
            </div>
            <div className="card-actions">
              <Button type="primary">View Attendance</Button>
              <Button type="primary">Take Attendance</Button>
            </div>
          </Card>
        ))}
      </div>
      <div>
        {classrooms.length > itemsPerPage && (
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={classrooms.length}
              pageSize={itemsPerPage}
              onChange={paginate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default YourClassroom;
