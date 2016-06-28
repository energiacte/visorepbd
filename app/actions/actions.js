import $ from 'jquery';

/*
 * action types
 */

export const SELECT_ENERGY_COMPONENT = 'SELECT_ENERGY_COMPONENT';
export const ADD_ENERGY_COMPONENT = 'ADD_ENERGY_COMPONENT';
export const REMOVE_ENERGY_COMPONENT = 'REMOVE_ENERGY_COMPONENT';
export const EDIT_ENERGY_COMPONENT = 'EDIT_ENERGY_COMPONENT';
export const CHANGE_KEXP = 'CHANGE_KEXP';
export const CHANGE_KRDEL = 'CHANGE_KRDEL';
export const CHANGE_AREA = 'CHANGE_AREA';
export const RECEIVE_DATA = 'RECEIVE_DATA';

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

export function changeKexp(value) {
  return { type: CHANGE_KEXP, value };
}

export function changeKrdel(value) {
  return { type: CHANGE_KRDEL, value };
}

export function changeArea(value) {
  return { type: CHANGE_AREA, value };
}

export function deliverData(newdata) {
  return { type: RECEIVE_DATA, newdata };
}

/* async action creator: thunk (redux-thunk middleware) */

export function fetchData(kexp, krdel, area, components) {
  const activecomponents = components.filter(
    component => component.active
  );

  return dispatch => {
    return $.ajax({
      // document.location.host = host + port
      url: 'http://' + document.location.host + __EPBDURLPREFIX__ + '/epindicators',
      method: 'POST', // http method
      dataType: 'json',
      data: JSON.stringify({ kexp, krdel, area, components: activecomponents }),
      crossDomain: false // needed so request.is_ajax works
    }).done(
      json => dispatch(deliverData(json))
    ).fail((xhr, errmsg, err) => {
      console.log(xhr.status + ': ' + xhr.responseText + ': ' + err);
      dispatch(deliverData(null));
    });
  };
}

