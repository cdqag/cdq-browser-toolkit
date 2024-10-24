import React, {
  useState, useEffect 
} from "react";
import browser from "webextension-polyfill";
import browserInfo from "browser-info";
import queryString from "query-string";
import OptionsContainer from "./OptionContainer";
import {
  chromeExtensionUrl,
  firefoxAddonUrl
} from "src/common/personalUrls";
import manifest from "src/manifest-chrome.json";

export default props => {
  const query = queryString.parse(props.location.search);
  const extensionVersion = manifest.version;

  const [hasPermission, requestPermission] = useAdditionalPermission();

  return (
    <div>
      <p className="content-title">{browser.i18n.getMessage("informationLabel")}</p>
      <hr />
      <OptionsContainer
        title={"extName"}
        captions={[]}
        type={"none"}
        updated={query.action === "updated"}
        extraCaption={
          <p className="caption">
            <a href="https://github.com/cdqag/cdq-browser-extension/releases" target="_blank" rel="noreferrer">
              Version {extensionVersion}
            </a>
          </p>
        }
      />

      <OptionsContainer
        title={"licenseLabel"}
        captions={["Mozilla Public License, Version. 2.0"]}
        useRawCaptions={true}
        type={"none"}
      />

      {!hasPermission &&
        <>
          <hr />
          <OptionsContainer
            title={"additionalPermissionLabel"}
            captions={["additionalPermissionCaptionLabel"]}
            type={"button"}
            value={"enableLabel"}
            onClick={requestPermission}
          />
        </>
      }

      <hr />
      <OptionsContainer
        title={""}
        captions={[]}
        type={"none"}
        extraCaption={
          <div>
            <p>
              {browserInfo().name === "Chrome" ? (
                <a href={chromeExtensionUrl} target="_blank" rel="noreferrer">
                  {browser.i18n.getMessage("extensionPageLabel")}
                </a>
              ) : (
                <a href={firefoxAddonUrl} target="_blank" rel="noreferrer">
                  {browser.i18n.getMessage("addonPageLabel")}
                </a>
              )}
              <span>&nbsp;</span>
              <a href="https://github.com/cdqag/cdq-browser-extension" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </p>
          </div>
        }
      />
    </div>
  );
};

const useAdditionalPermission = () => {
  const [hasPermission, setHasPermission] = useState(true);

  const permissions = {
    origins: [
      "http://*/*",
      "https://*/*",
      "<all_urls>"
    ]
  };

  const checkPermission = async () => {
    const hasPermission = await browser.permissions.contains(permissions);
    setHasPermission(hasPermission);
  }

  const requestPermission = async () => {
    await browser.permissions.request(permissions);
    checkPermission();
  }

  useEffect(() => {
    checkPermission();
  }, []);

  return [hasPermission, requestPermission];
}
