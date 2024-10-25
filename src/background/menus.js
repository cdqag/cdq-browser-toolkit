import browser from "webextension-polyfill";
import { getSettings } from "src/settings";

export const showMenus = () => {
  removeMenus();

  if (getSettings("ifShowMenu")) { 
    createMenus();
  }
};

// eslint-disable-next-line no-unused-vars
export const onMenusShownListener = (info, tab) => {
  // Note: This is supported currently only on Firefox
  // TODO: Logic to hide/show context menu items based on the context

  // if (info.contexts.includes("selection") || info.contexts.includes("link")) {
  //   browser.contextMenus.update("translatePage", {
  //     visible: false 
  //   });
  // } else {
  //   browser.contextMenus.update("translatePage", {
  //     visible: true 
  //   });
  // }

  browser.contextMenus.refresh();
};

export const onMenusClickedListener = (info, tab) => {
  switch (info.menuItemId) {
  case "bankAccountNameLookupMenuItem":
    browser.tabs.sendMessage(tab.id, {
      message: "bankAccountNameLookupMenuItemClicked"
    });
    break;

  case "emailVerifyMenuItem":
    browser.tabs.sendMessage(tab.id, {
      message: "emailVerifyMenuItemClicked",
      payload: info.linkUrl
    });
    break;
  }
};

function createMenus() {
  browser.contextMenus.create({
    id: "bankAccountNameLookupMenuItem",
    title: browser.i18n.getMessage("bankAccountNameLookup"),
    contexts: ["selection"]
  });

  browser.contextMenus.create({
    id: "emailVerifyMenuItem",
    title: browser.i18n.getMessage("emailVerify"),
    contexts: ["selection", "link"]
  });
}

function removeMenus() {
  browser.contextMenus.removeAll();
}

// function translateLink(info, tab) {
//   const targetLang = getSettings("targetLang");
//   const encodedLinkUrl = encodeURIComponent(info.linkUrl);
//   const translationUrl = `https://translate.google.com/translate?hl=${targetLang}&tl=${targetLang}&sl=auto&u=${encodedLinkUrl}`;

//   browser.tabs.create({
//     url: translationUrl,
//     active: true,
//     index: tab.index + 1
//   });
// }
