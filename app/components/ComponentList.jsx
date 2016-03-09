import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Panel from 'react-bootstrap/lib/Panel';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

import { addComponent, selectComponent } from 'actions/actions.js';

class Component extends React.Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    originoruse: PropTypes.string.isRequired,
    vector: PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
  }

  render() {
    const { selectedkey, id, type, originoruse, vector, values } = this.props;
    return (
      <tr onClick={this.onClick.bind(this)}
          className={selectedkey === id | false ? 'bg-info' : ''}>
        <td>{id}</td>
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


export class ComponentEditor extends React.Component {

  render() {
    // <input type="range" min="0" max="100" step="1" data-buffer="60" /><p>prueba</p>
    const { selectedkey, components } = this.props;
    const { type, originoruse, vector, values } = components[selectedkey];
    return (
      <div>
        <table id="editor" className="table-striped table-bordered table-condensed">
          <tbody>
            <tr>
              <td>{selectedkey}</td>
              <td>{type}</td>
              <td>{originoruse}</td>
              <td>{vector}</td>
              <td>{values}</td>
            </tr>
          </tbody>
        </table>
        <ButtonGroup>
          <Button>+</Button>
          <Button>-</Button>
        </ButtonGroup>
      </div>
    );
  }
}

ComponentEditor = connect(state => {
  return {
    selectedkey: state.selectedkey,
    components: state.components
  }
})(ComponentEditor);


export class ComponentList extends React.Component {

  render() {
    const { components } = this.props;

    const componentlist = components.map(
      (component, i) => {
        return (<Component key={i} id={i} {...component} />)
      }
    );

    return (
      <div>

        <ButtonGroup>
          <Button onClick={this.handleAdd.bind(this)}>+</Button>
          <Button>-</Button>
        </ButtonGroup>

        <table id="components" className="table-striped table-bordered table-condensed">
          <thead>
            <tr>
              <td>#</td>
              <td>Tipo</td>
              <td>Origen/Uso</td>
              <td>Vector energético</td>
              <td>Valores</td>
            </tr>
          </thead>
          <tbody>
            {componentlist}
          </tbody>
        </table>
      </div>
    );
  }

  handleAdd(event) {
    this.props.dispatch(addComponent({type: 'Suministro',
                                      originoruse: 'EPB',
                                      vector: 'ELECTRICIDAD',
                                      values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }));
  }

}

ComponentList = connect(state => { return { components: state.components } })(ComponentList);
