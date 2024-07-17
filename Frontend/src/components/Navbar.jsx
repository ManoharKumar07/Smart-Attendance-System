import { NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useContext } from "react";
import { usercontext } from "../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const { user, setUser } = useContext(usercontext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({ name: "", email: "" });
  };

  return (
    <>
      <header>
        <div className="navbar">
          <div className="container nav">
            <nav>
              <ul>
                <li>
                  <NavLink to="/" activeClassName="active" exact>
                    Home
                  </NavLink>
                </li>

                {user.name && (
                  <>
                    <li>
                      <NavLink
                        to="/yourclassroom"
                        activeClassName="active"
                        exact
                      >
                        Your Classroom
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/createclassroom"
                        activeClassName="active"
                        exact
                      >
                        Create Classroom
                      </NavLink>
                    </li>
                  </>
                )}

                {!user.name ? (
                  <>
                    <li>
                      <NavLink to="/login" activeClassName="active" exact>
                        Login
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/register" activeClassName="active" exact>
                        Register
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <div className="text-white">
              {user.name ? (
                <Link to="/" className="username">
                  <div>
                    <FontAwesomeIcon icon={faUser} style={{ color: "white" }} />
                    &nbsp;&nbsp;
                    {user.name}
                  </div>
                </Link>
              ) : (
                <Link to="/">Smart Attendance System</Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
