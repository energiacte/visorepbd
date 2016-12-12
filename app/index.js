// Import React and JS
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'img/favicon.ico';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/style.scss'; // CSS
import store from 'store/store.js';
import MainPage from 'components/MainPage.jsx';
import WeightingFactorsPage from 'components/WeightingFactorsPage.jsx';
import HelpPage from 'components/HelpPage.jsx';
import AboutPage from 'components/AboutPage.jsx';

// Render
ReactDOM.render(
  (<Provider store={store} >
   <Router history={hashHistory}>
   <Route path="/" component={MainPage}/>
   <Route path="/weightingfactors" component={WeightingFactorsPage}/>
   <Route path="/help" component={HelpPage}/>
   <Route path="/about" component={AboutPage}/>
   </Router>
   </Provider>
  ),
  document.body.appendChild(document.createElement('div'))
);
