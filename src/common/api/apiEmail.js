import browser from "webextension-polyfill";
import log from "loglevel";

import { POST } from "./constants";
import { getHistory, setHistory } from "./cache";
import { createPOSTRequest, sendRequest } from "./http";

const logDir = "common/api/email";

const ENDPOINT_VERIFY = "email-analysis/rest/emails/verify";


const VERIFY_SUMMARY_ITEMS = [
  "isBreachedDomain",
  "isBreachedEmail",
  "isDisposable",
  "isBlacklisted",
  "isPublicWhois",
  "isSharedEmail",
  "isValidFormat",
  "isFreemail",
  "isRoleBased"
];

export async function emailVerify(text) {
  log.log(logDir, "emailVerify()", text);

  if (text === "") {
    return null;
  }

  const cachedResult = await getHistory(ENDPOINT_VERIFY, POST, text);
  if (cachedResult) { return cachedResult; }

  const req = createPOSTRequest(ENDPOINT_VERIFY, {
    "email": text
  });

  const responseObject = await sendRequest(req);

  // Post-processing results
  if (responseObject.result) {
    let result = responseObject.result;

    const riskScoreClassification = result.risk.classification.technicalKey;
    const riskScoreClassificationLabel = `riskScoreClassification_${riskScoreClassification}`;

    const summary = [
      {
        label: browser.i18n.getMessage("riskScoreLabel"),
        value: `${result.risk.score}% (${browser.i18n.getMessage(riskScoreClassificationLabel)})`,
        className: `risk-classification-${riskScoreClassification}`
      }
    ];

    VERIFY_SUMMARY_ITEMS.forEach(item => {
      summary.push({
        label: browser.i18n.getMessage(`${item}Label`),
        value: result.summary[item] ? browser.i18n.getMessage("yes") : browser.i18n.getMessage("no"),
        className: result.summary[item] ? "risk-marked-yes" : "risk-marked-no"
      });
    });

    responseObject.result = {
      title: result.email,
      summary
    };
  }
  // ---

  setHistory(ENDPOINT_VERIFY, POST, text, responseObject);
  return responseObject;
}
