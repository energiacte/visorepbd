import React from 'react';

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

  // Add component to component list
  handleAdd(selectedkey, _event) {
    let currentcomponent = (selectedkey !== null)
      ? { ...this.props.components[selectedkey] }
      : { active: true,
        type: 'CARRIER',
        ctype: 'PRODUCCION',
        csubtype: 'INSITU',
        carrier: 'ELECTRICIDAD',
        values: [10] * 12,
        comment: 'Comentario'
      };

    this.props.onAdd(currentcomponent);
  }

  // Remove current component to component list
  handleRemove(selectedkey, _event) {
    this.props.onRemove(selectedkey);
  }

  render() {
    const { components, selectedkey, area } = this.props;
    const maxvalue = Math.max(...components.map(component => Math.max(...component.values)));

    return (
      <div>
      <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
        <button className="btn" id="add" type="button"
                onClick={ () => this.handleAdd(selectedkey) }>
          <span className="glyphicon glyphicon-plus"/> Añadir
        </button>
        <button className="btn" id="remove" type="button"
                onClick={ () => this.handleRemove(selectedkey) }>
          <span className="glyphicon glyphicon-minus"/> Borrar
        </button>
      </div>
      <table id="components" className="table table-striped table-bordered table-condensed">
        <thead>
          <tr>
            <th></th>
            <th>Tipo</th>
            <th className="col-md-1">Subtipo</th>
            <th className="col-md-3">Vector energético</th>
            <th className="col-md-1">kWh/año</th>
            <th className="col-md-1">kWh/año·m²</th>
            <th className="col-md-1">Valores</th>
            <th className="col-md-4">Comentario</th>
          </tr>
        </thead>
        <tbody>
          {components.map(
             (component, i) => {
               const { active, ctype, csubtype, carrier, values, comment } = component;
               const data = values.map((value, imes) => { return { Mes: imes, Valor: value }; });
               const rowstyles = [
                 (selectedkey === i) ? 'bg-info' : '',
                 active ? '' : 'inactivecomponent',
                 (ctype === 'CONSUMO') ? 'deliveredstyle' : ''
               ].join(' ');
               const sumvalues = values.reduce((a, b)=> a + b, 0);
               return (
                 <tr key={i}
                     className={ rowstyles }
                     onClick={ _e => this.handleClick(i) }>
                   <td><input type="checkbox" defaultChecked={active}
                              onClick={ _e => this.handleChange(i) } /></td>
                   <td>{ ctype }</td>
                   <td>{ csubtype }</td><td>{ carrier }</td>
                   <td>{ sumvalues.toFixed(2) }</td>
                   <td>{ (sumvalues / area).toFixed(2) }</td>
                   <td><EnergyComponentChart ctype={ ctype }
                                             data={ data }
                                             maxvalue={ maxvalue }
                                             width="100%" /></td>
                   <td>{ comment }</td>
                 </tr>
               );
             }
           )
          }
        </tbody>
      </table>
      </div>
    );
  }

}
