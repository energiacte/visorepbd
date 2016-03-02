import { combineReducers } from 'redux';
import { SELECT_COMPONENT, ADD_COMPONENT } from '../actions/actions';

function selectedkey(state = null, action) {
  switch (action.type) {
  case SELECT_COMPONENT:
    return action.id;
  default:
    return state;
  };
}

function components(state = [], action) {
  switch (action.type) {
  case ADD_COMPONENT:
    return [
        ... state,
      {type: 'Suministro',
       originoruse: 'EPB',
       vector: 'ELECTRICIDAD',
       values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      }
    ];
  default:
    return state;
  }
}

const epbdApp = combineReducers({
  selectedkey,
  components
})

export default epbdApp;
