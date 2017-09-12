import React from 'react';
//import { connect } from 'react-redux';

export default class GlobalVarsControl extends React.Component {
  render() {
    const { kexp, area, onChangeKexp, onChangeArea, currentfilename } = this.props;

    return (
      <div id="globalvarscontrol" className="form-horizontal bg-primary col-md-12">
        <div id="kexp" className="form-group col-md-3">
          <label className="control-label" htmlFor="kexprange">k<sub>exp</sub> </label>
          <input type="range" min="0" max="1" step="0.1"
                 name="kexprange"
                 className="form-control"
                 defaultValue={ kexp }
                 onChange={ e => onChangeKexp(e.target.value) } />
          <input type="text" readOnly maxLength="3" size="3"
                 value={ kexp.toFixed(1) } />
        </div>
        <div className="form-group col-md-3" />
        <div id="area" className="form-group col-md-3">
          <label className="control-label" htmlFor="areaentry">Area<sub>ref</sub> (m²) </label>
          <input type="number" lang="es" min="1" step="1"
                 name="areaentry"
                 className="form-control"
                 value={ area.toFixed(0) }
                 onChange={ e => onChangeArea(e.target.value) } />
        </div>
        <div className="form-group">
          <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
            <input ref={ ref => this.fileInput = ref } type="file"
              onChange={e => this.uploadFile(e, this.props.onCarriersLoad)}
              style={{ visibility: 'hidden', position: 'absolute', top: '-50px', left: '-50px' }} />
            <button className="btn bg-primary" id="modify" type="button"
              onClick={() => this.fileInput.click()}>
              <span className="glyphicon glyphicon-upload" /> Cargar datos
            </button>
            <button className="btn bg-primary" id="save" type="button"
              onClick={e => this.downloadFile(e, this.props.onCarriersDownload, currentfilename)}>
              <span className="glyphicon glyphicon-download" /> Guardar datos
            </button>
          </div>
        </div>
      </div>
    );
  }

  uploadFile(e, handler) {
    let file;
    if (e.dataTransfer) {
      file = e.dataTransfer.files[0];
    } else if (e.target) {
      file = e.target.files[0];
    }

    const reader = new FileReader();
    reader.onload = el => handler(el.target.result);
    reader.readAsText(file);
    this.props.onChangeCurrentFileName(file.name);
  }

  downloadFile(e, handler, filename) {
    const energystring = handler();
    const data = new Blob([energystring],
                          { type: 'text/plain;charset=utf8;' });
    // create hidden link
    const element = document.createElement('a');
    document.body.appendChild(element);
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', filename);
    element.style.display = '';
    element.click();
    document.body.removeChild(element);
  }
}
