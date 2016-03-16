/*
 * action types
 */

export const SELECT_ENERGY_COMPONENT = 'SELECT_ENERGY_COMPONENT';
export const ADD_ENERGY_COMPONENT = 'ADD_ENERGY_COMPONENT';
export const REMOVE_ENERGY_COMPONENT = 'REMOVE_ENERGY_COMPONENT';
export const EDIT_ENERGY_COMPONENT = 'EDIT_ENERGY_COMPONENT';
export const CHANGE_KEXP = 'CHANGE_KEXP';
export const CHANGE_KRDEL = 'CHANGE_KRDEL';

/*
 * action creators
 */

export function selectEnergyComponent(id) {
  return { type: SELECT_ENERGY_COMPONENT, id };
}

export function addEnergyComponent(component) {
  return { type: ADD_ENERGY_COMPONENT, component };
}

export function removeEnergyComponent(id) {
  return { type: REMOVE_ENERGY_COMPONENT, id };
}

export function editEnergyComponent(id, newcomponent) {
  return { type: EDIT_ENERGY_COMPONENT, id, newcomponent };
}

export function changeKexp(value) {
  return { type: CHANGE_KEXP, value };
}

export function changeKrdel(value) {
  return { type: CHANGE_KRDEL, value };
}
