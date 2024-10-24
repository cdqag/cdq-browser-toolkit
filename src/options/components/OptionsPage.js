import React from "react";
import browser from "webextension-polyfill";
import { HashRouter } from "react-router-dom";
import SideBar from "./SideBar";
import ContentsArea from "./ContentsArea";
import ScrollToTop from "./ScrollToTop";
import "../styles/OptionsPage.scss";

const UILanguage =  browser.i18n.getUILanguage()
const rtlLanguage = ['he', 'ar'].includes(UILanguage)
const optionsPageClassName = 'option-page' + (rtlLanguage ? ' rtl-language' : '')

export default () => {
  return (
    <HashRouter hashType="noslash">
      <ScrollToTop>
        <div className={optionsPageClassName}>
          <SideBar />
          <ContentsArea />
        </div>
      </ScrollToTop>
    </HashRouter>
  );
};
