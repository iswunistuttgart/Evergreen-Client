import React from 'react';
import ReactDOM from 'react-dom';
import LoginApp from './components/LoginApp';
import Home from './components/Home';

var {Route, Router, IndexRoute, hashHistory} = require('react-router');

// Load foundation
$(document).foundation();

// App css
require('style!css!sass!applicationStyles');

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={LoginApp} />
    <Route path="/home" component={Home} />
  </Router>
), document.getElementById('app'));
