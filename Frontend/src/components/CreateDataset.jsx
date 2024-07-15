import React, { useState, useCallback, useRef } from "react";
import ReactWebcam from "react-webcam";
import axios from "axios";
import { message } from "antd";
import "../styles/CreateDataset.css";

const CreateDataset = ({ classId, classname }) => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [imageCount, setImageCount] = useState(null);
  const [students, setStudents] = useState([]);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const toggleWebcam = async () => {
    const newCameraState = !cameraOn;
    setCameraOn(newCameraState);

    if (!newCameraState) {
      // Clear the form when the camera is turned off
      setName("");
      setRollNumber("");
      setEmail("");

      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/student/getstudents",
          {
            classid: classId,
          }
        );

        if (Array.isArray(response.data)) {
          setStudents(response.data);
          message.success("Fetched students successfully!");
          console.log("Fetched students:", response.data);
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching students", error);
        if (error.response && error.response.data) {
          console.error("Error response data:", error.response.data);
        }
      }
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    sendImageToBackend(name, rollNumber, email, classname, imageSrc);
  }, [webcamRef, name, rollNumber, email, classname]);

  const sendImageToBackend = async (
    name,
    rollNumber,
    email,
    classroomName,
    imageSrc
  ) => {
    try {
      console.log("Sending data to backend:", {
        name,
        roll_number: rollNumber,
        email,
        classroom_name: classroomName,
        image: imageSrc,
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/createdataset/",
        {
          name,
          roll_number: rollNumber,
          email,
          classroom_name: classroomName,
          image: imageSrc,
        }
      );

      console.log(response.data);
      setImageCount(response.data.total_images);

      // Making request to add student to database
      const addStudentResponse = await axios.post(
        "http://localhost:5000/api/user/student/addstudent",
        {
          name,
          roll_number: rollNumber,
          email,
          classid: classId,
        }
      );

      console.log("Student added:", addStudentResponse.data);
      message.success("Student added successfully!");
    } catch (error) {
      console.error("Error sending data to backend", error);
      if (error.response && error.response.data) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  return (
    <div className="section-create-dataset">
      <div className="form-container">
        <h1 className="main-heading text-3xl">Create Dataset</h1>
        <div>
          {classId} and {classname}
        </div>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label>Roll Number</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="Enter your roll number"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <button onClick={toggleWebcam} className="btn">
            {cameraOn ? "Turn Off Camera" : "Capture Image"}
          </button>
        </div>
        {cameraOn && (
          <div className="webcam-container">
            <ReactWebcam
              audio={false}
              height={480}
              screenshotFormat="image/jpeg"
              width={640}
              videoConstraints={videoConstraints}
              ref={webcamRef}
            />
            <button onClick={capture} className="capture-btn">
              Capture Photo
            </button>
          </div>
        )}
        {imageCount !== null && (
          <div className="image-count">
            <p>Total images in dataset: {imageCount}</p>
          </div>
        )}
        {students.length > 0 && (
          <div className="students-list">
            <h2>Students in this class:</h2>
            <ul>
              {students.map((student) => (
                <li key={student._id}>
                  {student.name} - {student.roll_number} - {student.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDataset;
