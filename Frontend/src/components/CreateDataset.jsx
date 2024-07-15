import React, { useState, useCallback, useRef } from "react";
import ReactWebcam from "react-webcam";
import axios from "axios";
import "../styles/CreateDataset.css";

const CreateDataset = ({ classId, classname }) => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [classroomName, setClassroomName] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [imageCount, setImageCount] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const toggleWebcam = () => {
    setCameraOn((prevState) => !prevState);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    sendImageToBackend(name, rollNumber, email, classroomName, imageSrc);
  }, [webcamRef, name, rollNumber, email, classroomName]);

  const sendImageToBackend = (
    name,
    rollNumber,
    email,
    classroomName,
    imageSrc
  ) => {
    console.log("Sending data to backend:", {
      name,
      roll_number: rollNumber,
      email,
      classroom_name: classroomName,
      image: imageSrc,
    });

    axios
      .post("http://127.0.0.1:8000/api/createdataset/", {
        name,
        roll_number: rollNumber,
        email,
        classroom_name: classname,
        image: imageSrc,
      })
      .then((response) => {
        console.log(response.data);
        setImageCount(response.data.total_images);
      })
      .catch((error) => {
        console.error("Error sending image to backend", error);
        console.error("Error response data:", error.response.data);
      });
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
      </div>
    </div>
  );
};

export default CreateDataset;
