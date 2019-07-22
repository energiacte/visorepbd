// Reducers para calcular los cambios de estado a partir de las acciones
import {
  // parse_components,
  energy_performance,
  energy_performance_acs_nrb
} from "wasm-cteepbd";

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
    case LOAD_ENERGY_COMPONENTS: {
      const m_kexp = action.newcomponents.cmeta.find(c => c.key === "CTE_KEXP");
      return m_kexp && !isNaN(m_kexp.value) ? Number(m_kexp.value) : state;
    }
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
    case LOAD_ENERGY_COMPONENTS: {
      const m_area = action.newcomponents.cmeta.find(
        c => c.key === "CTE_AREAREF"
      );
      return m_area && !isNaN(m_area.value) ? Number(m_area.value) : state;
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
    case LOAD_ENERGY_COMPONENTS: {
      // Localizaciones válidas para CTE
      const CTE_LOCS = ["PENINSULA", "BALEARES", "CANARIAS", "CEUTAMELILLA"];
      const m_location = action.newcomponents.cmeta.find(
        c => c.key === "CTE_LOCALIZACION"
      );
      return m_location && CTE_LOCS.includes(m_location.value)
        ? m_location.value
        : location;
    }
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

function computeBalances(state = {}) {
  if (state === {}) return {};

  const { kexp, area, components, wfactors } = state;
  const componentsobj = {
    cmeta: components.cmeta,
    cdata: components.cdata.filter(c => c.active)
  };

  // Cálculo global
  const ep = energy_performance(componentsobj, wfactors, kexp, area);
  // Cálculo para ACS en perímetro próximo
  const ep_acs_nrb = energy_performance_acs_nrb(
    componentsobj,
    wfactors,
    kexp,
    area
  );
  return { ep, ep_acs_nrb };
}

// Si se quisiese hacer el cálculo energético en los reducers, para
// calcular el balance energético usando todo el estado y no solo su parte:
//
export default function reducer(state = {}, action) {
  return {
    storedcomponent: storedcomponent(state.storedcomponent, action),
    selectedkey: selectedkey(state.selectedkey, action),
    kexp: kexp(state.kexp, action),
    area: area(state.area, action),
    location: location(state.location, action),
    wfactors: wfactors(state.wfactors, action),
    components: components(state.components, action),
    currentfilename: currentfilename(state.currentfilename, action),
    balance: computeBalances(state) // XXX: usa todo el estado
  };
}
