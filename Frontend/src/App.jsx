import "./App.css";
import { BrowserRouter, Routes, Router, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CreateDataset from "./Pages/CreateDataset";
import TakeAttendance from "./Pages/TakeAttendance";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Routes>
          <Route path="/createdataset" element={<CreateDataset />} />
        </Routes>
        <Routes>
          <Route path="/takeattendance" element={<TakeAttendance />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
