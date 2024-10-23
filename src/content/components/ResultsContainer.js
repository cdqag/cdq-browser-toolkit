import React, { Component } from "react";
import classNames from "classnames";
import browser from "webextension-polyfill";
// import { getSettings  } from "src/settings";
import ResultsPanel from "./ResultsPanel";
import "../styles/ResultsContainer.scss";

// const translateText = async (text, targetLang = getSettings("targetLang")) => {
//   const result = await browser.runtime.sendMessage({
//     message: 'translate',
//     text: text,
//     sourceLang: 'auto',
//     targetLang: targetLang,
//   });
//   return result;
// };

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
      const ers = error.split(": ", 2);
      content = <div>
        <h2>{ers[0]}</h2>
        <p>{ers[1]}</p>
      </div>;
      
    } else {
      console.log(result);
      content = <div>
        <h2>{result.title}</h2>
        <table>
          <tbody>
            {result.summary.map(function (item, index) {
              return <tr key={index}>
                <th>{item.label}:</th>
                <td>{item.value}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>;
    }

    return (
      <div>
        <ResultsPanel
          className={panelClassNames}
          style={style}
          position={this.state.position}>
          {content}
        </ResultsPanel>
      </div>
    );
  };
}
