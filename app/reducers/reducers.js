// Reducers para calcular los cambios de estado a partir de las acciones
import {
  // parse_components,
  energy_performance,
  energy_performance_acs_nrb,
  new_wfactors,
  get_version
} from "wasm-cteepbd";

import {
  upsertmeta,
  clone_user_wfactors,
  userfactors_from_cmeta,
  location_from_meta
} from "utils";

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
  EDIT_USERWFACTORS,
  CHANGE_CURRENTFILENAME
} from "../actions/actions.js";

// Reducer para la parte de storedcomponent -------------------
function storedcomponent(state = null, action) {
  switch (action.type) {
    case SELECT_ENERGY_COMPONENT:
      return action.component;
    case LOAD_ENERGY_COMPONENTS:
      return { ...action.newcomponents.cdata[0], active: true };
    default:
      return state;
  }
}

// Reducer para la parte de selectedkeys -------------------
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

// Reducer para la parte de kexp -------------------
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

// Reducer para la parte de área -------------------
function area(state = 1, action) {
  switch (action.type) {
    case CHANGE_AREA: {
      let val = Math.round(Number(action.value));
      if (isNaN(val)) {
        return 1.0;
      }
      return Math.round(Math.max(val, 1.0));
    }
    case LOAD_ENERGY_COMPONENTS: {
      const m_area = action.newcomponents.cmeta.find(
        c => c.key === "CTE_AREAREF"
      );
      return m_area && !isNaN(m_area.value)
        ? Math.round(Number(m_area.value))
        : state;
    }
    default:
      return state;
  }
}

// Reducer para la parte de location -------------------
function location(state = "PENINSULA", action) {
  switch (action.type) {
    case CHANGE_LOCATION:
      return action.value;
    case LOAD_ENERGY_COMPONENTS:
      return location_from_meta(action.newcomponents.cmeta);
    default:
      return state;
  }
}

// Reducer para factores de usuario user_wfactors --------------
function user_wfactors(state = {}, action) {
  switch (action.type) {
    case EDIT_USERWFACTORS: {
      const {
        carrier,
        newfactors: { ren, nren, co2 }
      } = action;
      let newstate = clone_user_wfactors(state);
      if (carrier === "RED1") {
        newstate.red.RED1 = { ren, nren, co2 };
      } else if (carrier === "RED2") {
        newstate.red.RED2 = { ren, nren, co2 };
      } else if (carrier === "ELECTRICIDADCOGEN") {
        newstate.cogen.A_RED = { ren, nren, co2 };
      } else {
        // eslint-disable-next-line no-console
        console.error(
          "ERROR: Caso imprevisto de modificación de factores de usuario para ",
          carrier,
          action.newfactors
        );
      }
      return newstate;
    }
    case LOAD_ENERGY_COMPONENTS:
      return userfactors_from_cmeta(action.newcomponents.cmeta);
    default:
      return state;
  }
}

// Reducer para la parte de components -------------------
function components(state = { cdata: [], cmeta: [] }, action) {
  let currlist, newmeta;

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
        const newcmeta = [...action.newcomponents.cmeta];
        upsertmeta(newcmeta, "App", `VisorEPBD 1.0 (CteEPBD ${get_version()})`);
        const newcdata = action.newcomponents.cdata.map(dd => ({
          ...dd,
          active: true
        }));
        return { cmeta: newcmeta, cdata: newcdata };
      }
      return state;
    case CHANGE_AREA:
      newmeta = [...state.cmeta];
      upsertmeta(newmeta, "CTE_AREAREF", action.value);
      return { ...state, cmeta: newmeta };
    case CHANGE_KEXP:
      newmeta = [...state.cmeta];
      upsertmeta(newmeta, "CTE_KEXP", action.value);
      return { ...state, cmeta: newmeta };
    case CHANGE_LOCATION:
      newmeta = [...state.cmeta];
      upsertmeta(newmeta, "CTE_LOCALIZACION", action.value);
      return { ...state, cmeta: newmeta };
    case EDIT_USERWFACTORS: {
      const { carrier, newfactors } = action;
      let metakey;
      if (carrier === "RED1") {
        metakey = "CTE_RED1";
      } else if (carrier === "RED2") {
        metakey = "CTE_RED2";
      } else if (carrier === "ELECTRICIDADCOGEN") {
        metakey = "CTE_COGEN";
      } else {
        // eslint-disable-next-line no-console
        console.error(
          "ERROR: Caso imprevisto de modificación de factores de usuario para ",
          carrier,
          newfactors
        );
      }
      newmeta = [...state.cmeta];
      upsertmeta(
        newmeta,
        metakey,
        `${newfactors.ren.toFixed(3)}, ${newfactors.nren.toFixed(
          3
        )}, ${newfactors.co2.toFixed(3)}`
      );
      return { ...state, cmeta: newmeta };
    }
    default:
      return state;
  }
}

// Reducer para la parte de currentfilename -------------------
function currentfilename(state = "csvEPBDpanel.csv", action) {
  switch (action.type) {
    case CHANGE_CURRENTFILENAME:
      return action.newname;
    default:
      return state;
  }
}

// Selectors --------------------------

// Genera factores de paso a partir del estado
export function selectWFactors(state) {
  if (state === {}) return {};
  let { location, user_wfactors } = state;
  try {
    return new_wfactors(location, user_wfactors);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Error inesperado al generar factores de paso: ", e);
    return state;
  }
}

// Genera el balance
// TODO: debería usarse reselect para componer con selectWFactors
export function selectBalance(state) {
  if (state === {}) return {};

  let { kexp, area, components } = state;
  const wfactors = selectWFactors(state);
  const componentsobj = {
    cmeta: components.cmeta,
    cdata: components.cdata.filter(c => c.active)
  };

  try {
    // Cálculo global, energía primaria
    const ep = energy_performance(componentsobj, wfactors, kexp, area);
    // Cálculo para ACS en perímetro próximo
    const ep_acs_nrb = energy_performance_acs_nrb(
      componentsobj,
      wfactors,
      kexp,
      area
    );
    return { ep, ep_acs_nrb };
  } catch (e) {
    return { error: e };
  }
}

// Reducer raíz ------------------------

export default function reducer(state = {}, action) {
  return {
    storedcomponent: storedcomponent(state.storedcomponent, action),
    selectedkey: selectedkey(state.selectedkey, action),
    kexp: kexp(state.kexp, action),
    area: area(state.area, action),
    location: location(state.location, action),
    user_wfactors: user_wfactors(state.user_wfactors, action),
    // wfactors: wfactors(state.wfactors, action),
    components: components(state.components, action),
    currentfilename: currentfilename(state.currentfilename, action)
  };
}
