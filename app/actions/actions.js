import $ from 'jquery';
import Cookies from 'js-cookie';

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

// async action creator to get API data: thunk (redux-thunk middleware)

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

export function fetchData() {
  // this async action also reads state
  return (dispatch, getState) => {
    const { kexp, krdel, area, components } = getState();
    const activecomponents = components.filter(component => component.active);
    const csrftoken = Cookies.get('csrftoken');

    return $.ajax({
      // document.location.host = host + port
      url: 'http://' + document.location.host + __EPBDURLPREFIX__ + '/api/epindicators',
      method: 'POST', // http method
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({ kexp, krdel, area, components: activecomponents }),
      crossDomain: false, // needed so request.is_ajax works
      beforeSend(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      }
    }).done(
      json => dispatch(deliverData(json))
    ).fail((xhr, errmsg, err) => {
      console.log(xhr.status + ': ' + xhr.responseText + ': ' + err);
      dispatch(deliverData(null));
    });
  };
}
