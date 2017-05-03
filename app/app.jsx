import React from 'react';
import ReactDOM from 'react-dom';
import LoginApp from './components/LoginApp';
var {Route, Router, IndexRoute, hashHistory} = require('react-router');

// Load foundation
$(document).foundation();

// App css
require('style!css!sass!applicationStyles');

ReactDOM.render(
    <LoginApp/>,
    document.getElementById('app'));
