import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import MyLayout from '../pages/layout/index'
import Demo1 from '../pages/demo1/index'
function routerConfig() {
  return <Router>
    <Switch>
      <Route path="/" component={MyLayout}>
        <MyLayout>
          <Switch>
            <Route path="/demo1" component={Demo1}></Route>
          </Switch>
        </MyLayout>
      </Route>
    </Switch>
  </Router>
}

export default routerConfig()
