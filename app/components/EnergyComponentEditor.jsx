import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';

import { selectEnergyComponent,
         addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         changeKexp,
         changeKrdel } from 'actions/actions.js';

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
                 value={numeral(kexp).format('0.0')} />
        </div>
        <div id="krdel">
          <span>k<sub>rdel</sub> </span>
          <input type="range" min="0" max="1" step="0.1"
                 defaultValue={krdel}
                 onChange={ (ev) => dispatch(changeKrdel(ev.target.value)) } />
          <span>  </span>
          <input type="text" readOnly maxLength="3" size="3"
                 value={numeral(krdel).format('0.0')} />
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
    this.props.dispatch(addEnergyComponent({ctype: 'SUMINISTRO',
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
                                            {ctype: 'SUMINISTRO',
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
    const { ctype, originoruse, carrier, values } = components[selectedkey];

    // Mostrar Chart con tooltips con los Valores
    // Editor de Valores
    // Desplegables para otros datos

    return (
      <div>
        <GlobalVarsControl />
        <table id="editor" className="table-striped table-bordered table-condensed">
          <tbody>
            <tr>
              <td>{selectedkey}</td>
              <td>{ctype}</td>
              <td>{originoruse}</td>
              <td>{carrier}</td>
              <td>{values.map(val => numeral(val).format('0.0'))
                         .join(',')
                  }</td>
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

