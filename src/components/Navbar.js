import React from "react";
import { Link } from "react-router-dom";
import ProfileCss from "../css/staff.module.css";

function Navbar() {
  return (
    <nav className={ProfileCss.navContainer}>
      <Link to="/home">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact Me</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Logout</Link>
    </nav>
  );
}

export default Navbar;
