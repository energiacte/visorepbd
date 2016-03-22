import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectEnergyComponent,
         addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         changeKexp,
         changeKrdel } from 'actions/actions.js';


function singledigitprec(number) {
  // return number with one digit precision
  return parseFloat(Math.round(number * 10) / 10).toFixed(1);
}

function doubledigitprec(number) {
  // return number with two digit precision
  return parseFloat(Math.round(number * 100) / 100).toFixed(2);
}

function valuestostring(values) {
  // convert list of values to comma separated list of values
  // with 2 digit precision
  return values.map(val => doubledigitprec(val)).join(',');
}

class GlobalVarsControl extends React.Component {

  render() {
    const { kexp, krdel, dispatch } = this.props;

    return (
      <div>
        <div id="kexp">
          <span>k<sub>exp</sub> </span>
          <input type="range" min="0" max="1" step="0.1"
                 defaultValue={kexp}
                 onChange={ (ev) => dispatch(changeKexp(ev.target.value)) } />
          <span>  </span>
          <input type="text" readOnly maxLength="3" size="3"
                 value={singledigitprec(kexp)} />
        </div>
        <div id="krdel">
          <span>k<sub>rdel</sub> </span>
          <input type="range" min="0" max="1" step="0.1"
                 defaultValue={krdel}
                 onChange={ (ev) => dispatch(changeKrdel(ev.target.value)) } />
          <span>  </span>
          <input type="text" readOnly maxLength="3" size="3"
                 value={singledigitprec(krdel)} />
        </div>
      </div>
    );
  }
}

GlobalVarsControl = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel
  }
})(GlobalVarsControl);


class ActionsPanel extends React.Component {

  render() {
    const { selectedkey, dispatch } = this.props;

    return (
      <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
        <button className="btn" id="add" onClick={this.handleAdd.bind(this)}>
          <span className="glyphicon glyphicon-plus"></span> Añadir
        </button>
        <button className="btn" id="remove" onClick={this.handleRemove.bind(this, selectedkey)}>
          <span className="glyphicon glyphicon-minus"></span> Borrar
        </button>
        <button className="btn" id="modify" onClick={this.handleEdit.bind(this, selectedkey, {})}>
          <span className="glyphicon glyphicon-edit"></span> Modificar
        </button>
      </div>
    );
  }

  handleAdd(event) {
    this.props.dispatch(addEnergyComponent({type: 'SUMINISTRO',
                                            originoruse: 'EPB',
                                            carrier: 'ELECTRICIDAD',
                                            values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }));
  }

  handleRemove(selectedkey, event) {
    this.props.dispatch(removeEnergyComponent(selectedkey));
  }

  handleEdit(selectedkey, component, event) {
    this.props.dispatch(editEnergyComponent(selectedkey,
                                            {type: 'SUMINISTRO',
                                            originoruse: 'EPB',
                                            carrier: 'ELECTRICIDAD',
                                            values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }));
  }

}

ActionsPanel = connect(state => {
  return {
    selectedkey: state.selectedkey
  }
})(ActionsPanel);



class EnergyComponentEditor extends React.Component {

  render() {
    const { selectedkey, components } = this.props;
    const { type, originoruse, carrier, values } = components[selectedkey];

    return (
      <div>
        <GlobalVarsControl />
        <table id="editor" className="table-striped table-bordered table-condensed">
          <tbody>
            <tr>
              <td>{selectedkey}</td>
              <td>{type}</td>
              <td>{originoruse}</td>
              <td>{carrier}</td>
              <td>{valuestostring(values)}</td>
            </tr>
          </tbody>
        </table>
        <ActionsPanel />
      </div>
    );
  }

}

export default EnergyComponentEditor = connect(state => {
  return {
    selectedkey: state.selectedkey,
    components: state.components
  }
})(EnergyComponentEditor);

