import uuid from 'node-uuid';
import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

const initialstate = {
  selectedid: null,
  components: [
    {
      id: uuid.v4(),
      type: 'Suministro',
      originoruse: 'EPB',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      id: uuid.v4(),
      type: 'Suministro',
      originoruse: 'NEPB',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      id: uuid.v4(),
      type: 'Producción',
      originoruse: 'INSITU',
      vector: 'MEDIOAMBIENTE',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      id: uuid.v4(),
      type: 'Producción',
      originoruse: 'COGENERACION',
      vector: 'ELECTRICIDAD',
      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }
  ]
};

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.component;
  }

  render() {
    return (
      <tr onClick={() => this.props.selectCallback(this.state.id)}
          className={(this.state.id === this.props.selectedid)? 'bg-info' : ''}
          id={this.state.id}>
        <td>{this.state.type}</td>
        <td>{this.state.originoruse}</td>
        <td>{this.state.vector}</td>
        <td>{this.state.values}</td>
      </tr>
    );
  }

}

export default class Components extends React.Component {

  constructor(props) {
    super(props);

    this.state = initialstate;
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
          {components.map(component =>
            <Component
                selectCallback={this.selectComponent}
                selectedid={this.state.selectedid}
                component={component} />
           )}
          </tbody>
        </table>
      </Panel>
    );
  }

  // We are using an experimental feature known as property
  // initializer here. It allows us to bind the method `this`
  // to point at our *App* instance.
  //
  // Alternatively we could `bind` at `constructor` using
  // a line, such as this.addNote = this.addNote.bind(this);
  addComponent = () => {
    // It would be possible to write this in an imperative style.
    // I.e., through `this.state.components.push` and then
    // `this.setState({notes: this.state.components})` to commit.
    this.setState({
      selectedid: this.state.selectedid,
      components : [... this.state.components,
                    {id: uuid.v4(),
                     type: 'Suministro',
                     originoruse: 'EPB',
                     vector: 'ELECTRICIDAD',
                     values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                    }
      ]
    }
                , () => console.log('añade componente cambiando estado y pulsando botón!')
    );
  };

  selectComponent = (selectedid) => {
    this.setState({
      selectedid: selectedid,
      components: this.state.components
    });
    console.log('El componente seleccionado es ' + selectedid);
  };

}
