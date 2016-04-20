import React, { PropTypes } from 'react';

const ActionsPanel = (props) => {
  return (
    <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
      <button className="btn" id="add" onClick={props.onAdd}>
        <span className="glyphicon glyphicon-plus"></span> Añadir
      </button>
      <button className="btn" id="remove" onClick={props.onRemove}>
        <span className="glyphicon glyphicon-minus"></span> Borrar
      </button>
        <button className="btn" id="modify" onClick={props.onRestore}>
          <span className="glyphicon glyphicon-edit"></span> Deshacer
        </button>
    </div>);
};

export default ActionsPanel;
