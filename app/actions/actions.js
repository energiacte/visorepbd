/*
 * action types
 */

export const ADD_COMPONENT = 'ADD_COMPONENT';
export const SELECT_COMPONENT = 'SELECT_COMPONENT';
export const CHANGE_KEXP = 'CHANGE_KEXP';
export const CHANGE_KRDEL = 'CHANGE_KRDEL';

/*
 * action creators
 */

export function addComponent(component) {
  return { type: ADD_COMPONENT, component };
}

export function selectComponent(id) {
  return { type: SELECT_COMPONENT, id };
}

export function changeKexp(value) {
  return { type: CHANGE_KEXP, value };
}

export function changeKrdel(value) {
  return { type: CHANGE_KRDEL, value };
}
