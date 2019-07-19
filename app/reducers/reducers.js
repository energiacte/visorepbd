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

// Reducer para la parte de storedcomponent
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

// Reducer para la parte de selectedkeys
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

// Reducer para la parte de kexp
function kexp(state = 1, action) {
  switch (action.type) {
    case CHANGE_KEXP:
      return Number(action.value);
    default:
      return state;
  }
}

// Reducer para la parte de area
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

// Reducer para la parte de location
function location(state = "PENINSULA", action) {
  switch (action.type) {
    case CHANGE_LOCATION:
      return action.value;
    default:
      return state;
  }
}

// Reducer para la parte de wfactors
function wfactors(state = [], action) {
  switch (action.type) {
    case EDIT_WFACTORS:
      return action.newfactors;
    default:
      return state;
  }
}

// Reducer para la parte de components
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

// Reducer para la parte de currentfilename
function currentfilename(state = "csvEPBDpanel.csv", action) {
  switch (action.type) {
    case CHANGE_CURRENTFILENAME:
      return action.newname;
    default:
      return state;
  }
}

// Reducer para la parte de results
function results(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ENERGYRESULTS:
      return action.newresults;
    default:
      return state;
  }
}

// Composición de reducers para general el estado general
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
