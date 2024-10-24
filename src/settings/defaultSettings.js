import React from "react";
import browser from "webextension-polyfill";
import { getSettings, setSettings  } from ".";


export default [
  {
    category: "generalLabel",
    elements: [
      {
        id: "apiKey",
        title: "apiKeyLabel",
        captions: ["apiKeyCaptionLabel"],
        type: "textarea",
        default: "",
        placeholder: ""
      }
      // {
      //   id: "translationApi",
      //   title: "translationApiLabel",
      //   captions: [],
      //   type: "none",
      //   default: "google",
      //   child-elements: [
      //     {
      //       id: "translationApi",
      //       title: "googleApiLabel",
      //       captions: ["googleApiCaptionLabel"],
      //       type: "radio",
      //       value: "google",
      //       handleChange: () => updateLangsWhenChangeTranslationApi()
      //     },
      //     {
      //       id: "translationApi",
      //       title: "deeplApiLabel",
      //       captions: ["deeplApiCaptionLabel"],
      //       extraCaption:
      //         React.createElement("p",
      //           { className: "caption" },
      //           React.createElement("a",
      //             {
      //               href: "https://github.com/cdqag/cdq-browser-extension/wiki/How-to-register-DeepL-API",
      //               target: "_blank"
      //             },
      //             browser.i18n.getMessage("howToUseDeeplLabel"))
      //         ),
      //       type: "radio",
      //       value: "deepl",
      //       handleChange: () => updateLangsWhenChangeTranslationApi()
      //     },
      //     {
      //       id: "deeplPlan",
      //       title: "deeplPlanLabel",
      //       captions: ["deeplPlanCaptionLabel"],
      //       type: "select",
      //       default: "deeplFree",
      //       shouldShow: () => (getSettings("translationApi") === "deepl"),
      //       hr: true,
      //       options: [
      //         {
      //           name: "deeplFreeLabel",
      //           value: "deeplFree"
      //         },
      //         {
      //           name: "deeplProLabel",
      //           value: "deeplPro"
      //         },
      //       ]
      //     },
      //     {
      //       id: "deeplAuthKey",
      //       title: "deeplAuthKeyLabel",
      //       captions: ["deeplAuthKeyCaptionLabel"],
      //       type: "text",
      //       default: "",
      //       placeholder: "00000000-0000-0000-0000-00000000000000:fx",
      //       shouldShow: () => (getSettings("translationApi") === "deepl"),
      //     }
      //   ]
      // },
      // {
      //   id: "targetLang",
      //   title: "targetLangLabel",
      //   captions: ["targetLangCaptionLabel"],
      //   type: "select",
      //   default: defaultLangs.targetLang,
      //   options: () => generateLangOptions(getSettings("translationApi")),
      //   useRawOptionName: true
      // },
      // {
      //   id: "secondTargetLang",
      //   title: "secondTargetLangLabel",
      //   captions: ["secondTargetLangCaptionLabel"],
      //   type: "select",
      //   default: defaultLangs.secondTargetLang,
      //   options: () => generateLangOptions(getSettings("translationApi")),
      //   useRawOptionName: true
      // },
      // {
      //   id: "ifShowCandidate",
      //   title: "ifShowCandidateLabel",
      //   captions: ["ifShowCandidateCaptionLabel"],
      //   type: "checkbox",
      //   default: true,
      //   shouldShow: () => (getSettings("translationApi") === "google")
      // }
    ]
  },
  // {
  //   category: "webPageLabel",
  //   elements: [
  //     {
  //       id: "ifChangeSecondLangOnPage",
  //       title: "ifChangeSecondLangLabel",
  //       captions: ["ifChangeSecondLangOnPageCaptionLabel"],
  //       type: "checkbox",
  //       default: false
  //     }
  //   ]
  // },
  // {
  //   category: "toolbarLabel",
  //   elements: [
  //     {
  //       id: "waitTime",
  //       title: "waitTimeLabel",
  //       captions: ["waitTimeCaptionLabel", "waitTime2CaptionLabel"],
  //       type: "number",
  //       min: 0,
  //       placeholder: 500,
  //       default: 500
  //     },
  //     {
  //       id: "ifChangeSecondLang",
  //       title: "ifChangeSecondLangLabel",
  //       captions: ["ifChangeSecondLangCaptionLabel"],
  //       type: "checkbox",
  //       default: true
  //     }
  //   ]
  // },
  {
    category: "menuLabel",
    elements: [
      {
        id: "ifShowMenu",
        title: "ifShowMenuLabel",
        captions: ["ifShowMenuCaptionLabel"],
        type: "checkbox",
        default: true
      }
    ]
  },
  // {
  //   category: "pageTranslationLabel",
  //   elements: [
  //     {
  //       id: "pageTranslationOpenTo",
  //       title: "pageTranslationOpenToLabel",
  //       captions: ["pageTranslationOpenToCaptionLabel"],
  //       type: "select",
  //       default: "newTab",
  //       options: [
  //         {
  //           name: "newTabLabel",
  //           value: "newTab"
  //         },
  //         {
  //           name: "currentTabLabel",
  //           value: "currentTab"
  //         },
  //       ]
  //     }
  //   ]
  // },
  // {
  //   category: "styleLabel",
  //   elements: [
  //     {
  //       id: "theme",
  //       title: "themeLabel",
  //       captions: ["themeCaptionLabel"],
  //       type: "select",
  //       default: 'system',
  //       options: [
  //         {
  //           name: "lightLabel",
  //           value: "light"
  //         },
  //         {
  //           name: "darkLabel",
  //           value: "dark"
  //         },
  //         {
  //           name: "systemLabel",
  //           value: "system"
  //         }
  //       ]
  //     },
  //     {
  //       title: "buttonStyleLabel",
  //       captions: ["buttonStyleCaptionLabel"],
  //       type: "none",
  //       child-elements: [
  //         {
  //           id: "buttonSize",
  //           title: "buttonSizeLabel",
  //           captions: [],
  //           type: "number",
  //           min: 1,
  //           placeholder: 22,
  //           default: 22
  //         },
  //         {
  //           id: "buttonDirection",
  //           title: "displayDirectionLabel",
  //           captions: [],
  //           type: "select",
  //           default: "bottomRight",
  //           options: [
  //             {
  //               name: "topLabel",
  //               value: "top"
  //             },
  //             {
  //               name: "bottomLabel",
  //               value: "bottom"
  //             },
  //             {
  //               name: "rightLabel",
  //               value: "right"
  //             },
  //             {
  //               name: "leftLabel",
  //               value: "left"
  //             },
  //             {
  //               name: "topRightLabel",
  //               value: "topRight"
  //             },
  //             {
  //               name: "topLeftLabel",
  //               value: "topLeft"
  //             },
  //             {
  //               name: "bottomRightLabel",
  //               value: "bottomRight"
  //             },
  //             {
  //               name: "bottomLeftLabel",
  //               value: "bottomLeft"
  //             }
  //           ]
  //         },
  //         {
  //           id: "buttonOffset",
  //           title: "positionOffsetLabel",
  //           captions: [],
  //           type: "number",
  //           default: 10,
  //           placeholder: 10
  //         }
  //       ]
  //     },
  //     {
  //       title: "panelStyleLabel",
  //       captions: ["panelStyleCaptionLabel"],
  //       type: "none",
  //       child-elements: [

  //         {
  //           id: "fontSize",
  //           title: "fontSizeLabel",
  //           captions: [],
  //           type: "number",
  //           min: 1,
  //           placeholder: 13,
  //           default: 13
  //         },
  //         {
  //           id: "panelReferencePoint",
  //           title: "referencePointLabel",
  //           captions: [],
  //           type: "select",
  //           default: "bottomSelectedText",
  //           options: [
  //             {
  //               name: "topSelectedTextLabel",
  //               value: "topSelectedText"
  //             },
  //             {
  //               name: "bottomSelectedTextLabel",
  //               value: "bottomSelectedText"
  //             },
  //             {
  //               name: "clickedPointLabel",
  //               value: "clickedPoint"
  //             }
  //           ]
  //         },
  //         {
  //           id: "panelDirection",
  //           title: "displayDirectionLabel",
  //           captions: [],
  //           type: "select",
  //           default: "bottom",
  //           options: [
  //             {
  //               name: "topLabel",
  //               value: "top"
  //             },
  //             {
  //               name: "bottomLabel",
  //               value: "bottom"
  //             },
  //             {
  //               name: "rightLabel",
  //               value: "right"
  //             },
  //             {
  //               name: "leftLabel",
  //               value: "left"
  //             },
  //             {
  //               name: "topRightLabel",
  //               value: "topRight"
  //             },
  //             {
  //               name: "topLeftLabel",
  //               value: "topLeft"
  //             },
  //             {
  //               name: "bottomRightLabel",
  //               value: "bottomRight"
  //             },
  //             {
  //               name: "bottomLeftLabel",
  //               value: "bottomLeft"
  //             }
  //           ]
  //         },
  //         {
  //           id: "isOverrideColors",
  //           title: "isOverrideColorsLabel",
  //           captions: [],
  //           type: "checkbox",
  //           default: false
  //         },
  //         {
  //           id: "resultFontColor",
  //           title: "resultFontColorLabel",
  //           captions: [],
  //           type: "color",
  //           default:
  //             getTheme() === "light"
  //               ? RESULT_FONT_COLOR_LIGHT
  //               : RESULT_FONT_COLOR_DARK,
  //         },
  //         {
  //           id: "candidateFontColor",
  //           title: "candidateFontColorLabel",
  //           captions: [],
  //           type: "color",
  //           default:
  //             getTheme() === "light"
  //               ? CANDIDATE_FONT_COLOR_LIGHT
  //               : CANDIDATE_FONT_COLOR_DARK,
  //         },
  //         {
  //           id: "bgColor",
  //           title: "bgColorLabel",
  //           captions: [],
  //           type: "color",
  //           default: getTheme() === "light" ? BG_COLOR_LIGHT : BG_COLOR_DARK,
  //         },
  //       ]
  //     }
  //   ]
  // },
  {
    category: "otherLabel",
    elements: [
      {
        id: "isShowOptionsPageWhenUpdated",
        title: "isShowOptionsPageWhenUpdatedLabel",
        captions: ["isShowOptionsPageWhenUpdatedCaptionLabel"],
        type: "checkbox",
        default: true
      },
      {
        id: "isDebugMode",
        title: "isDebugModeLabel",
        captions: ["isDebugModeCaptionLabel"],
        type: "checkbox",
        default: false
      }
    ]
  }
];
