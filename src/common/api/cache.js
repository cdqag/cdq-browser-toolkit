import browser from "webextension-polyfill";

export const getHistory = async (endpoint, method, text) => {
  const responseObject = await browser.storage.session.get(`${endpoint}-${method}-${text}`);
  return responseObject[`${endpoint}-${method}-${text}`] ?? false;
};

export const setHistory = async (endpoint, method, text, responseObject) => {
  if (responseObject.error != null) { return; }
  await browser.storage.session.set({
    [`${endpoint}-${method}-${text}`]: responseObject 
  });
};
