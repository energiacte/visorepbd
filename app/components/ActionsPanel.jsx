import React from 'react';

import { getComponents } from '../epbdutils.js';

export default class ActionsPanel extends React.Component {

  handleFiles(e, onLoadHandler) {
    let file;
    if (e.dataTransfer) {
      file = e.dataTransfer.files[0];
    } else if (e.target) {
      file = e.target.files[0];
    }

    //console.log("Name: ", file.name, ", Type: ", file.type);
    const reader = new FileReader();
    reader.onload = e => onLoadHandler(getComponents(e.target.result));
    reader.readAsText(file);
  }

  render() {
    return (
      <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
        <button className="btn" id="add" onClick={this.props.onAdd}>
          <span className="glyphicon glyphicon-plus"></span> Añadir
        </button>
        <button className="btn" id="remove" onClick={this.props.onRemove}>
          <span className="glyphicon glyphicon-minus"></span> Borrar
        </button>
        <button className="btn" id="modify" onClick={this.props.onRestore}>
          <span className="glyphicon glyphicon-repeat"></span> Restaurar
        </button>
        <input ref="fileInput" type="file"
               onChange={ e => this.handleFiles(e, this.props.onLoad) }
               style={{visibility:'hidden', position:'absolute', top:'-50', left:'-50'}} />
        <button className="btn bg-primary" id="modify"
                onClick={ e => this.refs.fileInput.click() }>
          <span className="glyphicon glyphicon-upload"></span> Cargar datos
        </button>
      </div>
    );
  }
};
