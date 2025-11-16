import React from "react";
import logo from "../../assets/logo.png";
import "./Header.css";


const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Steel Butterfly Logo" className="header-logo" />
      <h1 className="header-title">Steel Butterfly</h1>
    </header>
  );
};

export default Header;