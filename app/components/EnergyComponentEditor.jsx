import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';

import { selectEnergyComponent,
         addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         changeKexp,
         changeKrdel } from 'actions/actions.js';

const GlobalVarsControl = (props) => {
  return (
    <div>
      <div id="kexp">
        <span>k<sub>exp</sub> </span>
        <input type="range" min="0" max="1" step="0.1"
               defaultValue={props.kexp}
               onChange={props.onChangeKexp} />
        <span>  </span>
        <input type="text" readOnly maxLength="3" size="3"
               value={numeral(props.kexp).format('0.0')} />
      </div>
      <div id="krdel">
        <span>k<sub>rdel</sub> </span>
        <input type="range" min="0" max="1" step="0.1"
               defaultValue={props.krdel}
               onChange={props.onChangeKrdel} />
        <span>  </span>
        <input type="text" readOnly maxLength="3" size="3"
               value={numeral(props.krdel).format('0.0')} />
      </div>
    </div>
  );
}

const ActionsPanel = (props) => {
  return (
    <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
      <button className="btn" id="add" onClick={props.onAdd}>
        <span className="glyphicon glyphicon-plus"></span> Añadir
      </button>
      <button className="btn" id="remove" onClick={props.onRemove}>
        <span className="glyphicon glyphicon-minus"></span> Borrar
      </button>
        <button className="btn" id="modify" onClick={props.onUpdate}>
          <span className="glyphicon glyphicon-edit"></span> Modificar
        </button>
    </div>);
}


class ECEditor extends React.Component {

  render() {
    const { selectedkey, components } = this.props;
    const { ctype, originoruse, carrier, values } = components[selectedkey];

    // Mostrar Chart con tooltips con los Valores
    // Editor de Valores
    // Desplegables para otros datos

    return (
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
    );
  }

}

class EnergyComponentEditor extends React.Component {

  render() {
    const { selectedkey, kexp, krdel } = this.props;

    return (
      <div>
        <GlobalVarsControl
            kexp={kexp}
            krdel={krdel}
            onChangeKexp={(ev) => this.handleChangeKexp(ev)}
            onChangeKrdel={(ev) => this.handleChangeKrdel(ev)} />
        <ECEditor {...this.props} />
        <ActionsPanel
            onAdd={() => this.handleAdd(selectedkey)}
            onRemove={() => this.handleRemove(selectedkey)}
            onUpdate={() => this.handleUpdate(selectedkey, {})} />
      </div>
    );
  }

  handleChangeKexp(ev) {
    this.props.dispatch(changeKexp(ev.target.value));
  }

  handleChangeKrdel(ev) {
    this.props.dispatch(changeKrdel(ev.target.value));
  }

  handleAdd(selectedkey, event) {
    this.props.dispatch(
      addEnergyComponent(
        {ctype: 'PRODUCCION',
         originoruse: 'INSITU',
         carrier: 'ELECTRICIDAD',
         values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
    }));
  }

  handleRemove(selectedkey, event) {
    this.props.dispatch(removeEnergyComponent(selectedkey));
  }

  handleUpdate(selectedkey, component, event) {
    this.props.dispatch(
      editEnergyComponent(
        selectedkey,
        {ctype: 'SUMINISTRO',
         originoruse: 'EPB',
         carrier: 'ELECTRICIDAD',
         values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }));
  }

}

export default EnergyComponentEditor = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel,
    selectedkey: state.selectedkey,
    components: state.components
  }
})(EnergyComponentEditor);

