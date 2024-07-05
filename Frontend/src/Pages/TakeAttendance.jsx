import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactWebcam from "react-webcam";
import axios from "axios";

const TakeAttendance = () => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [detectedName, setDetectedName] = useState("");
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
        setDetectedName(response.data.name || "No face detected");
      } catch (error) {
        console.error("Error sending image to backend:", error);
      }
    }
  }, [webcamRef]);

  useEffect(() => {
    let intervalId;
    if (isWebcamOn) {
      intervalId = setInterval(capture, 1000); // Capture an image every 2 seconds
    }
    return () => clearInterval(intervalId);
  }, [isWebcamOn, capture]);

  const toggleWebcam = async () => {
    const nextState = !isWebcamOn; // Capture the next state
    await setIsWebcamOn(nextState); // Update state
    setDetectedName(""); // Reset detectedName
    if (nextState) {
      TrainModel(); // Call TrainModel only if webcam is turned on
    }
  };

  const TrainModel = async () => {
    console.log("TrainModel called");
    console.log(isWebcamOn);
    try {
      await axios.post("http://127.0.0.1:8000/api/retrainmodel/");
      console.log("Model retrained successfully");
    } catch (error) {
      console.error("Error retraining the model:", error);
    }
  };

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
        <div className="text-lg font-semibold">
          Detected Name: <span className="text-green-500">{detectedName}</span>
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;
