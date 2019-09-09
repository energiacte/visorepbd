import { parse_components } from "wasm-cteepbd";

/*
 * action types
 */

export const ADD_ENERGY_COMPONENT = "ADD_ENERGY_COMPONENT";
export const CLONE_ENERGY_COMPONENT = "CLONE_ENERGY_COMPONENT";
export const REMOVE_ENERGY_COMPONENT = "REMOVE_ENERGY_COMPONENT";
export const EDIT_ENERGY_COMPONENT = "EDIT_ENERGY_COMPONENT";
export const LOAD_ENERGY_COMPONENTS = "LOAD_ENERGY_COMPONENTS";
export const CHANGE_KEXP = "CHANGE_KEXP";
export const CHANGE_AREA = "CHANGE_AREA";
export const CHANGE_LOCATION = "CHANGE_LOCATION";
export const CHANGE_USERWFACTORS = "CHANGE_USERWFACTORS";

/*
 * action creators
 */

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

export function loadEnergyComponents(datastr) {
  try {
    const { cmeta, cdata } = parse_components(datastr);
    return { type: LOAD_ENERGY_COMPONENTS, cmeta, cdata, errors: null };
  } catch (e) {
    // TODO: manejar los errores en la interfaz
    // eslint-disable-next-line no-console
    console.error("Se ha producido un error al cargar los datos: ", e);
    return { type: LOAD_ENERGY_COMPONENTS, cmeta: null, cdata: null, errors: e };
  }
}

export function changeKexp(value) {
  return { type: CHANGE_KEXP, value };
}

export function changeArea(value) {
  return { type: CHANGE_AREA, value };
}

export function changeLocation(value) {
  return { type: CHANGE_LOCATION, value };
}

export function editUserWFactors(carrier, newfactors) {
  return { type: CHANGE_USERWFACTORS, carrier, newfactors };
}
