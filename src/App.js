import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import './App.css';
import { useUserState } from "./contexts/UserContext";
import Layout from './components/Layout';
import Login from './pages/Login';
import Error from './pages/Error';

function App() {
  const { isAuthenticated, user } = useUserState();
  // console.log(isAuthenticated)
  const PrivateRoute = ({ component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props => {
          return (isAuthenticated === true) ?
            React.createElement(component, props)
            : isAuthenticated === false ?
              <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
              : <></>
        }}
      />
    );
  }
  const PublicRoute = ({ component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props => {
          return (isAuthenticated === true) ?
            <Redirect to={{ pathname: "/" }} />
            : isAuthenticated === false ?
              React.createElement(component, props)
              : <></>
        }}
      />
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/overview" />} />
        <Route exact path="/app" render={() => <Redirect to="/app/overview" />} />
        <PrivateRoute path="/app" component={Layout} />
        <PublicRoute path="/login" component={Login} />
        {/* <Route component={Layout} /> */}
        <Route component={Error} />
      </Switch>
    </Router>
  );
}

export default App;
