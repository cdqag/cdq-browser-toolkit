import React, {
  Component 
} from "react";
import browser from "webextension-polyfill";
import { updateLogLevel, overWriteLogLevel  } from "src/common/log";
import { initSettings, getAllSettings,  handleSettingsChange  } from "src/settings";
import defaultSettings from "src/settings/defaultSettings";
import CategoryContainer from "./CategoryContainer";

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInit: false,
      currentValues: {
      }
    };
    this.init();
  }

  async init() {
    await initSettings();
    overWriteLogLevel();
    updateLogLevel();
    this.setState({
      isInit: true, currentValues: getAllSettings() 
    });
    browser.storage.local.onChanged.addListener(changes => {
      const newSettings = handleSettingsChange(changes);
      if (newSettings) { this.setState({
        currentValues: newSettings 
      }); }
    });
  }

  render() {
    const {
      isInit, currentValues 
    } = this.state;
    const settingsContent = (
      <ul>
        {defaultSettings.map((category, index) => (
          <CategoryContainer {...category} key={index} currentValues={currentValues} />
        ))}
      </ul>
    );

    return (
      <div>
        <p className="contentTitle">{browser.i18n.getMessage("settingsLabel")}</p>
        <hr />
        {isInit ? settingsContent : ""}
      </div>
    );
  }
}
