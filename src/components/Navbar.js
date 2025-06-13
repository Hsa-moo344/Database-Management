import React from "react";
// import { Link } from "react-router-dom";
import ProfileCss from "../css/staff.module.css";
import Image from "../image/maeteo.png";

function Navbar() {
  return (
    <nav className={ProfileCss.navContainer}>
      <img src={Image} alt="metao" className={ProfileCss.ImageNav} />
      <a href="/home" className={ProfileCss.navItems}>
        Home
      </a>

      <a href="/about" className={ProfileCss.navItems}>
        About
      </a>

      <a href="/contact" className={ProfileCss.navItems}>
        Contact Me
      </a>

      <a href="/dashboard" className={ProfileCss.navItems}>
        Dashboard
      </a>

      <a href="/login" className={ProfileCss.navItems}>
        Logout
      </a>
    </nav>
  );
}

export default Navbar;
