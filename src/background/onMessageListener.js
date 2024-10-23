// import browser from "webextension-polyfill";
import { initSettings } from "src/settings";
import { bankAccountNameLookup, emailVerify } from "src/common/api";

console.log("onMessageListener.js");

export default async data => {
  await initSettings();
  switch (data.message) {

  case "bankAccountNameLookupFetch": {    
    return await bankAccountNameLookup(data.text);
  }

  case "emailVerify": {
    return await emailVerify(data.text);
  }

  }
}
