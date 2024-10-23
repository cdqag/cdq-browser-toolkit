import browser from "webextension-polyfill";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { getSettings  } from "src/settings";
import "../styles/ResultsPanel.scss";

const splitLine = text => {
  const regex = /(\n)/g;
  return text.split(regex).map((line, i) => (line.match(regex) ? <br key={i} /> : line));
};

export default class ResultsPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      panelPosition: {
        x: 0, y: 0 
      },
      panelWidth: 0,
      panelHeight: 0,
      shouldResize: true,
      isOverflow: false
    };
  }

  calcPosition = () => {
    const maxWidth = parseInt(getSettings("width"));
    const maxHeight = parseInt(getSettings("height"));
    const wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
    const panelWidth = Math.min(wrapper.clientWidth, maxWidth);
    const panelHeight = Math.min(wrapper.clientHeight, maxHeight);
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const referencePosition = this.props.position;
    const offset = parseInt(getSettings("panelOffset"));

    let position = {
      x: 0, y: 0 
    };
    const panelDirection = getSettings("panelDirection");
    switch (panelDirection) {
    case "top":
      position.x = referencePosition.x - panelWidth / 2;
      position.y = referencePosition.y - panelHeight - offset;
      break;
    case "bottom":
      position.x = referencePosition.x - panelWidth / 2;
      position.y = referencePosition.y + offset;
      break;
    case "right":
      position.x = referencePosition.x + offset;
      position.y = referencePosition.y - panelHeight / 2;
      break;
    case "left":
      position.x = referencePosition.x - panelWidth - offset;
      position.y = referencePosition.y - panelHeight / 2;
      break;
    case "topRight":
      position.x = referencePosition.x + offset;
      position.y = referencePosition.y - panelHeight - offset;
      break;
    case "topLeft":
      position.x = referencePosition.x - panelWidth - offset;
      position.y = referencePosition.y - panelHeight - offset;
      break;
    case "bottomRight":
      position.x = referencePosition.x + offset;
      position.y = referencePosition.y + offset;
      break;
    case "bottomLeft":
      position.x = referencePosition.x - panelWidth - offset;
      position.y = referencePosition.y + offset;
      break;
    }

    if (position.x + panelWidth > windowWidth - offset) {
      position.x = windowWidth - panelWidth - offset;
    }
    if (position.y + panelHeight > windowHeight - offset) {
      position.y = windowHeight - panelHeight - offset;
    }
    if (position.x < 0 + offset) {
      position.x = offset;
    }
    if (position.y < 0 + offset) {
      position.y = offset;
    }
    return position;
  };

  calcSize = () => {
    const maxWidth = parseInt(getSettings("width"));
    const wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
    const wrapperWidth = wrapper.clientWidth < maxWidth ? wrapper.clientWidth + 1 : maxWidth;
    const wrapperHeight = wrapper.clientHeight;
    return {
      panelWidth: wrapperWidth, panelHeight: wrapperHeight 
    };
  };

  componentWillReceiveProps = nextProps => {
    const isChangedContents =
      this.props.resultText !== nextProps.resultText ||
      this.props.candidateText !== nextProps.candidateText ||
      this.props.position !== nextProps.position;

    if (isChangedContents && nextProps.shouldShow) { this.setState({
      shouldResize: true 
    }); }
  };

  componentDidUpdate = () => {
    if (!this.state.shouldResize || !this.props.shouldShow) { return; }
    const panelPosition = this.calcPosition();
    const {
      panelWidth, panelHeight 
    } = this.calcSize();
    const isOverflow = panelHeight == parseInt(getSettings("height"));

    this.setState({
      shouldResize: false,
      panelPosition: panelPosition,
      panelWidth: panelWidth,
      panelHeight: panelHeight,
      isOverflow: isOverflow
    });
  };

  render = () => {
    const {
      shouldShow, selectedText, currentLang, resultText, candidateText, isError, errorMessage 
    } = this.props;
    const {
      width, height 
    } = this.state.shouldResize
      ? {
        width: parseInt(getSettings("width")), height: parseInt(getSettings("height")) 
      }
      : {
        width: this.state.panelWidth, height: this.state.panelHeight 
      };

    const panelStyles = {
      width: width,
      height: height,
      top: this.state.panelPosition.y,
      left: this.state.panelPosition.x,
      fontSize: parseInt(getSettings("fontSize")),
    };

    const backgroundColor = getBackgroundColor()
    if (backgroundColor) {
      panelStyles.backgroundColor = backgroundColor.backgroundColor
    }

    const wrapperStyles = {
      overflow: this.state.isOverflow ? "auto" : "hidden"
    };

    const translationApi = getSettings("translationApi");

    return (
      <div
        className={`cdq-browser-toolkit-panel ${shouldShow ? "isShow" : ""}`}
        ref="panel"
        style={panelStyles}
      >
        <div className="cdq-browser-toolkit-result-wrapper" ref="wrapper" style={wrapperStyles}>
          <div className="cdq-browser-toolkit-result-contents">
            <p className="cdq-browser-toolkit-result" dir="auto">
              {splitLine(resultText)}
            </p>
            <p className="cdq-browser-toolkit-candidate" dir="auto">
              {splitLine(candidateText)}
            </p>
            {isError && (
              <p className="cdq-browser-toolkit-error">
                {errorMessage}
                <br />
                <a href={translationApi === "google" ?
                  `https://translate.google.com/?sl=auto&tl=${currentLang}&text=${encodeURIComponent(selectedText)}` :
                  `https://www.deepl.com/translator#auto/${currentLang}/${encodeURIComponent(selectedText)}`
                }
                target="_blank" rel="noreferrer">
                  {translationApi === "google" ?
                    browser.i18n.getMessage("openInGoogleLabel") :
                    browser.i18n.getMessage("openInDeeplLabel")}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
}
