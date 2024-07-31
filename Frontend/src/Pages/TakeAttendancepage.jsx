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
  const [isReportCreated, setIsReportCreated] = useState(false);

  // attendance report
  const [allstudents, setallStudents] = useState([]);
  const [reportlength, setReportLength] = useState(1);
  const webcamRef = useRef(null);
  const [shouldCreateDocument, setShouldCreateDocument] = useState(false);

  // updating attendance report
  useEffect(() => {
    fetchStudents();
  }, []);

  // fetching all students of class to create attendance once page loaded
  const fetchStudents = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/student/getstudentenr",
        {
          classid: id,
        }
      );

      setallStudents(response.data.data);
      setIsReportCreated(false);
      console.log("Fetched students:", response.data.data);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  // creating attendance report once all students are fetched means all student usestate updated
  useEffect(() => {
    const createattendancereport = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/createattendancereport",
          { classid: id, session: 1, attendance: allstudents }
        );
        setFetchingStudents(true);
        setIsReportCreated(true);
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

  //getting the length of the attendance report of that particular date to get to know session number to mark attendance
  useEffect(() => {
    if (!isReportCreated) return;

    const lengthreport = async () => {
      try {
        console.log("Fetching report length for id:", id);
        const response = await axios.post(
          "http://localhost:5000/api/user/getreportlength",
          { classid: id }
        );
        console.log("Reports", response.data.reports);
        if (response.data.reports && Array.isArray(response.data.reports)) {
          setReportLength(response.data.reports.length);
        }
      } catch (error) {
        console.log("Error in fetching report length", error);
      }
    };

    lengthreport();
  }, [isReportCreated]);

  // Updating the attendance of latest session (using reportlength) once student is recognised by the ml model (detected email)
  useEffect(() => {
    const markpresent = async () => {
      if (!detectedEmail) return;
      try {
        console.log(id, reportlength, detectedEmail);
        const response = await axios.post(
          "http://localhost:5000/api/user/updatereport",
          { classid: id, session: reportlength, email: detectedEmail }
        );
        console.log(response.data.message);
      } catch (error) {
        console.log("Can't mark attendance ", error);
      }
    };
    markpresent();
  }, [detectedEmail, reportlength]);

  // Fetching classroom name
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
  // function to create new attendance document
  const createnewattendancedocument = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/createattendancereport",
        { classid: id, session: reportlength, attendance: allstudents }
      );
      setFetchingStudents(true);
      setIsReportCreated(true);
      console.log("First session report created");
    } catch (error) {
      console.log("Error creating attendance document:", error);
    }
  };
  useEffect(() => {
    if (shouldCreateDocument) {
      createnewattendancedocument();
      setShouldCreateDocument(false); // Reset the flag
    }
  }, [shouldCreateDocument]);

  // TO CREATE NEW ATTENDANCE REPORT FOR ONE MORE SESSION
  const takenewattendance = async () => {
    setStudents([]);
    setReportLength((prevLength) => prevLength + 1);

    // Making delay in calling to ensure that attendance report is created only after the session length is created
    setTimeout(() => {
      setShouldCreateDocument(true);
    }, 3500);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-white mb-24 mt-40">
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
            <button
              onClick={takenewattendance}
              className="px-4 py-2 mb-4 ml-6 bg-green-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Take new Attendance
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
