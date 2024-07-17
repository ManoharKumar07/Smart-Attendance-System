import React from "react";
import "../styles/Home.css";

const Home = () => {
  return (
    <section className="home-section">
      <div className="container">
        <main>
          <div className="section-login">
            <div className="grid grid-two-cols">
              <div className="home-content">
                <h1 className="font-bold text-5xl text-white mb-12 ">
                  Welcome to the Smart Attendance System!
                </h1>
                <p className="text-white text-3xl mb-10">
                  This system leverages the power of computer vision and machine
                  learning to automate the attendance process. By using a webcam
                  to capture images of students, the system can recognize faces
                  and mark attendance automatically.
                </p>
                <p className="text-white text-2xl">
                  This not only saves time but also reduces errors and ensures
                  accurate record-keeping.
                </p>
              </div>
              <div className="login-image">
                <img
                  src="/images/design.png"
                  width="400"
                  height="500"
                  alt="Login"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Home;
