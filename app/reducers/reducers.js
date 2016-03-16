import { combineReducers } from 'redux';
import { SELECT_ENERGY_COMPONENT,
         ADD_ENERGY_COMPONENT,
         CHANGE_KEXP,
         CHANGE_KRDEL} from '../actions/actions.js';

function selectedkey(state = null, action) {
  switch (action.type) {
  case SELECT_ENERGY_COMPONENT:
    return (action.id);
  default:
    return state;
  }
}

function kexp(state = [], action) {
  switch (action.type) {
  case CHANGE_KEXP:
    return action.value;
  default:
    return state;
  }
}

function krdel(state = [], action) {
  switch (action.type) {
  case CHANGE_KRDEL:
    return action.value;
  default:
    return state;
  }
}

function components(state = [], action) {
  switch (action.type) {
  case ADD_ENERGY_COMPONENT:
    return ([... state, action.component]);
  default:
    return state;
  }
}

export default combineReducers({
  selectedkey,
  kexp,
  krdel,
  components
});
