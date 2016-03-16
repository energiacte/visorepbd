import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { addEnergyComponent,
         selectEnergyComponent,
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

export class EnergyComponentEditor extends React.Component {

  render() {
    const { selectedkey, kexp, krdel, components, dispatch } = this.props;
    const { type, originoruse, carrier, values } = components[selectedkey];

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

        <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
          <button className="btn" id="add" onClick={this.handleAdd.bind(this)}>
            <span className="glyphicon glyphicon-plus"></span> Añadir
          </button>
          <button className="btn" id="remove">
            <span className="glyphicon glyphicon-minus"></span> Borrar
          </button>
          <button className="btn" id="modify">
            <span className="glyphicon glyphicon-refresh"></span> Modificar
          </button>
          <button className="btn" id="clean">
            <span className="glyphicon glyphicon-trash"></span> Limpiar
          </button>
        </div>
      </div>
    );
  }

  handleAdd(event) {
    this.props.dispatch(addEnergyComponent({type: 'Suministro',
                                      originoruse: 'EPB',
                                      carrier: 'ELECTRICIDAD',
                                      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }));
  }

}

EnergyComponentEditor = connect(state => {
  return {
    selectedkey: state.selectedkey,
    kexp: state.kexp,
    krdel: state.krdel,
    components: state.components
  }
})(EnergyComponentEditor);


export class EnergyComponentList extends React.Component {

  render() {
    const { components, selectedkey } = this.props;
    return (
      <table id="components" className="table table-striped table-bordered table-condensed">
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
            <th>Origen/Uso</th>
            <th>Vector energético</th>
            <th>Valores</th>
          </tr>
        </thead>
        <tbody>
          {components.map(
             (component, i) => {
               const { type, originoruse, carrier, values } = component;
               return (
                 <tr key={i}
                     className={selectedkey === i | false ? 'bg-info' : ''}
                     onClick={this.onClick.bind(this, i)}>
                   <td>{i}</td>
                   <td>{type}</td>
                   <td>{originoruse}</td>
                   <td>{carrier}</td>
                   <td>{values}</td>
                 </tr>
               );
             }
           )}
        </tbody>
      </table>
    );
  }

  onClick(i, event) {
    this.props.dispatch(selectEnergyComponent(i));
  }

}

EnergyComponentList = connect(state => {
  return {
    selectedkey: state.selectedkey,
    components: state.components
  }
})(EnergyComponentList);
