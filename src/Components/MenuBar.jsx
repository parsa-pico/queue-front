import React, { useState } from "react";
import { Link } from "react-router-dom";
import { clearToken } from "../Services/authService";

const MobileMenuBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  function MyLink({ children, to, ...rest }) {
    return (
      <li>
        <Link
          {...rest}
          style={{ textDecoration: "none" }}
          onClick={toggleMenu}
          to={to}
        >
          {children}
        </Link>
      </li>
    );
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
          <MyLink to={"/courses"}>دوره ها</MyLink>
          <hr />
          <MyLink to={"/students"}>کاربران</MyLink>
          <hr />
          <MyLink
            onClick={() => {
              clearToken();
            }}
            className="text-danger"
            to={"/"}
          >
            خروج
          </MyLink>
        </ul>
      )}
    </div>
  );
};

export default MobileMenuBar;
