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
  ADD_ENERGY_COMPONENT,
  CLONE_ENERGY_COMPONENT,
  REMOVE_ENERGY_COMPONENT,
  EDIT_ENERGY_COMPONENT,
  LOAD_ENERGY_COMPONENTS,
  CHANGE_KEXP,
  CHANGE_AREA,
  CHANGE_LOCATION,
  CHANGE_USERWFACTORS
} from "../actions/actions.js";

// Reducer para la parte de kexp -------------------
function kexp(state = 1, action) {
  switch (action.type) {
    case CHANGE_KEXP:
      return Number(action.value);
    case LOAD_ENERGY_COMPONENTS: {
      if (action.cmeta === null) return state;
      const m_kexp = action.cmeta.find(c => c.key === "CTE_KEXP");
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
      if (action.cmeta === null) return state;
      const m_area = action.cmeta.find(c => c.key === "CTE_AREAREF");
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
      if (action.cmeta === null) return state;
      return location_from_meta(action.cmeta);
    default:
      return state;
  }
}

// Reducer para factores de usuario user_wfactors --------------
function user_wfactors(state = {}, action) {
  switch (action.type) {
    case CHANGE_USERWFACTORS: {
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
      if (action.cmeta === null) return state;
      return userfactors_from_cmeta(action.cmeta);
    default:
      return state;
  }
}

const DEFAULT_COMPONENT = {
  active: true,
  carrier: "ELECTRICIDAD",
  ctype: "PRODUCCION",
  csubtype: "INSITU",
  service: "NDEF",
  values: new Array(12).fill(1),
  comment: "Nuevo componente energético"
};

// Reducer para datos de componentes energéticos ---------------------
function cdata(state, action) {
  switch (action.type) {
    case ADD_ENERGY_COMPONENT:
      return [...state, action.component];
    case CLONE_ENERGY_COMPONENT: {
      const numcomps = state.length;
      // Sin elementos seleccionado o sin componentes existentes
      if (action.id === null || numcomps === 0) {
        const numvals = numcomps > 0 ? state[0].values.length : 12;
        const newcomponent = {
          ...DEFAULT_COMPONENT,
          values: new Array(numvals).fill(1)
        };
        if (numcomps == 0) {
          return [newcomponent];
        } else {
          return [...state.cdata, newcomponent];
        }
      }
      // Con componente seleccionado
      let currlist = [...state];
      currlist.splice(action.id + 1, 0, currlist[action.id]);
      return currlist;
    }
    case REMOVE_ENERGY_COMPONENT: {
      if (state.length > 0) {
        let currlist = [...state];
        currlist.splice(action.id, 1);
        return currlist;
      }
      return state;
    }
    case EDIT_ENERGY_COMPONENT: {
      if (action.id < state.length) {
        let currlist = [...state];
        currlist[action.id] = action.newcomponent;
        return currlist;
      }
      return state;
    }
    case LOAD_ENERGY_COMPONENTS: {
      if (action.cdata !== null) {
        return action.cdata.map(dd => ({
          ...dd,
          active: true
        }));
      }
      return state;
    }
    default:
      return state;
  }
}

// Reducer para metadatos de componentes energéticos -------------------
function cmeta(state = [], action) {
  let newmeta;

  switch (action.type) {
    case LOAD_ENERGY_COMPONENTS:
      if (action.cmeta !== null) {
        const newcmeta = [...action.cmeta];
        upsertmeta(newcmeta, "App", `VisorEPBD 1.0 (CteEPBD ${get_version()})`);
        return newcmeta;
      }
      return state;
    case CHANGE_AREA:
      newmeta = [...state];
      upsertmeta(newmeta, "CTE_AREAREF", action.value);
      return newmeta;
    case CHANGE_KEXP:
      newmeta = [...state];
      upsertmeta(newmeta, "CTE_KEXP", action.value);
      return newmeta;
    case CHANGE_LOCATION:
      newmeta = [...state];
      upsertmeta(newmeta, "CTE_LOCALIZACION", action.value);
      return newmeta;
    case CHANGE_USERWFACTORS: {
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
      newmeta = [...state];
      upsertmeta(
        newmeta,
        metakey,
        `${newfactors.ren.toFixed(3)}, ${newfactors.nren.toFixed(
          3
        )}, ${newfactors.co2.toFixed(3)}`
      );
      return newmeta;
    }
    default:
      return state;
  }
}

// Reducer de errores ----------------------------------
function globalerrors(state = [], action) {
  switch (action.type) {
    case LOAD_ENERGY_COMPONENTS: {
      if (action.error !== null) {
        return [...state, action.error];
      }
      return Array(0);
    }
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
    return { error: e };
  }
}

// Genera el balance
export function selectBalance(state) {
  if (state === {}) return {};

  let { kexp, area, cmeta, cdata } = state;
  const wfactors = selectWFactors(state);
  const componentsobj = {
    cmeta,
    cdata: cdata.filter(c => c.active)
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

// Genera conjunto de errores
//
// Toma los errores globales y los que se puedan producir en wfactors y balance
export function selectErrors(state) {
  const balance = selectBalance(state);
  const wfactors = selectWFactors(state);

  let errors = [...state.globalerrors];
  if (balance.error) {
    errors.push(balance.error);
  }
  if (wfactors.error) {
    errors.push(wfactors.error);
  }
  return errors;
}

// Reducer raíz ------------------------

export default function reducer(state = {}, action) {
  return {
    kexp: kexp(state.kexp, action),
    area: area(state.area, action),
    location: location(state.location, action),
    user_wfactors: user_wfactors(state.user_wfactors, action),
    cmeta: cmeta(state.cmeta, action),
    cdata: cdata(state.cdata, action),
    globalerrors: globalerrors(state.globalerrors, action)
  };
}
