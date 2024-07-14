import "./App.css";
import { BrowserRouter, Routes, Router, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CreateDataset from "./Pages/CreateDataset";
import TakeAttendance from "./Pages/TakeAttendance";
import Loginpage from "./Pages/Loginpage";
import Registerpage from "./Pages/Registerpage";
import YourClassroom from "./Pages/YourClassroom";
import CreateClassroom from "./Pages/CreateClassroom";
import Contact from "./Pages/Contact";
import ViewAttendancepage from "./Pages/ViewAttendancepage";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/createdataset" element={<CreateDataset />} />

          <Route path="/attendance" element={<TakeAttendance />} />

          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/yourclassroom" element={<YourClassroom />} />
          <Route path="/createclassroom" element={<CreateClassroom />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/viewattendance" element={<ViewAttendancepage />} />
          <Route path="/createclassroom" element={<CreateClassroom />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
