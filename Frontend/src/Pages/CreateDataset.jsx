import React, { useState } from "react";
import ReactWebcam from "react-webcam";

const CreateDataset = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  // Video constraints for the webcam
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  // Function to toggle the webcam on and off
  const toggleWebcam = () => {
    setCameraOn((prevState) => !prevState);
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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDataset;
