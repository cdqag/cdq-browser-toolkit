import React, { Component } from "react";

export default class ErrorResult extends Component {

  constructor(props) {
    super(props);

    // Props:
    //   error
  }

  render = () => {
    const parts = this.props.error.split(": ", 2);
    const title = parts[0];
    const message = parts[1];

    return (
      <div className="cdq-browser-toolkit-error-result">
        <div className="cdq-browser-toolkit-h2">{title}</div>
        <div className="cdq-browser-toolkit-p">{message}</div>
      </div>
    );
  };
}
