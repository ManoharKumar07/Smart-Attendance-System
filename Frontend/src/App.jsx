import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import CreateDataset from "./components/CreateDataset";
import TakeAttendance from "./Pages/TakeAttendance";
import Loginpage from "./Pages/Loginpage";
import Registerpage from "./Pages/Registerpage";
import YourClassroom from "./Pages/YourClassroom";
import CreateClassroom from "./Pages/CreateClassroom";
import Contact from "./Pages/Contact";
import ViewAttendancepage from "./Pages/ViewAttendancepage";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import { usercontext } from "./context/user-context";
import { useState } from "react";
import ClassRoomDetails from "./Pages/ClassRoomDetails";
import TakeAttendancepage from "./Pages/TakeAttendancepage";
import AttendanceDetailspage from "./Pages/AttendanceDetailspage";

function App() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  return (
    <>
      <BrowserRouter>
        <usercontext.Provider value={{ user, setUser }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createdataset" element={<CreateDataset />} />
            <Route path="/attendance" element={<TakeAttendance />} />
            {/* ********************************************* */}
            <Route path="/login" element={<Loginpage />} />
            <Route path="/register" element={<Registerpage />} />
            <Route path="/yourclassroom" element={<YourClassroom />} />
            <Route path="/createclassroom" element={<CreateClassroom />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/viewattendancepage/:id"
              element={<ViewAttendancepage />}
            />
            <Route
              path="/viewattendancepage/:id/:date"
              element={<AttendanceDetailspage />}
            />
            <Route path="/yourclassroom/:id" element={<ClassRoomDetails />} />
            <Route
              path="/yourclassroom/takeattendance/:id"
              element={<TakeAttendancepage />}
            />
          </Routes>
          <Footer />
        </usercontext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
