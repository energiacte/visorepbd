// Reducers para calcular los cambios de estado a partir de las acciones
import {
  // parse_components,
  energy_performance,
  energy_performance_acs_nrb,
  new_wfactors
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
  EDIT_USERWFACTORS,
  CHANGE_CURRENTFILENAME
} from "../actions/actions.js";

const CTE_VALID_LOCS = ["PENINSULA", "BALEARES", "CANARIAS", "CEUTAMELILLA"];

// Reducer para la parte de storedcomponent -------------------
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

// Reducer para la parte de location -------------------
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

const upsertmeta = (meta, key, value) => {
  const match = meta.find(c => c.key === key);
  if (match) {
    match.value = `${value}`;
  } else {
    meta.push({ key, value: `${value}` });
  }
  return meta;
};

// Reducer para la parte de wfactors -------------------
function wfactors(state = [], action, indicator) {
  switch (action.type) {
    case EDIT_USERWFACTORS: {
      const { carrier, newfactors } = action;

      if (action.indicator !== indicator) return state;

      let wdata = [...state.wdata];
      let wmeta = [...state.wmeta];

      // Actualiza datos.
      let datum;
      if (carrier === "RED1") {
        datum = wdata.find(
          f => f.carrier === "RED1" && f.dest === "SUMINISTRO" && f.step === "A"
        );
      } else if (carrier === "RED2") {
        datum = wdata.find(
          f => f.carrier === "RED2" && f.dest === "SUMINISTRO" && f.step === "A"
        );
      } else if (carrier === "ELECTRICIDADCOGEN") {
        datum = wdata.find(
          f =>
            f.carrier === "ELECTRICIDAD" &&
            f.source === "COGENERACION" &&
            f.dest === "A_RED" &&
            f.step === "A"
        );
      } else {
        // eslint-disable-next-line no-console
        console.error(
          "ERROR: Caso imprevisto de modificación de factores de usuario para ",
          indicator,
          carrier,
          newfactors
        );
      }
      // Actualiza factores (los metadatos se actualizan en componentes)
      datum.ren = newfactors.ren;
      datum.nren = newfactors.nren;
      return { wmeta, wdata };
    }
    case CHANGE_LOCATION: {
      const loc = action.value;
      if (!CTE_VALID_LOCS.includes(loc)) return state;
      // Conserva factores de usuario actuales
      // TODO: ¿pueden no existir y estar indefinidos?
      const red1 = state.wdata.find(f => f.carrier === "RED1");
      const red2 = state.wdata.find(f => f.carrier === "RED2");
      const cog = state.wdata.find(
        f => f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A"
      );
      // Regenera factores de localización
      const newfactors = new_wfactors(loc, indicator, {
        cogen: {
          A_RED: { ren: cog.ren, nren: cog.nren },
          A_NEPB: { ren: cog.ren, nren: cog.nren }
        },
        red: {
          RED1: { ren: red1.ren, nren: red1.nren },
          RED2: { ren: red2.ren, nren: red2.nren }
        }
      });
      // Actualiza metadatos
      upsertmeta(newfactors.wmeta, "CTE_LOCALIZACION", loc);
      return newfactors;
    }
    case LOAD_ENERGY_COMPONENTS: {
      // TODO: No se actualizan las entradas, ya que solo se activa el default en la primera carga
      const meta = action.newcomponents.cmeta;
      const m_location = meta.find(c => c.key === "CTE_LOCALIZACION");
      const loc =
        m_location && CTE_VALID_LOCS.includes(m_location.value)
          ? m_location.value
          : CTE_VALID_LOCS[0];
      let red1, red2, cog;
      if (indicator === "CO2") {
        red1 = meta.find(c => c.key === "CTE_RED1_CO2");
        red2 = meta.find(c => c.key === "CTE_RED2_CO2");
        cog = meta.find(c => c.key === "CTE_COGEN_CO2");
      } else {
        red1 = meta.find(c => c.key === "CTE_RED1");
        red2 = meta.find(c => c.key === "CTE_RED2");
        cog = meta.find(c => c.key === "CTE_COGEN");
      }
      let userfactors = {
        cogen: {},
        red: {}
      };

      if (red1) {
        const v = red1.value.split(",").map(Number);
        if (v.length == 2) {
          userfactors.red = {
            ...userfactors.red,
            RED1: { ren: v[0], nren: v[1] }
          };
        }
      }

      if (red2) {
        const v = red2.value.split(",").map(Number);
        if (v.length == 2) {
          userfactors.red = {
            ...userfactors.red,
            RED2: { ren: v[0], nren: v[1] }
          };
        }
      }

      if (cog) {
        const v = cog.value.split(",").map(Number);
        if (v.length == 2) {
          userfactors.cogen = {
            A_RED: { ren: v[0], nren: v[1] },
            A_NEPB: { ren: v[0], nren: v[1] }
          };
        }
      }

      // Regenera factores de localización
      const newfactors = new_wfactors(loc, indicator, userfactors);
      return newfactors;
    }
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
        const newcomponents = action.newcomponents;
        upsertmeta(newcomponents.cmeta, "App", "VisorEPBD_1.0");
        return newcomponents;
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
      const { indicator, carrier, newfactors } = action;
      let metakey;
      if (carrier === "RED1") {
        metakey = indicator === "CO2" ? "CTE_RED1_CO2" : "CTE_RED1";
      } else if (carrier === "RED2") {
        metakey = indicator === "CO2" ? "CTE_RED2_CO2" : "CTE_RED2";
      } else if (carrier === "ELECTRICIDADCOGEN") {
        metakey = indicator === "CO2" ? "CTE_COGEN_CO2" : "CTE_COGEN";
      } else {
        // eslint-disable-next-line no-console
        console.error(
          "ERROR: Caso imprevisto de modificación de factores de usuario para ",
          indicator,
          carrier,
          newfactors
        );
      }
      newmeta = [...state.cmeta];
      upsertmeta(
        newmeta,
        metakey,
        `${newfactors.ren.toFixed(3)}, ${newfactors.nren.toFixed(3)}`
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

export function selectBalance(state) {
  if (state === {}) return {};

  let { kexp, area, components, wfactors_ep, wfactors_co2 } = state;
  const componentsobj = {
    cmeta: components.cmeta,
    cdata: components.cdata.filter(c => c.active)
  };

  // Cálculo global, energía primaria
  const ep = energy_performance(componentsobj, wfactors_ep, kexp, area);
  // Cálculo para ACS en perímetro próximo
  const ep_acs_nrb = energy_performance_acs_nrb(
    componentsobj,
    wfactors_ep,
    kexp,
    area
  );
  // Cálculo global, emisiones
  const co2 = energy_performance(componentsobj, wfactors_co2, kexp, area);
  return { ep, ep_acs_nrb, co2 };
}

// Reducer raíz ------------------------

export default function reducer(state = {}, action) {
  return {
    storedcomponent: storedcomponent(state.storedcomponent, action),
    selectedkey: selectedkey(state.selectedkey, action),
    kexp: kexp(state.kexp, action),
    area: area(state.area, action),
    location: location(state.location, action),
    wfactors_ep: wfactors(state.wfactors_ep, action, "EP"),
    wfactors_co2: wfactors(state.wfactors_co2, action, "CO2"),
    components: components(state.components, action),
    currentfilename: currentfilename(state.currentfilename, action)
  };
}
