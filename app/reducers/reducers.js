import { combineReducers } from "redux";
import {
  SELECT_ENERGY_COMPONENT,
  ADD_ENERGY_COMPONENT,
  CLONE_ENERGY_COMPONENT,
  REMOVE_ENERGY_COMPONENT,
  EDIT_ENERGY_COMPONENT,
  LOAD_ENERGY_COMPONENTS,
  CHANGE_KEXP,
  CHANGE_AREA,
  CHANGE_LOCATION,
  EDIT_WFACTORS,
  RECEIVE_ENERGYRESULTS,
  CHANGE_CURRENTFILENAME
} from "../actions/actions.js";

function storedcomponent(state = null, action) {
  switch (action.type) {
    case SELECT_ENERGY_COMPONENT:
      return action.component;
    case LOAD_ENERGY_COMPONENTS:
      return action.newcomponents.cdata[0];
    default:
      return state;
  }
}

function selectedkey(state = null, action) {
  switch (action.type) {
    case SELECT_ENERGY_COMPONENT:
      return action.id;
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

function area(state = 1, action) {
  switch (action.type) {
    case CHANGE_AREA: {
      let val = Number(action.value);
      if (isNaN(val)) {
        return 1.0;
      }
      return Math.max(Math.round(val), 1.0);
    }
    default:
      return state;
  }
}

function location(state = "PENINSULA", action) {
  switch (action.type) {
    case CHANGE_LOCATION:
      return action.value;
    default:
      return state;
  }
}

function wfactors(state = [], action) {
  switch (action.type) {
    case EDIT_WFACTORS:
      return action.newfactors;
    default:
      return state;
  }
}

function components(state = { cdata: [], cmeta: [] }, action) {
  let currlist;

  switch (action.type) {
    case ADD_ENERGY_COMPONENT:
      return { cmeta: state.cmeta, cdata: [...state.cdata, action.component] };
    case CLONE_ENERGY_COMPONENT:
      if (action.id === null || state.length === 0) {
        const numelems = state.length > 0 ? state[0].values.length : 12;
        return {
          cmeta: state.cmeta,
          cdata: [
            ...state.cdata,
            {
              active: true,
              carrier: "ELECTRICIDAD",
              ctype: "PRODUCCION",
              csubtype: "INSITU",
              service: "NDEF",
              values: new Array(numelems).fill(1),
              comment: "Nuevo componente energético"
            }
          ]
        };
      }
      currlist = [...state.cdata];
      currlist.splice(action.id + 1, 0, currlist[action.id]);
      return { cmeta: state.cmeta, cdata: currlist };
    case REMOVE_ENERGY_COMPONENT:
      if (state.cdata.length > 0) {
        currlist = [...state.cdata];
        currlist.splice(action.id, 1);
        return { cmeta: state.cmeta, cdata: currlist };
      }
      return state;
    case EDIT_ENERGY_COMPONENT:
      if (action.id < state.cdata.length) {
        currlist = [...state.cdata];
        currlist[action.id] = action.newcomponent;
        return { cmeta: state.cmeta, cdata: currlist };
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

function currentfilename(state = "csvEPBDpanel.csv", action) {
  switch (action.type) {
    case CHANGE_CURRENTFILENAME:
      return action.newname;
    default:
      return state;
  }
}

function results(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ENERGYRESULTS:
      return action.newresults;
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
//     components: components(state.components, action),
//     results: results(state, action)
//   };
// };
// export default reducer;

export default combineReducers({
  results,
  storedcomponent,
  selectedkey,
  kexp,
  area,
  location,
  wfactors,
  components,
  currentfilename
});
