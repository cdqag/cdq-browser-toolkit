import React from "react";
import { Route, Switch  } from "react-router-dom";
import SettingsPage from "./SettingsPage";
import InformationPage from "./InformationPage";
import "../styles/ContentsArea.scss";

export default () => (
  <div className="contents-area">
    <Switch>
      <Route path="/settings" component={SettingsPage} />
      <Route path="/information" component={InformationPage} />
      <Route component={SettingsPage} />
    </Switch>
  </div>
);
