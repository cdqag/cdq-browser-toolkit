import React from "react";
import browser from "webextension-polyfill";
import OptionContainer from "./OptionContainer";
import "../styles/CategoryContainer.scss";

export default props => {
  const {
    category, elements, currentValues = {
    } 
  } = props;
  return (
    <li className="category-container">
      <fieldset>
        <legend>
          <p className="category-title">
            {category !== "" ? browser.i18n.getMessage(category) : ""}
          </p>
        </legend>
        <ul className="category-elements">
          {elements.map((option, index) => (
            <div key={index}>
              <OptionContainer {...option} currentValue={currentValues[option.id]}>
                {option.hasOwnProperty("child-elements") && (
                  <ul className="child-elements">
                    {option.child-elements.map((option, index) => (
                      <OptionContainer {...option} currentValue={currentValues[option.id]} key={index} />
                    ))}
                  </ul>
                )}
              </OptionContainer>
              <hr />
            </div>
          ))}
        </ul>
      </fieldset>
    </li>
  );
};
