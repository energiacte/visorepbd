import { combineReducers } from 'redux';
import { SELECT_COMPONENT, ADD_COMPONENT } from '../actions/actions.js';

function selectedkey(state = null, action) {
  switch (action.type) {
  case SELECT_COMPONENT:
    return (action.id);
  default:
    return state;
  }
}

function components(state = [], action) {
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
