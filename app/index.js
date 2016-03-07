//// Import React and JS
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'styles/style.scss'; // CSS
import store from 'store/store.js';
import App from 'components/App.jsx';
import About from 'components/About.jsx';

// Render
ReactDOM.render((
    <Provider store={store} >
    <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/about" component={About}/>
    </Router>
    </Provider>),
  document.body.appendChild(document.createElement("div")));
