import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

export const Navbar = () => {
  return (
    <>
      <header>
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
          <div className="lusername">
            <NavLink to="/">UserName</NavLink>
          </div>
        </div>
      </header>
    </>
  );
};
