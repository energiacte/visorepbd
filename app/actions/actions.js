import { weighted_energy,
         readenergydata,
         ep2dict } from 'energycalculations';

/*
 * action types
 */

export const SELECT_ENERGY_COMPONENT = 'SELECT_ENERGY_COMPONENT';
export const ADD_ENERGY_COMPONENT = 'ADD_ENERGY_COMPONENT';
export const REMOVE_ENERGY_COMPONENT = 'REMOVE_ENERGY_COMPONENT';
export const EDIT_ENERGY_COMPONENT = 'EDIT_ENERGY_COMPONENT';
export const LOAD_ENERGY_COMPONENTS = 'LOAD_ENERGY_COMPONENTS';
export const CHANGE_KEXP = 'CHANGE_KEXP';
export const CHANGE_KRDEL = 'CHANGE_KRDEL';
export const CHANGE_AREA = 'CHANGE_AREA';
export const CHANGE_CURRENTFILENAME = 'CHANGE_CURRENTFILENAME';
export const EDIT_WFACTORS = 'EDIT_WFACTORS';
export const RECEIVE_ENERGYDATA = 'RECEIVE_ENERGYDATA';

/*
 * action creators
 */

export function selectEnergyComponent(id, component) {
  return { type: SELECT_ENERGY_COMPONENT, id, component };
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

export function loadEnergyComponents(newcomponents) {
  return { type: LOAD_ENERGY_COMPONENTS, newcomponents };
}

export function changeKexp(value) {
  return { type: CHANGE_KEXP, value };
}

export function changeKrdel(value) {
  return { type: CHANGE_KRDEL, value };
}

export function changeArea(value) {
  return { type: CHANGE_AREA, value };
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
    const { kexp, krdel, area, components, wfactors } = getState();
    const activecomponents = components.filter(component => component.active);
    const data = readenergydata(activecomponents);
    const res = ep2dict(weighted_energy(data, krdel, wfactors, kexp),
                        area);
    dispatch(deliverEnergy(res));
  };
}
