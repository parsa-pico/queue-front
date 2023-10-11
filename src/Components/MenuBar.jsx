import React, { useState } from "react";
import { Link } from "react-router-dom";
import { clearToken, getDecodedToken } from "../Services/authService";
import { Button } from "react-bootstrap";

const MobileMenuBar = () => {
  const user = getDecodedToken();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  function MyLink({ children, to, onClick, ...rest }) {
    return (
      <li>
        <Link
          {...rest}
          onClick={(e) => {
            if (onClick) onclick(e);
            toggleMenu();
          }}
          style={{ textDecoration: "none" }}
          to={to}
        >
          {children}
        </Link>
      </li>
    );
  }
  function getUserName() {
    if (user) return user.firstName + " " + user.lastName;
  }
  return (
    <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
      <div className="menu-button" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? "open" : ""}`} />
        <div className={`bar ${menuOpen ? "open" : ""}`} />
        <div className={`bar ${menuOpen ? "open" : ""}`} />
      </div>

      {menuOpen && (
        <ul className="menu-items">
          <MyLink to={"/rooms"}>اتاق ها</MyLink>
          {user.isAdmin && (
            <>
              <hr />
              <MyLink to={"/get-forms"}> مشاهده فرم ها</MyLink>
              <hr />
              <MyLink to={"/staff"}>کاربران</MyLink>
            </>
          )}

          <hr />
          <div
            onClick={(e) => {
              e.preventDefault();

              clearToken();
              window.location = user.isStaff
                ? "/login-teacher"
                : "/login-student";
            }}
            className="text-danger pb-4"
          >
            خروج
          </div>
        </ul>
      )}
      {!menuOpen && (
        <Button variant="secondary" className="menu-name p-1">
          {getUserName()}
        </Button>
      )}
    </div>
  );
};

export default MobileMenuBar;
