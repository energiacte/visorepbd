import numeral from 'numeral';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectEnergyComponent } from 'actions/actions.js';

import EnergyComponentChart from 'components/EnergyComponentChart.jsx';

class EnergyComponentList extends React.Component {

  maxvalue() {
    return _.max(
      this.props.components.map(
        (component) => { return _.max(component.values) }
      )
    );
  }

  render() {
    const { components, selectedkey } = this.props;
    const maxvalue = this.maxvalue();

    return (
      <table id="components" className="table table-striped table-bordered table-condensed">
        <thead>
          <tr>
            <th>Tipo</th><th>Origen/Uso</th><th>Vector energético</th>
            <th>kWh/año</th>
            <th>Valores</th>
            <th>Valores</th>
          </tr>
        </thead>
        <tbody>
          {components.map(
             (component, i) => {
               const { ctype, originoruse, carrier, values } = component;
               const data = values.map((value, i) => { return {"Mes": i, "Valor": value};});

               return (
                 <tr key={i}
                     className={selectedkey === i | false ? 'bg-info' : ''}
                     onClick={this.onClick.bind(this, i)}>
                   <td>{ctype}</td><td>{originoruse}</td><td>{carrier}</td>
                   <td>{numeral(_.sum(values)).format('0.00')}</td>
                   <td>{values.map((value)=> numeral(value).format('0.0')).join(', ')}</td>
                   <td><EnergyComponentChart type={ ctype } data={ data } maxvalue={ maxvalue } /></td>
                 </tr>
               );
             }
           )
          }
        </tbody>
      </table>
    );
  }

  onClick(i, event) {
    this.props.dispatch(selectEnergyComponent(i));
  }

}

export default EnergyComponentList = connect(state => {
  return {
    selectedkey: state.selectedkey,
    components: state.components
  }
})(EnergyComponentList);
