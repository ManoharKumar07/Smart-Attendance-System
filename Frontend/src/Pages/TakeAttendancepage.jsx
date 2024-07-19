import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactWebcam from "react-webcam";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/TakeAttendancepage.css";

const TakeAttendancepage = () => {
  const { id } = useParams();
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [detectedName, setDetectedName] = useState("");
  const [detectedRollNumber, setDetectedRollNumber] = useState("");
  const [detectedEmail, setDetectedEmail] = useState("");
  const [classroomName, setClassroomName] = useState("");
  const [students, setStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  // attendance report
  const [allstudents, setallStudents] = useState([]);
  const [reportlength, setReportLength] = useState(1);
  const webcamRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/student/getstudentenr",
        {
          classid: id,
        }
      );

      setallStudents(response.data.data);
      console.log("Fetched students:", allstudents);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  useEffect(() => {
    const createattendancereport = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/createattendancereport",
          { classid: id, session: 1, attendance: allstudents }
        );
        console.log("First session report created");
      } catch (error) {
        console.log("Error creating attendance document:", error);
      }
    };
    createattendancereport();
  }, [allstudents]);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };
  useEffect(() => {
    const lengthreport = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/getreportlength",
          { id }
        );

        setReportLength(response.data.data);
      } catch (error) {
        console.log("Error in fetchin report length", error);
      }
    };
    lengthreport();
  }, [isWebcamOn]);

  useEffect(() => {
    const fetchClassroomName = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/getclass",
          { id }
        );
        setClassroomName(response.data.classroom.classname);
      } catch (error) {
        console.error("Error fetching classroom:", error.message);
      }
    };

    fetchClassroomName();
  }, [id]);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/detectface/",
          {
            image: imageSrc,
          }
        );
        const name = response.data.name || "No face detected";
        const rollNumber = response.data.roll_number || "No roll number found";
        const email = response.data.email || "No email found";
        setDetectedName(name);
        setDetectedRollNumber(rollNumber);
        setDetectedEmail(email);

        if (
          name !== "No face detected" &&
          rollNumber !== "No roll number found"
        ) {
          setStudents((prevStudents) => {
            const studentExists = prevStudents.some(
              (student) => student.roll_number === rollNumber
            );
            if (!studentExists) {
              return [...prevStudents, { name, roll_number: rollNumber }];
            }
            return prevStudents;
          });
        }
      } catch (error) {
        console.error("Error sending image to backend:", error);
      }
    }
  }, [webcamRef]);

  useEffect(() => {
    let intervalId;
    if (isWebcamOn) {
      intervalId = setInterval(capture, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isWebcamOn, capture]);

  const toggleWebcam = () => {
    setIsWebcamOn((prevIsWebcamOn) => !prevIsWebcamOn);
    setDetectedName("");
    setDetectedRollNumber("");
    setDetectedEmail("");
  };

  const TrainModel = async () => {
    console.log("TrainModel called");
    console.log(classroomName);
    try {
      await axios.post("http://127.0.0.1:8000/api/retrainmodel/", {
        classroom_name: classroomName,
      });
      console.log("Model retrained successfully");
    } catch (error) {
      console.error("Error retraining the model:", error);
    }
  };

  useEffect(() => {
    if (isWebcamOn) {
      TrainModel();
    }
  }, [isWebcamOn]);

  const calltwofunc = () => {
    toggleWebcam();
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold  text-white  mb-24 mt-40">
        Take Attendance
      </h1>
      <div className="flex flex-row justify-center items-start space-x-40 min-h-96 mb-80">
        {/* Left column: Student list */}
        <div className="w-1/2 pr-4">
          <div className="students-list">
            <h2>Attendance Marked for</h2>
            <ul>
              {students.map((student) => (
                <li key={student.roll_number}>
                  {student.name} - {student.roll_number}
                </li>
              ))}
            </ul>
            {fetchingStudents && <p>Loading students...</p>}
          </div>
        </div>

        {/* Right column: Webcam and detected information */}
        <div className="w-1/2 pl-4">
          <div>
            {isWebcamOn && (
              <div className="mb-4">
                <ReactWebcam
                  audio={false}
                  height={550}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={700}
                  videoConstraints={videoConstraints}
                  className="rounded-lg shadow-md"
                />
              </div>
            )}
            <button
              onClick={calltwofunc}
              className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              {isWebcamOn ? "Turn Off Webcam" : "Turn On Camera"}
            </button>
            {isWebcamOn && (
              <>
                <div className="text-lg font-semibold">
                  Detected Name:{" "}
                  <span className="text-green-500">{detectedName}</span>
                </div>
                <div className="text-lg font-semibold">
                  Detected Roll Number:{" "}
                  <span className="text-green-500">{detectedRollNumber}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAttendancepage;
