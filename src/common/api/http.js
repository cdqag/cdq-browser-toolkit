import browser from "webextension-polyfill";
import log from "loglevel";
import { getApiKey, getHeaders } from "./utils";

const logDir = "common/api/http";

const API_GATEWAY = "https://api.cdq.com";

export const sendRequest = async (req) => {
  const responseObject = {
    result: null,
    error: null
  };

  if (getApiKey() === "") {
    responseObject.error = browser.i18n.getMessage("emptyApiKeyError");
    return responseObject;
  }

  const response = await fetch(req).catch(() => ({
    status: 0,
    statusText: '' 
  }));

  if (response.status !== 200) {
    if (response.status === 0) {
      responseObject.error = browser.i18n.getMessage("networkError");
    } else if (response.status === 403) {
      responseObject.error = browser.i18n.getMessage("invalidApiKeyError");
    } else if (response.status === 429 || response.status === 503) {
      responseObject.error = browser.i18n.getMessage("unavailableError");
    } else {
      responseObject.error = `${browser.i18n.getMessage("unknownError")} [${response.status} ${response.statusText}]`;
    }
  } else {
    responseObject.result = await response.json();
  }

  log.log(logDir, "sendRequest()", responseObject);
  return responseObject;
};

export const createPOSTRequest = (endpoint, payload) => {
  const req = new Request(`${API_GATEWAY}/${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  return req;
};

export const createGETRequest = (endpoint) => {
  const req = new Request(`${API_GATEWAY}/${endpoint}`, {
    method: "GET",
    headers: getHeaders()
  });

  return req;
};
