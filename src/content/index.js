import React from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import { initSettings, getSettings, handleSettingsChange  } from "src/settings";
import { updateLogLevel, overWriteLogLevel  } from "src/common/log";
import { waitTime  } from "src/common/utils";
import { getSelectedText, getSelectedPosition  } from './selection'
import ResultsContainer from "./components/ResultsContainer";

let prevSelectedText = "";
let isEnabled = true;
const content = {
  result: null,
  error: null,
  isLoading: true
};

/**
 * Handle mouse up event
 * @param {MouseEvent} e 
 * @returns 
 */
const handleMouseUp = async e => {
  await waitTime(10);

  const isLeftClick = e.button === 0;
  if (!isLeftClick) { return; }

  const isInPasswordField = e.target.tagName === "INPUT" && e.target.type === "password";
  if (isInPasswordField) { return; }

  const isInThisElement =
    document.querySelector("#cdq-browser-toolkit") &&
    document.querySelector("#cdq-browser-toolkit").contains(e.target);
  if (isInThisElement) { return; }

  removeResultsContainer();
};

/**
 * Handle key down event
 * @param {KeyboardEvent} e 
 */
const handleKeyDown = e => {
  if (e.key === "Escape") {
    removeResultsContainer();
  }
};

/**
 * Handle visibility change event
 */
const handleVisibilityChange = () => {
  if (document.visibilityState === "hidden") {
    browser.storage.local.onChanged.removeListener(handleSettingsChange);
  } else {
    browser.storage.local.onChanged.addListener(handleSettingsChange);
  }
};

/**
 * Handle message event
 * @param {MessageEvent} request 
 * @returns 
 */
const handleMessage = async request => {
  const empty = new Promise(resolve => {
    setTimeout(() => {
      return resolve("");
    }, 100);
  });

  switch (request.message) {
  case "getTabUrl":
    if (!isEnabled) {
      return empty;
    }
    if (window == window.parent) {
      return location.href;
    } else {
      return empty;
    }

  case "getSelectedText":
    if (!isEnabled) { return empty; }
    if (prevSelectedText.length === 0) { return empty; }
    else { return prevSelectedText; }
    
  case "bankAccountNameLookupMenuItemClicked": {
    if (!isEnabled) { return empty; }
    const selectedText = getSelectedText();
    if (selectedText.length === 0) { return; }
    const position = getSelectedPosition();

    removeResultsContainer();
    showResultsContainer(position);

    const responseObject = await browser.runtime.sendMessage({
      message: "bankAccountNameLookupFetch",
      text: selectedText,
    });
    updateContent(responseObject);

    break;
  }
    
  case "getEnabled":
    return isEnabled;

  case "enableExtension":
    isEnabled = true;
    break;

  case "disableExtension":
    removeResultsContainer();
    isEnabled = false;
    break;

  default:
    return empty;
  }
};


const updateContent = responseObject => {
  content.result = responseObject.result;
  content.error = responseObject.error;
  content.isLoading = false;
  renderResultsContainer();
}

// #region ResultsContainer

const showResultsContainer = (position) => {
  const element = document.getElementById("cdq-browser-toolkit");
  if (element) { return; }
  if (!isEnabled) { return; }
  content.isLoading = true;

  const themeClass = "cdq-browser-toolkit-main-theme";

  document.body.insertAdjacentHTML("beforeend", `<div id="cdq-browser-toolkit" class="${themeClass}"></div>`);
  renderResultsContainer(position);
};

const renderResultsContainer = (position) => {
  const element = document.getElementById("cdq-browser-toolkit");
  if (!element) { return; }
  ReactDOM.render(
    <ResultsContainer
      removeContainer={removeResultsContainer}
      position={position}
      result={content.result}
      error={content.error}
      isLoading={content.isLoading}
    />,
    element
  );
};

const removeResultsContainer = async () => {
  const element = document.getElementById("cdq-browser-toolkit");
  if (!element) { return; }

  ReactDOM.unmountComponentAtNode(element);
  element.parentNode.removeChild(element);
};

// #endregion


const init = async () => {
  await initSettings();
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  browser.storage.local.onChanged.addListener(handleSettingsChange);
  browser.runtime.onMessage.addListener(handleMessage);
  overWriteLogLevel();
  updateLogLevel();
};

init();
