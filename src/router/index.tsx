import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import MyLayout from '../pages/layout/index'
import Demo1 from '../pages/demo1/index'
import Demo2 from '../pages/demo2/index';
function routerConfig() {
  return <Router>
    <Switch>
      <Route path="/" component={MyLayout}>
        <MyLayout>
          <Switch>
            <Route path="/demo1" component={Demo1}></Route>
            <Route path="/demo2" component={Demo2}></Route>
            <Redirect to="/demo1"></Redirect>
          </Switch>
        </MyLayout>
      </Route>
    </Switch>
  </Router>
}

export default routerConfig()
