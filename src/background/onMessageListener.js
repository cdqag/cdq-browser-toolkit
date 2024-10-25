// import browser from "webextension-polyfill";
import { initSettings } from "src/settings";

import {
  bankAccountNameLookup,
  checkBankAccountScore,
  emailVerify
} from "src/common/api";

export default async data => {
  await initSettings();
  
  switch (data.message) {

  case "bankAccountNameLookupFetch": {
    return await bankAccountNameLookup(data.text);
  }

  case "checkBankAccountScoreFetch": {
    return await checkBankAccountScore(data.text);
  }

  case "emailVerifyFetch": {
    return await emailVerify(data.text);
  }

  }
}
