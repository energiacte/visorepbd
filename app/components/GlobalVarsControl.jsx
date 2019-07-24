import React from "react";
import NumInput from "components/NumInput";

// Control de variables globales: área, kexp, carga y descarga de datos
export default class GlobalVarsControl extends React.Component {
  render() {
    const {
      kexp,
      area,
      onChangeKexp,
      onChangeArea,
      currentfilename
    } = this.props;

    return (
      <div id="globalvarscontrol" className="form-horizontal col-lg-12">
        <div id="kexp" className="form-group col-lg-3">
          <label className="control-label" htmlFor="kexprange">
            k<sub>exp</sub>{" "}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            name="kexprange"
            className="form-control custom-range"
            defaultValue={kexp}
            onChange={e => onChangeKexp(e.target.value)}
          />{" "}
          <NumInput
            id="kexp_input"
            size="3"
            value={kexp}
            className="form-control-sm"
            groupClassName="d-inline"
            style={kexp !== 0.0 ? { backgroundColor: "orange" } : null}
            title={kexp !== 0.0 ? "Valor no reglamentario (kexp != 0)" : null}
            readOnly
          />
        </div>
        <NumInput
          id="area_input"
          precision={0}
          min={0}
          value={area}
          onNumberChange={onChangeArea}
          defaultValue={area}
          groupClassName="d-inline-block"
          labelClassName="col-lg-5"
          className="d-inline form-control-sm col-lg-7"
          hasFeedback={true}
        >
          Area<sub>ref</sub> (m²){" "}
        </NumInput>
        <div id="buttons" className="form-group float-right">
          <div
            className="btn-group btn-group-md"
            role="group"
            aria-label="acciones"
          >
            <input
              ref={ref => (this.fileInput = ref)}
              type="file"
              onChange={e => this.uploadFile(e, this.props.onCarriersLoad)}
              style={{
                visibility: "hidden",
                position: "absolute",
                top: "-50px",
                left: "-50px"
              }}
            />
            <button
              className="btn btn-light"
              id="modify"
              type="button"
              onClick={() => this.fileInput.click()}
            >
              <span className="fa fa-upload" /> Cargar datos
            </button>
            <button
              className="btn btn-light"
              id="save"
              type="button"
              onClick={e =>
                this.downloadFile(
                  e,
                  this.props.onCarriersDownload,
                  currentfilename
                )
              }
            >
              <span className="fa fa-download" /> Guardar datos
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
    const data = new Blob([energystring], { type: "text/plain;charset=utf8;" });
    // create hidden link
    const element = document.createElement("a");
    document.body.appendChild(element);
    element.setAttribute("href", window.URL.createObjectURL(data));
    element.setAttribute("download", filename);
    element.style.display = "";
    element.click();
    document.body.removeChild(element);
  }
}
