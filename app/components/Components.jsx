import uuid from 'node-uuid';
import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

const initialstate = {
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

var Component = ({id, type, originoruse, vector, values}) =>
  <tr id={id}>
    <td>{type}</td>
    <td>{originoruse}</td>
    <td>{vector}</td>
    <td>{values}</td>
  </tr>;

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
        <table className="table-striped table-bordered table-condensed">
          <tbody>
          {components.map(component =>
              <Component
                  id={component.id}
                  type={component.type}
                  originoruse={component.originoruse}
                  vector={component.vector}
                  values={component.values} />
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
      components : [... this.state.components, {id: uuid.v4(), type: 'Suministro', originoruse: 'EPB', vector: 'ELECTRICIDAD', values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }]
      /* components: this.state.components.concat([{ id: uuid.v4(), type: 'New type' }]) */
    }
                , () => console.log('añade componente cambiando estado y pulsando botón!')
    );
  };

}
