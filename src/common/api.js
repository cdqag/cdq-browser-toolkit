import browser from "webextension-polyfill";
import log from "loglevel";
import { getSettings } from "src/settings";
import { getHistory, setHistory } from "./cache";

const logDir = "common/api";

const API_GATEWAY = "https://api.cdq.com";
const ENDPOINT_BANKACCOUNT_LOOKUP = "bankaccount-data/rest/banks/lookup";
const ENDPOINT_EMAIL_VERIFY = "email-analysis/rest/emails/verify";

const POST = "POST";
// const GET = "GET";

async function sendRequest(req) {
  const response = await fetch(req).catch(() => ({
    status: 0,
    statusText: '' 
  }));

  const responseObject = {
    result: null,
    error: null
  };

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
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "X-API-KEY": getSettings("apiKey")
  };
}

function createPOSTRequest(endpoint, payload) {
  const req = new Request(`${API_GATEWAY}/${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  return req;
}

// function createGETRequest(endpoint) {
//   const req = new Request(`${API_GATEWAY}/${endpoint}`, {
//     method: "GET",
//     headers: getHeaders()
//   });

//   return req;
// }

export async function bankAccountNameLookup(text) {
  text = text.trim();
  log.log(logDir, "bankAccountNameLookup()", text);

  if (text === "") {
    return null;
  }

  
  const cachedResult = await getHistory(ENDPOINT_BANKACCOUNT_LOOKUP, POST, text);
  if (cachedResult) { return cachedResult; }

  const req = createPOSTRequest(ENDPOINT_BANKACCOUNT_LOOKUP, {
    "bank": {
      "names": [
        {
          "value": text
        }
      ]
    },
    "maxCandidates": 20,
    "pageSize": 1
  });

  const responseObject = await sendRequest(req);

  // Post-processing results
  if (responseObject.result?.values) {
    let result = responseObject.result;

    if (result.values.length > 0) {
      result = result.values[0];
      result = {
        title: result.bank.names[0].value,
        summary: [
          {
            label: browser.i18n.getMessage("swiftCodeLabel"),
            value: result.bank.externalId
          },
          {
            label: browser.i18n.getMessage("countryCodeLabel"),
            value: result.bank.addresses[0].country.shortName
          },
          {
            label: browser.i18n.getMessage("matchingScoreLabel"),
            value: `${Math.round(result.matchingProfile.matchingScores.overall.value * 100)}%`
          }
        ]
      };
    } else {
      result = null;
    }

    responseObject.result = result;
  }

  setHistory(ENDPOINT_BANKACCOUNT_LOOKUP, POST, text, responseObject);
  return responseObject;
}

export async function emailVerify(text) {
  text = text.trim();
  log.log(logDir, "emailVerify()", text);

  if (text === "") {
    return null;
  }

  const cachedResult = await getHistory(ENDPOINT_EMAIL_VERIFY, POST, text);
  if (cachedResult) { return cachedResult; }

  const req = createPOSTRequest(ENDPOINT_EMAIL_VERIFY, {
    "email": text
  });

  const responseObject = await sendRequest(req);
  setHistory(ENDPOINT_EMAIL_VERIFY, POST, text, responseObject);
  return responseObject;
}
