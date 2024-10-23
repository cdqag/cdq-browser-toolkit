import browser from "webextension-polyfill";

export async function getActiveTab() {
  const activeTab = (await browser.tabs.query({
    currentWindow: true,
    active: true 
  }))[0];
  return activeTab;
}

export async function openUrl(url) {
  const activeTab = await getActiveTab();

  browser.tabs.create({
    url,
    index: activeTab.index + 1 
  });
};
