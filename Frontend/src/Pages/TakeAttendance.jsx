import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactWebcam from "react-webcam";
import axios from "axios";

const TakeAttendance = () => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [detectedName, setDetectedName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [className, setClassName] = useState("");
  const [responseClassName, setResponseClassName] = useState("");
  const webcamRef = useRef(null);
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

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
        const { name, roll_number, class_name } = response.data;
        setDetectedName(name || "No face detected");
        setRollNumber(roll_number || "");
        setResponseClassName(class_name || "");
      } catch (error) {
        console.error("Error sending image to backend:", error);
      }
    }
  }, []);

  useEffect(() => {
    let intervalId;
    if (isWebcamOn) {
      intervalId = setInterval(capture, 1000); // Capture an image every 1 second
    }
    return () => clearInterval(intervalId);
  }, [isWebcamOn, capture]);

  const toggleWebcam = () => {
    const nextState = !isWebcamOn; // Capture the next state
    setIsWebcamOn(nextState); // Update state
    setDetectedName(""); // Reset detectedName
    if (nextState) {
      TrainModel(); // Call TrainModel only if webcam is turned on
    }
  };

  const TrainModel = async () => {
    console.log("TrainModel called");
    try {
      await axios.post("http://127.0.0.1:8000/api/retrainmodel/", {
        classroom_name: className, // Use className from state
      });
      console.log("Model retrained successfully");
    } catch (error) {
      console.error("Error retraining the model:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Take Attendance</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Classroom Name
        </label>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter classroom name"
        />
      </div>
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
        <div className="text-lg font-semibold">
          <p>
            Detected Name:{" "}
            <span className="text-green-500">{detectedName}</span>
          </p>
          <p>
            Roll Number: <span className="text-blue-500">{rollNumber}</span>
          </p>
          <p>
            Class Name:{" "}
            <span className="text-indigo-500">{responseClassName}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;
