import React from "react";
import browser from "webextension-polyfill";
import { openUrl } from "src/common/tabs";
import SettingsIcon from "../icons/settings.svg";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "../styles/Header.scss";

const openSettings = () => {
  const url = "../options/index.html#settings";
  openUrl(url);
};

const getToggleButtonTitle = isEnabled => {
  return isEnabled
    ? browser.i18n.getMessage("disableOnThisPage")
    : browser.i18n.getMessage("enableOnThisPage");
};

export default props => (
  <div id="header">
    <div className="title">{browser.i18n.getMessage("extName")}</div>
    <div className="rightButtons">
      <div className="toggleButton" title={getToggleButtonTitle(props.isEnabledOnPage)}>
        <Toggle
          checked={props.isEnabledOnPage}
          onChange={props.toggleEnabledOnPage}
          icons={false}
          disabled={!props.isConnected}
        />
      </div>
      <button
        className={"settingsButton"}
        onClick={openSettings}
        title={browser.i18n.getMessage("settingsLabel")}
      >
        <SettingsIcon />
      </button>
    </div>
  </div>
);
