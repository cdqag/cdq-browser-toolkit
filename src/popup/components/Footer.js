import React, {
  Component 
} from "react";
import browser from "webextension-polyfill";
import { openUrl } from "src/common/tabs";
import { getSettings  } from "src/settings";
import "../styles/Footer.scss";

export default class Footer extends Component {
  handleLinkClick = async () => {
    const translateUrl = `https://translate.google.com/translate?hl=${targetLang}&tl=${targetLang}&sl=auto&u=${encodedUrl}`;
    const isCurrentTab = getSettings("pageTranslationOpenTo") === "currentTab";
    openUrl(translateUrl, isCurrentTab);
  };

  render() {
    return (
      <div id="footer">
        <div className="cloudAppsLink">
          <a onClick={this.handleLinkClick}>{browser.i18n.getMessage("openCloudApps")}</a>
        </div>
      </div>
    );
  }
}
