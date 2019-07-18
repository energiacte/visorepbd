import {
  energy_performance,
  energy_performance_acs_nrb
} from "wasm-cteepbd";

/*
 * action types
 */

export const SELECT_ENERGY_COMPONENT = "SELECT_ENERGY_COMPONENT";
export const ADD_ENERGY_COMPONENT = "ADD_ENERGY_COMPONENT";
export const CLONE_ENERGY_COMPONENT = "CLONE_ENERGY_COMPONENT";
export const REMOVE_ENERGY_COMPONENT = "REMOVE_ENERGY_COMPONENT";
export const EDIT_ENERGY_COMPONENT = "EDIT_ENERGY_COMPONENT";
export const LOAD_ENERGY_COMPONENTS = "LOAD_ENERGY_COMPONENTS";
export const CHANGE_KEXP = "CHANGE_KEXP";
export const CHANGE_AREA = "CHANGE_AREA";
export const CHANGE_LOCALIZACION = "CHANGE_LOCALIZACION";
export const CHANGE_CURRENTFILENAME = "CHANGE_CURRENTFILENAME";
export const EDIT_WFACTORS = "EDIT_WFACTORS";
export const RECEIVE_ENERGYDATA = "RECEIVE_ENERGYDATA";

/*
 * action creators
 */

export function selectEnergyComponent(id, component) {
  return { type: SELECT_ENERGY_COMPONENT, id, component };
}

export function addEnergyComponent(component) {
  return { type: ADD_ENERGY_COMPONENT, component };
}

export function cloneEnergyComponent(id) {
  return { type: CLONE_ENERGY_COMPONENT, id };
}

export function removeEnergyComponent(id) {
  return { type: REMOVE_ENERGY_COMPONENT, id };
}

export function editEnergyComponent(id, newcomponent) {
  return { type: EDIT_ENERGY_COMPONENT, id, newcomponent };
}

export function loadEnergyComponents(newcomponents) {
  return { type: LOAD_ENERGY_COMPONENTS, newcomponents };
}

export function changeKexp(value) {
  return { type: CHANGE_KEXP, value };
}

export function changeArea(value) {
  return { type: CHANGE_AREA, value };
}

export function changeLocalizacion(value) {
  return { type: CHANGE_LOCALIZACION, value };
}

export function editWFactors(newfactors) {
  return { type: EDIT_WFACTORS, newfactors };
}

export function changeCurrentFileName(newname) {
  return { type: CHANGE_CURRENTFILENAME, newname };
}

export function deliverEnergy(newdata) {
  return { type: RECEIVE_ENERGYDATA, newdata };
}

// async action creator to get API data: thunk (redux-thunk middleware)
// could get params from store.getState() (import store from '../store/store.js') and return deliverData(res)

export function computeEnergy() {
  // this async action also reads state
  return (dispatch, getState) => {
    const { kexp, area, components, wfactors } = getState();
    const componentsobj = {
      cmeta: components.cmeta,
      cdata: components.cdata.filter(c => c.active)
    };
    // Cálculo global
    const ep = energy_performance(componentsobj, wfactors, kexp, area);
    const { ren, nren } = ep.balance_m2.B;
    const total = ren + nren;
    const rer = total === 0 ? 0 : ren / total;
    // Cálculo para ACS en perímetro próximo
    const res_acs_nrb = energy_performance_acs_nrb(
      componentsobj,
      wfactors,
      kexp,
      area
    );
    const { ren: ren_acs, nren: nren_acs } = res_acs_nrb.balance_m2.B;
    const total_acs = ren_acs + nren_acs;
    const rer_acs_nrb = total_acs === 0 ? 0 : ren_acs / total_acs;
    // Actualización
    dispatch(deliverEnergy({ ren, nren, total, rer, rer_acs_nrb }));
  };
}
