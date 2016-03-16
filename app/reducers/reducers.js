import { combineReducers } from 'redux';
import { SELECT_ENERGY_COMPONENT,
         ADD_ENERGY_COMPONENT,
         REMOVE_ENERGY_COMPONENT,
         EDIT_ENERGY_COMPONENT,
         CHANGE_KEXP,
         CHANGE_KRDEL} from '../actions/actions.js';

function selectedkey(state = null, action) {
  switch (action.type) {
  case SELECT_ENERGY_COMPONENT:
    return (action.id);
  case REMOVE_ENERGY_COMPONENT:
    if (action.id !== 0) return state - 1;
    return state;
  default:
    return state;
  }
}

function kexp(state = 1, action) {
  switch (action.type) {
  case CHANGE_KEXP:
    return action.value;
  default:
    return state;
  }
}

function krdel(state = 1, action) {
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
  case REMOVE_ENERGY_COMPONENT:
    if (state.length > 0) {
      let currlist = [... state];
      currlist.splice(action.id, 1);
      return (currlist);
    }
    return state;
  case EDIT_ENERGY_COMPONENT:
    if (action.id < state.length) {
      let currlist = [... state];
      currlist[action.id] = action.newcomponent;
      return (currlist);
    }
    return state;
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
