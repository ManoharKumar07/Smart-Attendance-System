import { useState, useContext } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import { usercontext } from "../context/user-context";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(usercontext);

  const [user, setUserState] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserState({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        user
      );

      if (response.data.success) {
        setUser({ name: response.data.username, email: user.email }); // Set username in context
        localStorage.setItem("token", response.data.token);
        message.success("Login Successful");
        // Clear the form after successful login
        setUserState({
          email: "",
          password: "",
        });
        // Navigate to another page upon successful login
        navigate("/");
      } else {
        message.error(
          response.data.message ||
            "Login Failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      message.error("Login Failed. Please try again later.");
    }
  };

  return (
    <section>
      <main>
        <div className="section-login">
          <div className="container grid grid-two-cols">
            <div className="login-image log-img">
              <img
                src="/images/login.png"
                width="400"
                height="500"
                alt="Login"
              />
            </div>
            <div className="login-form">
              <h1 className="main-heading mb-3 text-7xl text-white">Login</h1>
              <br />
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInput}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInput}
                    placeholder="Password"
                  />
                </div>
                <br />
                <button type="submit" className="btn btn-submit">
                  Login Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default LoginPage;
