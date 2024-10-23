import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import "../styles/ResultsPanel.scss";

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;
const DEFAULT_OFFSET = 10;
const DEFAULT_DIRECTION = "bottom";

export default class ResultsPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isShown: false,
      panelPosition: {
        x: 0, y: 0 
      },
      panelWidth: 0,
      panelHeight: 0,
      isOverflow: false
    };
  }

  calcPosition = () => {
    const maxWidth = DEFAULT_WIDTH;
    const maxHeight = DEFAULT_HEIGHT;
    const wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
    const panelWidth = Math.min(wrapper.clientWidth, maxWidth);
    const panelHeight = Math.min(wrapper.clientHeight, maxHeight);
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const referencePosition = this.props.position;
    const offset = DEFAULT_OFFSET;

    let position = {
      x: 0, y: 0 
    };
    const panelDirection = DEFAULT_DIRECTION;
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
    const maxWidth = DEFAULT_WIDTH;
    const wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
    const wrapperWidth = wrapper.clientWidth < maxWidth ? wrapper.clientWidth + 1 : maxWidth;
    const wrapperHeight = wrapper.clientHeight;
    return {
      panelWidth: wrapperWidth, panelHeight: wrapperHeight 
    };
  };

  componentDidMount = () => {
    console.log("ResultsPanel componentDidMount");
    this.setState({
      isShown: true 
    });
  };

  componentDidUpdate = () => {
    console.log("ResultsPanel componentDidUpdate");

    if (!this.props.position) {
      console.log("ResultsPanel componentDidUpdate: no position");
      return;
    }

    const panelPosition = this.calcPosition();
    const {
      panelWidth, panelHeight 
    } = this.calcSize();
    const isOverflow = panelHeight == DEFAULT_HEIGHT;

    if (this.state.panelPosition.x === panelPosition.x &&
        this.state.panelPosition.y === panelPosition.y &&
        this.state.panelWidth === panelWidth &&
        this.state.panelHeight === panelHeight &&
        this.state.isOverflow === isOverflow) {
      return;
    }

    this.setState({
      panelPosition: panelPosition,
      panelWidth: panelWidth,
      panelHeight: panelHeight,
      isOverflow: isOverflow,
      isShown: true
    });
  };

  render = () => {
    const panelStyles = Object.assign({}, this.props.style, {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      top: this.state.panelPosition.y,
      left: this.state.panelPosition.x
    });

    const wrapperStyles = {
      overflow: this.state.isOverflow ? "auto" : "hidden"
    };

    const panelClassNames = classNames([
      "cdq-browser-toolkit-panel",
      this.props.className,
      {
        "isShown": this.state.isShown
      }
    ]);

    return (
      <div
        className={panelClassNames}
        ref="panel"
        style={panelStyles}
      >
        <div className="cdq-browser-toolkit-result-wrapper" ref="wrapper" style={wrapperStyles}>
          <div className="cdq-browser-toolkit-result-contents">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  };
}
