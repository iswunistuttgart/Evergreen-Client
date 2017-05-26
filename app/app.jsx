import React from 'react';
import ReactDOM from 'react-dom';
import LoginApp from './components/LoginApp';
import Home from './components/Home';
import newPage from './components/newPage';

var {Route, Router, IndexRoute, hashHistory} = require('react-router');

// Load foundation
$(document).foundation();
$('head').append('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1">');
// App css
require('style!css!sass!applicationStyles');

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={LoginApp} />
    <Route path="/home" component={Home} />
    <Route path="/newPage/:pageId" component={newPage} />
  </Router>
), document.getElementById('app'));
