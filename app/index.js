import './css/style.scss'; // CSS

//// Import React and JS
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import epbdApp from './reducers/reducers.js';
import { addComponent, selectComponent } from './actions/actions.js'


import Base from 'components/Base.jsx';

const initialstate = {
  selectedkey: null,
  components: [
    {
      type: 'Suministro',
      originoruse: 'EPB',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Suministro',
      originoruse: 'NEPB',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Producción',
      originoruse: 'INSITU',
      vector: 'MEDIOAMBIENTE',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      type: 'Producción',
      originoruse: 'COGENERACION',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }
  ]
};

let store = createStore(epbdApp, initialstate);
// Log the initial state
console.log(store.getState());

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() => console.log(store.getState()) );

// Dispatch some actions
store.dispatch(addComponent({type: 'Suministro',
                             originoruse: 'EPB',
                             vector: 'ELECTRICIDAD',
                             values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
}));
store.dispatch(selectComponent(3));

// Stop listening to state updates
unsubscribe();




var appnode = document.body.appendChild(document.createElement("div"));

// Render
ReactDOM.render(<Base headertitle="CTE DB-HE, aplicación de ISO 52000-1" state={initialstate} />, appnode);
