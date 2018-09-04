import React, { Component } from 'react';
import { Router, Route, Switch,BrowserRouter } from 'react-router-dom';
import history from '../components/history';
import Login from '../components/Login';
import App from '../App'; 

class MRoute extends Component {
  shouldComponentUpdate() {
    // POP 浏览器前进后退， PUSH 点击Link
    return this.props.location.action === "POP"
 }
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Login} />
          <App></App>
        </Switch>
      </Router>
    );
  }
}

export default MRoute;