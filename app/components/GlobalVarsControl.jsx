import React from "react";
import { connect } from "react-redux";
import sanitize from "sanitize-filename";

import NumInput from "components/NumInput";

import {
  changeKexp,
  changeArea,
  changeDhw,
  changeLocation,
  loadEnergyComponents
} from "actions/actions.js";
import { selectWFactors, selectErrors } from "reducers/reducers";

import { serialize_components } from "utils";

// Control de variables globales: área, kexp, carga y descarga de datos
class GlobalVarsControlClass extends React.Component {
  constructor(props) {
    super(props);
    // Entrada oculta para hacer download
    this.fileInput = React.createRef();
    // Entrada para definir el nombre del archivo que se descarga o sube
    this.filenameinput = React.createRef();
  }

  render() {
    const {
      kexp,
      area,
      dhw_needs,
      location,
      errors,
      changeKexp,
      changeArea,
      changeDhw,
      changeLocation,
      loadComponents
    } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div id="globalvarscontrol" className="form-horizontal col-lg-12">
              {/* Slider de kexp con entrada de lectura numérica */}
              <div id="kexp" className="form-group col-lg-2">
                <label className="control-label col-lg-2" htmlFor="kexprange">
                  k<sub>exp</sub>{" "}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  name="kexprange"
                  className="form-control custom-range col-lg-8"
                  defaultValue={kexp}
                  onChange={e => changeKexp(e.target.value)}
                />{" "}
                <NumInput
                  id="kexp_input"
                  size="3"
                  value={kexp}
                  className="form-control-sm"
                  groupClassName="d-inline col-lg-2"
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
                groupClassName="d-inline-block col-lg-2"
                labelClassName="col-lg-8"
                className="d-inline form-control-sm col-lg-4"
              >
                Area<sub>ref</sub> (m²){" "}
              </NumInput>
              {/* Entrada de edición de demanda anual de ACS */}
              <NumInput
                id="dhw_input"
                precision={0}
                min={0}
                value={dhw_needs}
                onValueChange={changeDhw}
                groupClassName="d-inline-block col-lg-2"
                labelClassName="col-lg-8"
                className="d-inline form-control-sm col-lg-4"
              >
                D<sub>ACS,an</sub> (kWh/a){" "}
              </NumInput>
              {/* Desplegable de selección de localización */}
              <div className="form-group d-inline-block col-lg-2">
                <label
                  className="control-label col-lg-6"
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
              <div className="form-group d-inline-block col-lg-2">
                <label className="control-label col-lg-4" htmlFor="filename">
                    Nombre{" "}
                </label>
                <input
                    name="filename"
                  className="d-inline form-control form-control-sm col-lg-8"
                  type="text"
                  ref={this.filenameinput}
                  defaultValue="Ejemplo_VisorEPBD"
                />
              </div>
              <div id="buttons" className="form-group d-inline-block col-lg-2">
                <div
                  className="btn-group btn-group-md"
                  role="group"
                  aria-label="acciones"
                >
                  <input
                    ref={this.fileInput}
                    type="file"
                    onChange={e => this.uploadFile(e, loadComponents)}
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
                    onClick={() => this.fileInput.current.click()}
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
        {errors.length !== 0 ? (
          <div className="row">
            <div className="col">
              <div className="card text-danger m-3">
                <div className="card-body">
                  <p className="card-title">
                    <b>Error</b>
                  </p>
                  <ul>
                    {errors.map((err, idx) => (
                      <li key={`err-${idx}`}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
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
    this.filenameinput.current.value = sanitize(file.name).replace(
      /\.(cteepbd|csv|txt)$/,
      ""
    );
  }

  downloadFile() {
    const { wfactors, cmeta, cdata } = this.props;
    const outfilename =
      sanitize(this.filenameinput.current.value).replace(
        /\.(cteepbd|csv|txt)$/,
        ""
      ) + ".cteepbd";

    const energystring = serialize_components(wfactors, cmeta, cdata);
    const data = new Blob([energystring], { type: "text/plain;charset=utf8;" });
    // create hidden link
    const element = document.createElement("a");
    document.body.appendChild(element);
    element.setAttribute("href", window.URL.createObjectURL(data));
    element.setAttribute("download", outfilename);
    element.style.display = "";
    element.click();
    document.body.removeChild(element);
  }
}

const GlobalVarsControl = connect(
  state => ({
    kexp: state.kexp,
    area: state.area,
    dhw_needs: state.dhw_needs,
    location: state.location,
    cmeta: state.cmeta,
    cdata: state.cdata,
    errors: selectErrors(state),
    wfactors: selectWFactors(state)
  }),
  dispatch => ({
    loadComponents: datastr => dispatch(loadEnergyComponents(datastr)),
    changeKexp: value => dispatch(changeKexp(value)),
    changeArea: value => dispatch(changeArea(value)),
    changeDhw: value => dispatch(changeDhw(value)),
    changeLocation: value => dispatch(changeLocation(value))
  })
)(GlobalVarsControlClass);

export default GlobalVarsControl;
