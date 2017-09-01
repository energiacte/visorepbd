import React from 'react';

export default class ActionsPanel extends React.Component {

  handleFiles(e, onLoadHandler) {
    let file;
    if (e.dataTransfer) {
      file = e.dataTransfer.files[0];
    } else if (e.target) {
      file = e.target.files[0];
    }

    const reader = new FileReader();
    reader.onload = el => onLoadHandler(el.target.result);
    reader.readAsText(file);
    this.props.onChangeCurrentFileName(file.name);
  }

  downloadFile(e, getEnergyString) {
    const energystring = getEnergyString();
    const data = new Blob([energystring],
                          { type: 'text/plain;charset=utf8;' });
    // create hidden link
    const element = document.createElement('a');
    document.body.appendChild(element);
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', this.props.currentfilename);
    element.style.display = '';
    element.click();
    document.body.removeChild(element);
  }

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
        <input ref="fileInput" type="file"
               onChange={ e => this.handleFiles(e, this.props.onLoad) }
               style={{ visibility: 'hidden', position: 'absolute', top: '-50px', left: '-50px' }} />
        <button className="btn bg-primary" id="modify" type="button"
                onClick={ () => this.refs.fileInput.click() }>
          <span className="glyphicon glyphicon-upload"/> Cargar datos
        </button>
        <button className="btn bg-primary" id="save" type="button"
                onClick={ e => this.downloadFile(e, this.props.getEnergyString) }>
          <span className="glyphicon glyphicon-download"/> Guardar datos
        </button>
      </div>
    );
  }
}
