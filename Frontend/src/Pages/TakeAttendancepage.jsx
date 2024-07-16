import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactWebcam from "react-webcam";
import axios from "axios";
import { useParams } from "react-router-dom";

const TakeAttendancepage = () => {
  const { id } = useParams();
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [detectedName, setDetectedName] = useState("");
  const [detectedRollNumber, setDetectedRollNumber] = useState("");
  const [detectedEmail, setDetectedEmail] = useState("");
  const [classroomName, setClassroomName] = useState("");
  const webcamRef = useRef(null);
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  useEffect(() => {
    const fetchClassroomName = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/getclass",
          { id }
        );
        setClassroomName(response.data.classroom.classname); // Assuming the response structure is { classroom: { classname } }
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
        setDetectedName(response.data.name || "No face detected");
        setDetectedRollNumber(
          response.data.roll_number || "No roll number found"
        );
        setDetectedEmail(response.data.email || "No email found");
      } catch (error) {
        console.error("Error sending image to backend:", error);
      }
    }
  }, [webcamRef]);

  useEffect(() => {
    let intervalId;
    if (isWebcamOn) {
      intervalId = setInterval(capture, 500); // Capture an image every 0.5 seconds
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
    console.log(classroomName); // Ensure classroomName is correctly set
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
      TrainModel(); // Automatically call TrainModel when isWebcamOn changes
    }
  }, [isWebcamOn]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Take Attendance</h1>
      {isWebcamOn && (
        <div className="mb-4">
          <ReactWebcam
            audio={false}
            height={480}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            videoConstraints={videoConstraints}
            className="rounded-lg shadow-md"
          />
        </div>
      )}
      <button
        onClick={toggleWebcam}
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        {isWebcamOn ? "Turn Off Webcam" : "Take Attendance"}
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
          <div className="text-lg font-semibold">
            Detected Email:{" "}
            <span className="text-green-500">{detectedEmail}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TakeAttendancepage;
