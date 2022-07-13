import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import MyLayout from '../pages/layout';
import Demo1 from '../pages/demo1';
import Demo2 from '../pages/demo2';
import Demo3 from '../pages/demo3';
import Demo4 from '../pages/demo4';
import Demo5 from '../pages/demo5';
import Demo6 from '../pages/demo6';
function routerConfig() {
  return <Router>
    <Switch>
      <Route path="/" component={MyLayout}>
        <MyLayout>
          <Switch>
            <Route path="/demo1" component={Demo1}></Route>
            <Route path="/demo2" component={Demo2}></Route>
            <Route path="/demo3" component={Demo3}></Route>
            <Route path="/demo4" component={Demo4}></Route>
            <Route path="/demo5" component={Demo5}></Route>
            <Route path="/demo6" component={Demo6}></Route>
            <Redirect to="/demo1"></Redirect>
          </Switch>
        </MyLayout>
      </Route>
    </Switch>
  </Router>
}

export default routerConfig()
