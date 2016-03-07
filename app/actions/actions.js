/*
 * action types
 */

export const ADD_COMPONENT = 'ADD_COMPONENT';
export const SELECT_COMPONENT = 'SELECT_COMPONENT';

/*
 * action creators
 */

export function addComponent(component) {
  return { type: ADD_COMPONENT, component };
}

export function selectComponent(id) {
  return { type: SELECT_COMPONENT, id };
}
