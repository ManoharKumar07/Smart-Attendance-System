import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../styles/viewAttendancepage.css";

const ViewAttendancePage = () => {
  const { id } = useParams(); // Get classid from URL parameters
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch attendance data
    const fetchAttendance = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/getattendacereport",
          { classid: id }
        );

        // Filter out duplicate dates
        const uniqueDates = new Set();
        const filteredReports = response.data.reports.filter((report) => {
          const date = new Date(report.date).toLocaleDateString();
          if (!uniqueDates.has(date)) {
            uniqueDates.add(date);
            return true;
          }
          return false;
        });

        setAttendanceData(filteredReports);
        console.log("report", filteredReports);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAttendance();
  }, [id]);

  const handleDateClick = (date) => {
    // Handle click event for a specific date
    console.log(`Clicked date: ${date}`);
  };

  return (
    <div className="container p-4">
      <div className="attendance-page-content mt-40 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-white text-center">
          All Attendances
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="attendance-list">
          {attendanceData.length === 0 ? (
            <p className="text-gray-500">No attendance records found.</p>
          ) : (
            attendanceData.map((record) => (
              <div
                key={record._id}
                className="attendance-item p-4 border rounded-lg mb-4 flex items-center justify-between"
              >
                <h2 className="text-xl font-semibold min-w-96">
                  {new Date(record.date).toLocaleDateString()}
                </h2>
                <div className="view-button bg-blue-500 text-white px-4 py-2 rounded">
                  <Link to={`/viewattendancepage/${id}/${record.date}`}>
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAttendancePage;
