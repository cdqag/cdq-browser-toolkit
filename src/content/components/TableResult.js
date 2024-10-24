import React, { Component } from "react";
import classNames from "classnames";

export default class TableResult extends Component {

  constructor(props) {
    super(props);

    // Props:
    //   result
  }

  render = () => {
    const title = this.props.result.title;
    const summary = this.props.result.summary;

    return (
      <div className="cdq-browser-toolkit-table-result">
        <div className="cdq-browser-toolkit-h2">{title}</div>
        <div className="cdq-browser-toolkit-table">
          {summary.map(function (item, index) {
            const valueClassName = classNames([
              "cdq-browser-toolkit-table-cell-value",
              item.className
            ]);
            
            return <div key={index} className="cdq-browser-toolkit-table-row">
              <div className="cdq-browser-toolkit-table-cell-label">{item.label}:</div>
              <div className={valueClassName}>{item.value}</div>
            </div>
          })}
        </div>
      </div>
    );
  };
}
