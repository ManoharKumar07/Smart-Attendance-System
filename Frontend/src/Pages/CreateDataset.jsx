import React, { useState, useCallback, useRef } from "react";
import ReactWebcam from "react-webcam";
import axios from "axios";

const CreateDataset = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
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
    sendImageToBackend(name, rollNumber, imageSrc);
  }, [webcamRef, name, rollNumber]);

  const sendImageToBackend = (name, rollNumber, imageSrc) => {
    console.log("Sending data to backend:", {
      name,
      roll_number: rollNumber,
      image: imageSrc,
    });

    axios
      .post("http://127.0.0.1:8000/api/createdataset/", {
        name: name,
        roll_number: rollNumber,
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
    <div className="container bg-slate-400 p-4">
      <h1 className="text-xl font-bold mb-4">Create Dataset</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Roll Number
        </label>
        <input
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your roll number"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={toggleWebcam}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        >
          {cameraOn ? "Turn Off Camera" : "Capture Image"}
        </button>
      </div>
      <div>
        {cameraOn && (
          <div className="mt-4">
            <ReactWebcam
              audio={false}
              height={480}
              screenshotFormat="image/jpeg"
              width={640}
              videoConstraints={videoConstraints}
              ref={webcamRef}
            />
            <button
              onClick={capture}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Capture Photo
            </button>
          </div>
        )}
      </div>
      {imageCount !== null && (
        <div className="mt-4">
          <p className="text-lg font-medium text-green-600">
            Total images in dataset: {imageCount}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateDataset;
