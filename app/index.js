// Import React and JS
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'styles/style.scss'; // CSS
import store from 'store/store.js';
import MainPage from 'components/MainPage.jsx';
import AboutPage from 'components/AboutPage.jsx';
import WeightingFactorsPage from 'components/WeightingFactorsPage.jsx';

// Render
ReactDOM.render(
  (<Provider store={store} >
   <Router history={hashHistory}>
   <Route path="/" component={MainPage}/>
   <Route path="/about" component={AboutPage}/>
   <Route path="/weightingfactors" component={WeightingFactorsPage}/>
   </Router>
   </Provider>
  ),
  document.body.appendChild(document.createElement('div'))
);
