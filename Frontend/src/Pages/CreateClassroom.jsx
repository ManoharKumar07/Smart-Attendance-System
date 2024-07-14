import React, { useState, useContext } from "react";
import axios from "axios";
import { message } from "antd";
import { usercontext } from "../context/user-context";
import "../styles/CreateClassroom.css";

const CreateClassroom = () => {
  const { user } = useContext(usercontext);
  const [classname, setClassname] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const classroomData = {
      classname,
      department,
      subject,
      createdBy: user.email,
    };
    console.log(classroomData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/createclassroom",
        classroomData
      );

      if (response.status === 201) {
        message.success("Classroom created successfully");
        setClassname("");
        setDepartment("");
        setSubject("");
      } else {
        message.error(`Failed to create classroom: ${response.data.message}`);
      }
    } catch (error) {
      message.error(`Failed to create classroom: ${error.message}`);
    }
  };

  return (
    <section className="section-createclassroom">
      <main>
        <div className="createclassroom-form">
          <h2 className="main-heading mb-3 text-5xl text-white">
            Create Classroom
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="classname">Classname:</label>
              <input
                type="text"
                value={classname}
                onChange={(e) => setClassname(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="department">Department:</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <br />
            <button type="submit" className="btn-submit">
              Create Classroom
            </button>
          </form>
        </div>
      </main>
    </section>
  );
};

export default CreateClassroom;
