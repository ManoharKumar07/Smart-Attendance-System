import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { useContext } from "react";
import { usercontext } from "../context/user-context";

export const Navbar = () => {
  const { user } = useContext(usercontext);

  return (
    <>
      <header>
        <div className="navbar">
          <div className="container nav">
            <nav>
              <ul>
                <li>
                  <NavLink to="/"> Home </NavLink>
                </li>
                <li>
                  <NavLink to="/yourclassroom"> Your Classroom </NavLink>
                </li>
                <li>
                  <NavLink to="/createclassroom"> Create Classroom </NavLink>
                </li>
                <li>
                  <NavLink to="/contact"> Contact </NavLink>
                </li>
                <li>
                  <NavLink to="/register"> Register </NavLink>
                </li>
                <li>
                  <NavLink to="/login"> Login </NavLink>
                </li>
              </ul>
            </nav>
            <div className="lusername text-white">
              {user.name ? (
                <NavLink to="/">{user.name}</NavLink>
              ) : (
                <NavLink to="/">Smart Attendance System</NavLink>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
