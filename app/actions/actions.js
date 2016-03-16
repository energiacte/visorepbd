/*
 * action types
 */

export const ADD_ENERGY_COMPONENT = 'ADD_ENERGY_COMPONENT';
export const SELECT_ENERGY_COMPONENT = 'SELECT_ENERGY_COMPONENT';
export const CHANGE_KEXP = 'CHANGE_KEXP';
export const CHANGE_KRDEL = 'CHANGE_KRDEL';

/*
 * action creators
 */

export function addEnergyComponent(component) {
  return { type: ADD_ENERGY_COMPONENT, component };
}

export function selectEnergyComponent(id) {
  return { type: SELECT_ENERGY_COMPONENT, id };
}

export function changeKexp(value) {
  return { type: CHANGE_KEXP, value };
}

export function changeKrdel(value) {
  return { type: CHANGE_KRDEL, value };
}
