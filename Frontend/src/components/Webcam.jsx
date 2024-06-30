import React, { useState } from "react";
import ReactWebcam from "react-webcam";

const Webcam = () => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const toggleWebcam = () => {
    setIsWebcamOn((prevState) => !prevState);
  };

  return (
    <div className="container bg-red-200">
      <div className="h-screen flex flex-col items-center justify-center">
        {isWebcamOn && (
          <ReactWebcam
            audio={false}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
          />
        )}
        <button
          onClick={toggleWebcam}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isWebcamOn ? "Turn Off Webcam" : "Turn On Webcam"}
        </button>
      </div>
    </div>
  );
};

export default Webcam;
