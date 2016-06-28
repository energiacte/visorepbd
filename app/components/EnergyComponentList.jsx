import React, { PropTypes } from 'react';

import numeral from 'numeral';
import _ from 'lodash';

import EnergyComponentChart from 'components/EnergyComponentChart.jsx';

export default class EnergyComponentList extends React.Component {

  // Seleccionar componente
  handleClick(i) {
    const component = this.props.components[i];
    this.props.onSelect(i, component);
  }

  // Cambiar estado activo del componente
  handleChange(i) {
    const component = this.props.components[i];
    this.props.onEdit(i, { ...component, active: !component.active });
  }

  render() {
    const { components, selectedkey } = this.props;
    const maxvalue = _.max(components.map(component => _.max(component.values)));

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
                 (ctype === 'CONSUMO') ? 'deliveredstyle' : ''
               ].join(' ');
               return (
                 <tr key={i}
                     className={ rowstyles }
                     onClick={ e => this.handleClick(i) }>
                   <td><input type="checkbox" defaultChecked={active}
                              onClick={ e => this.handleChange(i) } /></td>
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
