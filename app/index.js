import './css/style.scss'; // CSS

//// Import React and JS
import { createStore } from 'redux';
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import reducer from './reducers/reducers.js';

import App from 'components/App.jsx';
import About from 'components/About.jsx';

const store = createStore(reducer);

// Render
ReactDOM.render((
    <Provider store={store} >
    <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/about" component={About}/>
    </Router>
    </Provider>),
  document.body.appendChild(document.createElement("div")));
