import React, { Component } from "react";
import classNames from "classnames";
import browser from "webextension-polyfill";
import ResultsPanel from "./ResultsPanel";
import ErrorResult from "./ErrorResult";
import TableResult from "./TableResult";
import "../styles/ResultsContainer.scss";

export default class ResultsContainer extends Component {

  constructor(props) {
    super(props);

    // Props:
    //   position
    //   result
    //   error
    //   isLoading

    this.state = {
      position: props.position
    };
  }

  render = () => {
    const { isLoading, error, result } = this.props;

    const panelClassNames = classNames({
      isLoading: isLoading,
      isError: !!error
    });

    const style = {};

    let content;
    if (isLoading) {
      let loadingGif = browser.runtime.getURL("icons/loading.gif");
      style.backgroundImage = `url(${loadingGif})`;
      content = "";

    } else if (error) {
      content = <ErrorResult error={error} />;
      
    } else {
      content = <TableResult result={result} />;
    }

    return (
      <ResultsPanel
        className={panelClassNames}
        style={style}
        position={this.state.position}>
        {content}
      </ResultsPanel>
    );
  };
}
