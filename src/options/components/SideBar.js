import React from "react";
import browser from "webextension-polyfill";
import { Link, withRouter  } from "react-router-dom";
import "../styles/SideBar.scss";

const SideBar = props => (
  <div className="sideBar">
    <div className="titleContainer">
      <img src="/icons/64.png" className="logo" />
      <span className="logoTitle">{browser.i18n.getMessage("extName")}</span>
    </div>
    <ul>
      <li
        className={`sideBarItem ${
          ["/information"].every(path => path != props.location.pathname)
            ? "selected"
            : ""
        }`}
      >
        <Link to="/settings">{browser.i18n.getMessage("settingsLabel")}</Link>
      </li>
      <li className={`sideBarItem ${props.location.pathname == "/information" ? "selected" : ""}`}>
        <Link to="/information">{browser.i18n.getMessage("informationLabel")}</Link>
      </li>
    </ul>
  </div>
);

export default withRouter(SideBar);
