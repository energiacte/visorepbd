import React, { PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';


class Component extends React.Component {

  render() {
    return (
      <tr onClick={this.props.onSelect()}
          className={this.props.isSelected | false ? 'bg-info' : ''}>
        <td>{this.props.type}</td>
        <td>{this.props.originoruse}</td>
        <td>{this.props.vector}</td>
        <td>{this.props.values}</td>
      </tr>
    );
  }
}

/*
   Component.propTypes = {
   onClick: PropTypes.func.isRequired,
   isSelected: PropTypes.bool.isRequired,
   type: PropTypes.string.isRequired,
   originoruse: PropTypes.string.isRequired,
   vector: PropTypes.string.isRequired,
   values: PropTypes.array.isRequired,
   } */

export default class Components extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.props.state;
    // bind this to methods (could instead use () => {})
    this.addComponent = this.addComponent.bind(this);
    this.selectComponent = this.selectComponent.bind(this);
  }

  render() {
    const components = this.state.components;

    return (
      <Panel header="Energía suministrada o producida en el edificio">
        {/* <input type="range" min="0" max="100" step="1" data-buffer="60" /><p>prueba</p> */}
        <ButtonGroup>
          <Button onClick={this.addComponent}>+</Button>
          <Button>Middle</Button>
          <Button>Right</Button>
        </ButtonGroup>
        <table id="components" className="table-striped table-bordered table-condensed">
          <tbody>
          {components.map((component, i) =>
            <Component
                key={i}
                onSelect={() => this.selectComponent.bind(null, i)}
                isSelected={i === this.state.selectedkey}
                {...component} />
           )}
          </tbody>
        </table>
      </Panel>
    )
  }

  addComponent() {
    this.setState({
      selectedkey: this.state.selectedkey,
      components : [... this.state.components,
                    {type: 'Suministro',
                     originoruse: 'EPB',
                     vector: 'ELECTRICIDAD',
                     values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                    }
      ]
    });
    console.log('añade componente cambiando estado y pulsando botón!');
  }

  selectComponent(i) {
    this.setState({
      selectedkey: i,
      components: this.state.components
    });
    console.log('El componente seleccionado es ' + i );
  }

}
