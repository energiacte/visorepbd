import React from "react";
import { connect } from "react-redux";

import NumInput from "components/NumInput";

import {
  changeKexp,
  changeArea,
  changeLocation,
  loadEnergyComponents,
  changeCurrentFileName
} from "actions/actions.js";
import { selectWFactors } from "reducers/reducers";

import { serialize_components } from "utils";

// Control de variables globales: área, kexp, carga y descarga de datos
class GlobalVarsControlClass extends React.Component {
  render() {
    const {
      kexp,
      area,
      location,
      changeKexp,
      changeArea,
      changeLocation,
      loadComponents
    } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div id="globalvarscontrol" className="form-horizontal col-lg-12">
              {/* Slider de kexp con entrada de lectura numérica */}
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
                  onChange={e => changeKexp(e.target.value)}
                />{" "}
                <NumInput
                  id="kexp_input"
                  size="3"
                  value={kexp}
                  className="form-control-sm"
                  groupClassName="d-inline"
                  style={kexp !== 0.0 ? { backgroundColor: "orange" } : null}
                  title={
                    kexp !== 0.0 ? "Valor no reglamentario (kexp != 0)" : null
                  }
                  readOnly
                />
              </div>
              {/* Entrada de edición de área de referencia */}
              <NumInput
                id="area_input"
                precision={0}
                min={0}
                value={area}
                onValueChange={changeArea}
                groupClassName="d-inline-block"
                labelClassName="col-lg-5"
                className="d-inline form-control-sm col-lg-7"
              >
                Area<sub>ref</sub> (m²){" "}
              </NumInput>
              {/* Desplegable de selección de localización */}
              <div className="form-group d-inline-block col-lg-3">
                <label
                  className="control-label col-lg-5"
                  htmlFor="selectLocation"
                >
                  Localización
                </label>
                <select
                  id="selectLocation"
                  className="d-inline form-control form-control-sm col-lg-6"
                  onChange={e => changeLocation(e.target.value)}
                  defaultValue={location}
                >
                  <option value="PENINSULA">Península</option>
                  <option value="CANARIAS">Islas Canarias</option>
                  <option value="BALEARES">Islas Baleares</option>
                  <option value="CEUTAMELILLA">Ceuta y Melilla</option>
                </select>
              </div>
              {/* Botones de carga y descarga de datos */}
              <div id="buttons" className="form-group float-right">
                <div
                  className="btn-group btn-group-md"
                  role="group"
                  aria-label="acciones"
                >
                  <input
                    ref={ref => (this.fileInput = ref)}
                    type="file"
                    onChange={e =>
                      this.uploadFile(e, loadComponents)
                    }
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
                    onClick={() => this.downloadFile()}
                  >
                    <span className="fa fa-download" /> Guardar datos
                  </button>
                </div>
              </div>
            </div>
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
    this.props.changeCurrentFileName(file.name);
  }

  downloadFile() {
    const { wfactors, cmeta, cdata, currentfilename } = this.props;
    const energystring = serialize_components(wfactors, cmeta, cdata);
    const data = new Blob([energystring], { type: "text/plain;charset=utf8;" });
    // create hidden link
    const element = document.createElement("a");
    document.body.appendChild(element);
    element.setAttribute("href", window.URL.createObjectURL(data));
    element.setAttribute("download", currentfilename);
    element.style.display = "";
    element.click();
    document.body.removeChild(element);
  }
}

const GlobalVarsControl = connect(
  state => ({
    kexp: state.kexp,
    area: state.area,
    location: state.location,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    cmeta: state.cmeta,
    cdata: state.cdata,
    wfactors: selectWFactors(state),
    currentfilename: state.currentfilename
  }),
  dispatch => ({
    loadComponents: datastr => dispatch(loadEnergyComponents(datastr)),
    changeCurrentFileName: newname => dispatch(changeCurrentFileName(newname)),
    changeKexp: value => dispatch(changeKexp(value)),
    changeArea: value => dispatch(changeArea(value)),
    changeLocation: value => dispatch(changeLocation(value))
  })
)(GlobalVarsControlClass);

export default GlobalVarsControl;
