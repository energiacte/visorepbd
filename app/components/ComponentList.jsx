import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Panel from 'react-bootstrap/lib/Panel';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

import { addComponent, selectComponent } from 'actions/actions.js';

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  static contextTypes = {
    store: React.PropTypes.object
  }

  /*
     static propTypes = {
     type: PropTypes.string.isRequired,
     originoruse: PropTypes.string.isRequired,
     vector: PropTypes.string.isRequired,
     values: PropTypes.array.isRequired,
     } */

  render() {
    const { selectedkey, id, type, originoruse, vector, values } = this.props;
    return (
      <tr onClick={this.onClick}
          className={selectedkey === id | false ? 'bg-info' : ''}>
        <td>{type}</td>
        <td>{originoruse}</td>
        <td>{vector}</td>
        <td>{values}</td>
      </tr>
    );
  }

  onClick() {
    this.props.dispatch(selectComponent(this.props.id));
  }

}

Component = connect (
  state => {
    return {
      selectedkey: state.selectedkey
    }
  }//, // mapStateToProps /* dispatch => { return { onClick: (id) => {dispatch(selectComponent(id))} } } */
)(Component);


export class ComponentEdit extends React.Component {

  render() {
    const { selectedkey } = this.props;

    console.log("Componente seleccionado: ", selectedkey);
    // <input type="range" min="0" max="100" step="1" data-buffer="60" /><p>prueba</p>

    return (
      <p>Componente seleccionado: { selectedkey }</p>
    );
  }
}

ComponentEdit = connect(state => { return { selectedkey: state.selectedkey } })(ComponentEdit);


export class ComponentList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { components } = this.props;

    const componentlist = components.map(
      (component, i) => {
        return (<Component
                    key={i}
                    id={i}
                    {...component} />)
      }
    );

    return (
      <Panel header="Energía suministrada o producida en el edificio">
        <ButtonGroup>
          <Button onClick={this.handleAdd.bind(this)}>+</Button>
          <Button>Middle</Button>
          <Button>Right</Button>
        </ButtonGroup>
        <table id="components" className="table-striped table-bordered table-condensed">
          <tbody>
            {componentlist}
          </tbody>
        </table>
      </Panel>
    );
  }

  handleAdd() {
    this.props.dispatch(addComponent({type: 'Suministro',
                                      originoruse: 'EPB',
                                      vector: 'ELECTRICIDAD',
                                      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }));
  }

}

ComponentList = connect(state => { return { components: state.components } })(ComponentList);
