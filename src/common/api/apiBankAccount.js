import browser from "webextension-polyfill";
import log from "loglevel";

import { POST } from "./constants";
import { getHistory, setHistory } from "./cache";
import { createPOSTRequest, sendRequest } from "./http";

const logDir = "common/api/bankAccount";

const ENDPOINT_LOOKUP = "bankaccount-data/rest/banks/lookup";
const ENDPOINT_CONFIRM = "bankaccount-data/rest/v2/bankaccounts/confirm";


export async function bankAccountNameLookup(text) {
  log.log(logDir, "bankAccountNameLookup()", text);

  if (text === "") {
    return null;
  }
  
  const cachedResult = await getHistory(ENDPOINT_LOOKUP, POST, text);
  if (cachedResult) { return cachedResult; }

  const req = createPOSTRequest(ENDPOINT_LOOKUP, {
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
  // ---

  setHistory(ENDPOINT_LOOKUP, POST, text, responseObject);
  return responseObject;
}

export async function checkBankAccountScore(text) {
  log.log(logDir, "checkBankAccountScore()", text);

  if (text === "") {
    return null;
  }

  const cachedResult = await getHistory(ENDPOINT_CONFIRM, POST, text);
  if (cachedResult) { return cachedResult; }

  const req = createPOSTRequest(ENDPOINT_CONFIRM, {
    "bankAccount": {
      "internationalBankAccountIdentifier": text
    }
  });

  const responseObject = await sendRequest(req);

  // Post-processing results
  if (responseObject.result) {
    let result = responseObject.result;
    let summary;

    if (result.bankAccountConfirmed) {
      summary = [
        {
          label: browser.i18n.getMessage("resultLabel"),
          value: browser.i18n.getMessage("bankAccountConfirmed"),
          className: "color-green"
        },
        {
          label: browser.i18n.getMessage("trustScoreLabel"),
          value: result.trustScore
        },
        {
          label: browser.i18n.getMessage("numberOfCompaniesLabel"),
          value: result.numberOfCompanies
        },
        {
          label: browser.i18n.getMessage("numberOfPaymentsLabel"),
          value: result.numberOfPayments
        },
        {
          label: browser.i18n.getMessage("lastPaymentAtLabel"),
          value: result.lastPaymentAt
        }
      ];

    } else {
      summary = [
        {
          label: browser.i18n.getMessage("resultLabel"),
          value: browser.i18n.getMessage("bankAccountNotConfirmed"),
          className: "color-red"
        }
      ];

    }

    responseObject.result = {
      title: result.bankAccountRequest.internationalBankAccountIdentifier,
      summary
    };
  }
  // ---

  setHistory(ENDPOINT_CONFIRM, POST, text, responseObject);
  return responseObject;
}
