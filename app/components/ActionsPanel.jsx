import React from 'react';

export default class ActionsPanel extends React.Component {

  render() {
    return (
      <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
        <button className="btn" id="add" type="button"
                onClick={this.props.onAdd}>
          <span className="glyphicon glyphicon-plus"/> Añadir
        </button>
        <button className="btn" id="remove" type="button"
                onClick={this.props.onRemove}>
          <span className="glyphicon glyphicon-minus"/> Borrar
        </button>
        <button className="btn" id="modify" type="button"
                onClick={this.props.onRestore}>
          <span className="glyphicon glyphicon-repeat"/> Restaurar
        </button>
      </div>
    );
  }
}
