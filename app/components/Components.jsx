import uuid from 'node-uuid';
import React from 'react';

var Component = ({type, originoruse, vector, values}) => <div>{type} - {originoruse} - {vector} - {values}</div>;

export default class Components extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
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
  }

  render() {
    const components = this.state.components;

    return (
      <div>
        {/* <input type="range" min="0" max="100" step="1" data-buffer="60" /><p>prueba</p> */}
        <button onClick={this.addComponent}>+</button>
        <ul>{components.map(component =>
          <li key={component.id}>
            <Component type={component.type}
                       originoruse={component.originoruse}
                       vector={component.vector}
                       values={component.values} />
          </li>
          )}</ul>
      </div>
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
    // I.e., through `this.state.notes.push` and then
    // `this.setState({notes: this.state.notes})` to commit.
    this.setState({
      components : [... this.state.components, {id: uuid.v4(), type: 'Suministro', originoruse: 'EPB', vector: 'ELECTRICIDAD', values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }]
      /* notes: this.state.components.concat([{ id: uuid.v4(), type: 'New type' }]) */
    }
                , () => console.log('añade componente cambiando estado y pulsando botón!')
    );
  };

}
