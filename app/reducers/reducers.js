import { combineReducers } from 'redux';
import { SELECT_ENERGY_COMPONENT,
         ADD_ENERGY_COMPONENT,
         REMOVE_ENERGY_COMPONENT,
         EDIT_ENERGY_COMPONENT,
         LOAD_ENERGY_COMPONENTS,
         CHANGE_KEXP,
         CHANGE_KRDEL,
         CHANGE_AREA,
         RECEIVE_DATA } from '../actions/actions.js';

function storedcomponent(state = null, action) {
  switch (action.type) {
  case SELECT_ENERGY_COMPONENT:
    return action.component;
  case LOAD_ENERGY_COMPONENTS:
    return action.newcomponents[0];
  default:
    return state;
  }
}

function selectedkey(state = null, action) {
  switch (action.type) {
  case SELECT_ENERGY_COMPONENT:
    return (action.id);
  case REMOVE_ENERGY_COMPONENT:
    if (action.id !== 0) return state - 1;
    return state;
  case LOAD_ENERGY_COMPONENTS:
    return 0;
  default:
    return state;
  }
}

function kexp(state = 1, action) {
  switch (action.type) {
  case CHANGE_KEXP:
    return Number(action.value);
  default:
    return state;
  }
}

function krdel(state = 1, action) {
  switch (action.type) {
  case CHANGE_KRDEL:
    return Number(action.value);
  default:
    return state;
  }
}

function area(state = 1, action) {
  switch (action.type) {
  case CHANGE_AREA:
    return Number(action.value);
  default:
    return state;
  }
}

function components(state = [], action) {
  let currlist;

  switch (action.type) {
  case ADD_ENERGY_COMPONENT:
    return [... state, action.component];
  case REMOVE_ENERGY_COMPONENT:
    if (state.length > 0) {
      currlist = [... state];
      currlist.splice(action.id, 1);
      return currlist;
    }
    return state;
  case EDIT_ENERGY_COMPONENT:
    if (action.id < state.length) {
      currlist = [... state];
      currlist[action.id] = action.newcomponent;
      return currlist;
    }
    return state;
  case LOAD_ENERGY_COMPONENTS:
    if (action.newcomponents !== null) {
      return action.newcomponents;
    }
    return state;
  default:
    return state;
  }
}

function data(state = {}, action) {
  switch (action.type) {
  case RECEIVE_DATA:
    return action.newdata;
  default:
    return state;
  }
}

// Para comportamiento más sofisticado habría que
// evitar el combineReducers y hacer algo así, pasando el state general
// y no solo una parte
// const reducer = (state = {}, action) => {
//   return {
//     storedcomponent: storedcomponent(state.storedcomponent, action),
//     selectedkey: selectedkey(state.selectedkey, action),
//     kexp: kexp(state.kexp, action),
//     krdel: krdel(state.krdel, action),
//     components: components(state.components, action),
//     data: data(state, action)
//   };
// };
// export default reducer;

export default combineReducers({
  data,
  storedcomponent,
  selectedkey,
  kexp,
  krdel,
  area,
  components
});
