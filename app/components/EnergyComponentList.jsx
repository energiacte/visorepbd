import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectEnergyComponent } from 'actions/actions.js';

class EnergyComponentList extends React.Component {

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
            <th>kWh/año</th>
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
                   <td>{_.sum(values)}</td>
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

export default EnergyComponentList = connect(state => {
  return {
    selectedkey: state.selectedkey,
    components: state.components
  }
})(EnergyComponentList);
