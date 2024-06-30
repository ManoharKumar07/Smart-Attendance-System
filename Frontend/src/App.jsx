import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter, Routes, Router, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CreateDataset from "./Pages/CreateDataset";

function App() {
  // const [data, setData] = useState({});
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get("http://127.0.0.1:8000/test/");
  //     if (response) {
  //       setData(response.data);
  //       console.log("Data fetched successfully");
  //     } else {
  //       console.log("Error");
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Routes>
          <Route path="/createdataset" element={<CreateDataset />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
