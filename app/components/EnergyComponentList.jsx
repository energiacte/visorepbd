import numeral from 'numeral';
import _ from 'lodash';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectEnergyComponent, editEnergyComponent } from 'actions/actions.js';

import EnergyComponentChart from 'components/EnergyComponentChart.jsx';

class EnergyComponentList extends React.Component {

  // Valor máximo de los valores de los componentes
  maxvalue() {
    return _.max(
      this.props.components.map(
        (component) => { return _.max(component.values); }
      )
    );
  }

  // Seleccionar componente
  handleClick(i, event) {
    this.props.dispatch(selectEnergyComponent(i));
  }

  // Cambiar estado activo del componente
  handleChange(i, event) {
    const component = this.props.components[i];
    this.props.dispatch(
      editEnergyComponent(i,
                          { ...component,
                            active: !component.active }));
  }

  render() {
    const { components, selectedkey } = this.props;
    const maxvalue = this.maxvalue();

    return (
      <table id="components" className="table table-striped table-bordered table-condensed">
        <thead>
          <tr>
            <th></th><th>Tipo</th>
            <th>Origen/Uso</th><th>Vector energético</th>
            <th>kWh/año</th>
            <th>Valores</th>
          </tr>
        </thead>
        <tbody>
          {components.map(
             (component, i) => {
               const { active, ctype, originoruse, carrier, values } = component;
               const data = values.map((value, imes) => { return { Mes: imes, Valor: value }; });
               const rowstyles = [
                 (selectedkey === i) ? 'bg-info' : '',
                 active ? '' : 'inactivecomponent',
                 (ctype === 'SUMINISTRO') ? 'deliveredstyle' : ''
               ].join(' ');
               return (
                 <tr key={i}
                     className={ rowstyles }
                     onClick={this.handleClick.bind(this, i)}>
                   <td><input type="checkbox" defaultChecked={active}
                              onClick={ this.handleChange.bind(this, i) } /></td>
                   <td>{ ctype }</td>
                   <td>{ originoruse }</td><td>{ carrier }</td>
                   <td>{ numeral(_.sum(values)).format('0.00') }</td>
                   <td><EnergyComponentChart ctype={ ctype }
                                             data={ data }
                                             maxvalue={ maxvalue } /></td>
                 </tr>
               );
             }
           )
          }
        </tbody>
      </table>
    );
  }

}

export default EnergyComponentList = connect(state => {
  return {
    selectedkey: state.selectedkey,
    components: state.components
  };
})(EnergyComponentList);
