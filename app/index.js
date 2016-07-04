// Import React and JS
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'styles/style.scss'; // CSS
import store from 'store/store.js';
import MainPage from 'components/MainPage.jsx';
import About from 'components/About.jsx';
import WeightingFactors from 'components/WeightingFactors.jsx';

// Render
ReactDOM.render(
  (<Provider store={store} >
   <Router history={hashHistory}>
   <Route path="/" component={MainPage}/>
   <Route path="/about" component={About}/>
   <Route path="/weightingfactors" component={WeightingFactors}/>
   </Router>
   </Provider>
  ),
  document.body.appendChild(document.createElement('div'))
);
