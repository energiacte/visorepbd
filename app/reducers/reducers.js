import { combineReducers } from 'redux';
import { SELECT_COMPONENT, ADD_COMPONENT } from '../actions/actions.js';

const initialselectedkey = 0;

function selectedkey(state = initialselectedkey, action) {
  switch (action.type) {
  case SELECT_COMPONENT:
    return (action.id);
  default:
    return state;
  }
}

const initialcomponents = [
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
];

function components(state = initialcomponents, action) {
  switch (action.type) {
  case ADD_COMPONENT:
    return ([... state, action.component]);
  default:
    return state;
  }
}

export default combineReducers({
  selectedkey,
  components
});
