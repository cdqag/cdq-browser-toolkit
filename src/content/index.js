import React from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import { initSettings, handleSettingsChange  } from "src/settings";
import { updateLogLevel, overWriteLogLevel  } from "src/common/log";
import { waitTime, dummyPromise } from "src/common/utils";
import { getCountryCode } from "src/common/countryUtils";
import { getSelectedText, getSelectedPosition  } from './selection'
import ResultsContainer from "./components/ResultsContainer";

let isEnabled = true;

let prevSelectedText = "";
let lastMousePosition = { x: 0, y: 0 };

const EMAIL_ADDRESS_PATTERN = /(?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const IBAN_CC_REGEX = /^[A-Z]{2}/;
const IBAN_QUICK_REGEX = /^[A-Z]{2}[A-Za-z0-9]{14,30}$/;

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
 * Handle context menu open event
 * @param {PointerEvent} e
 */
const handleContextMenuOpen = async e => {
  lastMousePosition.x = e.clientX;
  lastMousePosition.y = e.clientY;
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
  // Handle control messages
  switch (request.message) {
  case "getTabUrl":
    if (isEnabled && window == window.parent) {
      return location.href;
    }
    return dummyPromise;

  case "getSelectedText":
    if (isEnabled && prevSelectedText.length > 0) {
      return prevSelectedText;
    }
    return dummyPromise;

  case "getEnabled":
    return isEnabled;

  case "enableExtension":
    isEnabled = true;
    return;

  case "disableExtension":
    removeResultsContainer();
    isEnabled = false;
    return
    
  }

  // Handle menu item clicked messages
  if (request.message.endsWith("MenuItemClicked")) {
    if (!isEnabled) { return dummyPromise; }

    let text;
    let position;

    if (request.payload) {
      text = request.payload;
      position = lastMousePosition;
    } else {
      text = getSelectedText();
      if (text.length === 0) { return; }
      position = getSelectedPosition();
    }
    text = text.trim();

    removeResultsContainer();
    showResultsContainer(position);

    let responseObject;

    switch (request.message) {
    case "bankAccountNameLookupMenuItemClicked": {
      responseObject = await browser.runtime.sendMessage({
        message: "bankAccountNameLookupFetch",
        text,
      });
      break;
    }

    case "checkBankAccountScoreMenuItemClicked": {
      text = text.replaceAll(" ", "");

      if (!IBAN_CC_REGEX.test(text)) {
        try {
          text = getCountryCode(window.location.hostname.split('.').pop()) + text;

        // eslint-disable-next-line no-unused-vars
        } catch (e) {
          responseObject = {
            result: null,
            error: browser.i18n.getMessage("bankAccountNumberWithoutCountryCodeError")
          }
          break;
        }
      }
    
      if (!IBAN_QUICK_REGEX.test(text)) {
        responseObject = {
          result: null,
          error: browser.i18n.getMessage("invalidBankAccountNumberError")
        };
        break;
      }

      responseObject = await browser.runtime.sendMessage({
        message: "checkBankAccountScoreFetch",
        text
      });
      break;
    }
  
    case "emailVerifyMenuItemClicked": {
      if (text.startsWith("mailto:")) {
        text = text.replace("mailto:", "");
      }

      const m = text.match(EMAIL_ADDRESS_PATTERN);
      if (!m) {
        responseObject = {
          result: null,
          error: browser.i18n.getMessage("emailVerifyInvalidEmailError")
        };
        break;
      }
      text = m[0];

      responseObject = await browser.runtime.sendMessage({
        message: "emailVerifyFetch",
        text,
      });
      break;
    }

    default: {
      responseObject = {
        result: null,
        error: browser.i18n.getMessage("notImplementedError")
      };
      break;
    }
    }

    updateContent(responseObject);
    return;
  }

  // Fallback
  return dummyPromise;
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

  document.body.insertAdjacentHTML("beforeend", `<div id="cdq-browser-toolkit"></div>`);
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
  document.addEventListener("contextmenu", handleContextMenuOpen);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  browser.storage.local.onChanged.addListener(handleSettingsChange);
  browser.runtime.onMessage.addListener(handleMessage);
  overWriteLogLevel();
  updateLogLevel();
};

if (window.self === window.top) {
  // Iframe protection
  init();
}
