import React from "react";
import { connect } from "react-redux";

import NavBar from "components/NavBar";
import EPChart from "components/EPChart";
import GlobalVarsControl from "components/GlobalVarsControl";
import EnergyComponentEditor from "components/EnergyComponentEditor";
import EnergyComponentsTable from "components/EnergyComponentsTable";
import Footer from "components/Footer";
import ModalContainer from "components/ModalContainer";

import { parse_components } from "wasm-cteepbd";

import {
  changeKexp,
  changeArea,
  cloneEnergyComponent,
  removeEnergyComponent,
  editEnergyComponent,
  selectEnergyComponent,
  loadEnergyComponents,
  changeCurrentFileName
} from "actions/actions.js";

import { selectBalance } from "reducers/reducers.js";

// Serialize energy components (carrier data with metadata) to string
function serialize_components(wfactors, components) {
  const { cmeta, cdata } = components;

  // Serializar metadatos generales
  let cmetalines = cmeta.map(mm => `#META ${mm.key}: ${mm.value}`);

  // Metadatos de factores de paso de usuario
  const red1 = wfactors.wdata.find(f => f.carrier === "RED1");
  const red2 = wfactors.wdata.find(f => f.carrier === "RED2");
  const cog = wfactors.wdata.find(
    f => f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A"
  );
  const cognepb = wfactors.wdata.find(
    f => f.source === "COGENERACION" && f.dest === "A_NEPB" && f.step === "A"
  ) || cog;
  cmetalines.push(`#META CTE_RED1: "${red1.ren}, ${red1.nren}"`);
  cmetalines.push(`#META CTE_RED2: "${red2.ren}, ${red2.nren}"`);
  cmetalines.push(`#META CTE_COGEN: "${cog.ren}, ${cog.nren}"`);
  cmetalines.push(`#META CTE_COGENNEPB: "${cognepb.ren}, ${cognepb.nren}"`);

  // Serializar componentes energéticos
  const cdatalines = cdata
    .filter(e => e.active)
    .map(
      cc =>
        `${cc.carrier}, ${cc.ctype}, ${cc.csubtype}, ${
          cc.service
        }, ${cc.values.map(v => v.toFixed(2)).join(",")}${
          cc.comment !== "" ? " # " + cc.comment : ""
        }`
    );
  return [...cmetalines, ...cdatalines].join("\n");
}

// Página principal de la aplicación
class MainPageClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showEditWindow: false, showDetails: false }; // Mostrar ventana modal de edición
  }

  toggleEditWindow() {
    this.setState({ showEditWindow: !this.state.showEditWindow });
  }

  render() {
    const {
      kexp,
      area,
      selectedkey,
      components,
      balance,
      storedcomponent,
      dispatch
    } = this.props;

    // Indicadores que se van a representar ------------------
    let data = {};
    if (balance) {
      // Energía primaria
      const { ren, nren, co2 } = balance.ep.balance_m2.B;
      // Cálculo para ACS en perímetro próximo
      const { ren: ren_acs, nren: nren_acs } = balance.ep_acs_nrb.balance_m2.B;
      // Datos agrupados
      data = { kexp, ren, nren, co2, ren_acs, nren_acs };
    }

    return (
      <div>
        <NavBar match={this.props.match} />
        <div className="container-fluid">
          {/* Panel de variables globales */}
          <div className="row">
            <div className="col">
              <GlobalVarsControl
                kexp={kexp}
                area={area}
                onChangeKexp={value => {
                  dispatch(changeKexp(value));
                }}
                onChangeArea={value => {
                  dispatch(changeArea(value));
                }}
                onCarriersLoad={d => this.uploadCarriers(d)}
                onCarriersDownload={() => this.downloadCarriers()}
                onChangeCurrentFileName={newname =>
                  dispatch(changeCurrentFileName(newname))
                }
                currentfilename={this.props.currentfilename}
              />
            </div>
          </div>
          {/* Gráfica de resultados */}
          <div className="row">
            <div className="col">
              <EPChart {...data} />
            </div>
          </div>
          {/* Muestra detalles */}
          <div className="row">
            <div className="col">
              <input
                id="checkDetails1"
                className=""
                type="checkbox"
                {...(this.state.showDetails ? {} : {active:"active"})}
                onChange={_ =>
                  this.setState({ showDetails: !this.state.showDetails })
                }
              />{" "}
              <label className="" htmlFor="checkDetails1">
                Ver detalles
              </label>
            </div>
          </div>
          {this.state.showDetails ? (
            <div className="row">
              <div className="col-lg-6">
                <h2>Energía primaria y emisiones:</h2>
                <pre>{JSON.stringify(balance.ep, undefined, 2)}</pre>
              </div>
              <div className="col-lg-6">
                <h2>Energía primaria y emisiones para ACS en perímetro próximo:</h2>
                <pre>{JSON.stringify(balance.ep_acs_nrb, undefined, 2)}</pre>
              </div>
            </div>
          ) : null}
          {/* Acciones de edición de componentes */}
          <div className="row">
            <div className="col float-right">
              <div
                className="btn-group float-right btn-group-xs"
                role="group"
                aria-label="acciones"
              >
                <button
                  className="btn"
                  id="add"
                  type="button"
                  onClick={() => dispatch(cloneEnergyComponent(selectedkey))}
                >
                  <span className="fa fa-plus" /> Añadir
                </button>
                <button
                  className="btn"
                  id="remove"
                  type="button"
                  onClick={() => dispatch(removeEnergyComponent(selectedkey))}
                >
                  <span className="fa fa-minus" /> Borrar
                </button>
                <button
                  className="btn"
                  id="edit"
                  type="button"
                  onClick={() => this.toggleEditWindow()}
                >
                  <span className="fa fa-edit" /> Editar
                </button>
              </div>
            </div>
            {/* Ventana modal de edición de componente */}
            <ModalContainer
              show={this.state.showEditWindow}
              onClose={() => this.toggleEditWindow()}
            >
              <EnergyComponentEditor
                selectedkey={selectedkey}
                cdata={components.cdata}
                storedcomponent={storedcomponent}
                onEdit={(key, component) => {
                  dispatch(editEnergyComponent(key, component));
                }}
              />
            </ModalContainer>
          </div>
          {/* Tabla de componentes */}
          <div className="row">
            <div className="col">
              <EnergyComponentsTable
                selectedkey={selectedkey}
                cdata={components.cdata}
                area={area}
                onSelect={(key, component) =>
                  dispatch(selectEnergyComponent(key, component))
                }
                onEdit={(key, component) => {
                  dispatch(editEnergyComponent(key, component));
                }}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  uploadCarriers(datastr) {
    // TODO: convertir a una acción loadComponentsFromString y luego setStateFromComponentsMeta
    const { cdata, cmeta } = parse_components(datastr);
    const newcdata = cdata.map(dd => ({ ...dd, active: true }));
    this.props.dispatch(loadEnergyComponents({ cmeta, cdata: newcdata }));
  }

  downloadCarriers() {
    const { wfactors, components } = this.props;
    return serialize_components(wfactors, components);
  }
}

const MainPage = connect(state => {
  const balance = selectBalance(state);
  return {
    kexp: state.kexp,
    area: state.area,
    location: state.location,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    wfactors: state.wfactors,
    components: state.components,
    currentfilename: state.currentfilename,
    balance // selector
  };
})(MainPageClass);

export default MainPage;
