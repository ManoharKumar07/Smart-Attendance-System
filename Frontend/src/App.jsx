import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

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
      <div className="">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </div>
    </>
  );
}

export default App;
