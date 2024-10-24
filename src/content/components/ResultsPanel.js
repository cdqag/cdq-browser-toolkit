import React, { Component } from "react";
import classNames from "classnames";
import "../styles/ResultsPanel.scss";

const DEFAULT_OFFSET = 10;

const PANEL_ID = "cdq-browser-toolkit-panel";
const PANEL_MIN_WIDTH = 300;
const PANEL_MIN_HEIGHT = 200;

export default class ResultsPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isShown: false,

      box: {
        x: 0,
        y: 0,
        w: 0,
        h: 0 
      }
    };
  }

  getElem = () => {
    return document.getElementById(PANEL_ID);
  };

  calcBox = () => {
    const refPos = this.props.position;
    const offset = DEFAULT_OFFSET;

    const box = {
      x: refPos.x,
      y: refPos.y,
      w: Math.max(this.getElem().offsetWidth, PANEL_MIN_WIDTH),
      h: Math.max(this.getElem().offsetHeight, PANEL_MIN_HEIGHT)
    }


    if (box.x + box.w > window.innerWidth) {
      box.x = window.innerWidth - box.w - offset;
    }

    if (box.y + box.h > window.innerHeight) {
      box.y = window.innerHeight - box.h - offset;
    }

    return box;
  };

  componentDidMount = () => {
    this.setState({
      isShown: true 
    });
  };

  componentDidUpdate = () => {
    let box;

    try {
      box = this.calcBox();
    // eslint-disable-next-line no-unused-vars
    } catch(ignored) {
      return;
    }

    if (this.state.box.x === box.x &&
        this.state.box.y === box.y &&
        this.state.box.w === box.w &&
        this.state.box.h === box.h) {
      return;
    }

    this.setState({
      box,
      isShown: true
    });
  };

  render = () => {
    const panelStyles = Object.assign({}, this.props.style, {
      width: this.state.box.w,
      height: this.state.box.h,
      top: this.state.box.y,
      left: this.state.box.x
    });

    const panelClassNames = classNames([
      this.props.className,
      {
        "isShown": this.state.isShown
      }
    ]);

    return (
      <div id={PANEL_ID}
        className={panelClassNames}
        style={panelStyles}>
        {this.props.children}
      </div>
    );
  };
}
