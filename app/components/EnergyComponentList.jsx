import React, { PropTypes } from 'react';
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
    const { components, selectedkey, area } = this.props;
    const maxvalue = _.max(components.map(component => _.max(component.values)));

    return (
      <table id="components" className="table table-striped table-bordered table-condensed">
        <thead>
          <tr>
            <th></th><th>Tipo</th>
            <th>Origen/Uso</th><th>Vector energético</th>
            <th>kWh/año</th>
            <th>kWh/año·m²</th>
            <th>Valores</th>
            <th>Comentario</th>
          </tr>
        </thead>
        <tbody>
          {components.map(
             (component, i) => {
               const { active, ctype, originoruse, carrier, values, comment } = component;
               const data = values.map((value, imes) => { return { Mes: imes, Valor: value }; });
               const rowstyles = [
                 (selectedkey === i) ? 'bg-info' : '',
                 active ? '' : 'inactivecomponent',
                 (ctype === 'CONSUMO') ? 'deliveredstyle' : ''
               ].join(' ');
               const sumvalues = _.sum(values);
               return (
                 <tr key={i}
                     className={ rowstyles }
                     onClick={ e => this.handleClick(i) }>
                   <td><input type="checkbox" defaultChecked={active}
                              onClick={ e => this.handleChange(i) } /></td>
                   <td>{ ctype }</td>
                   <td>{ originoruse }</td><td>{ carrier }</td>
                   <td>{ sumvalues.toFixed(2) }</td>
                   <td>{ (sumvalues / area).toFixed(2) }</td>
                   <td><EnergyComponentChart ctype={ ctype }
                                             data={ data }
                                             maxvalue={ maxvalue }
                                             width='50px' /></td>
                   <td>{ comment }</td>
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
