import React from "react";
import { connect } from "react-redux";

import NavBar from "components/NavBar";
import EPChart from "components/EPChart";
import GlobalVarsControl from "components/GlobalVarsControl";
import EnergyComponentEditor from "components/EnergyComponentEditor";
import EnergyComponentsTable from "components/EnergyComponentsTable";
import Footer from "components/Footer";
import ModalContainer from "components/ModalContainer";
import DetailsChart from "components/DetailsChart";

import { parse_components } from "wasm-cteepbd";
import { serialize_components } from "utils";

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
    if (balance.ep && balance.ep_acs_nrb) {
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
          {balance.error ? <h1>Ha habido un error!: {balance.error}</h1> : null}
          {balance.ep && balance.ep_acs_nrb ? (
            <div className="row">
              <div className="col">
                <input
                  id="checkDetails1"
                  className=""
                  type="checkbox"
                  {...(this.state.showDetails ? {} : { active: "active" })}
                  onChange={_ =>
                    this.setState({ showDetails: !this.state.showDetails })
                  }
                />{" "}
                <label className="" htmlFor="checkDetails1">
                  Ver detalles
                </label>
              </div>
            </div>
          ) : null}
          {this.state.showDetails && balance.ep && balance.ep_acs_nrb ? (
            <DetailsChart balance={balance.ep} />
          ) : null}
          {this.state.showDetails && balance.ep && balance.ep_acs_nrb ? (
            <div className="row" style={{height: "250px", overflow: "auto"}}>
              <div className="col-lg-6">
                <h2>Energía primaria y emisiones:</h2>
                <pre>{JSON.stringify(balance.ep, undefined, 2)}</pre>
              </div>
              <div className="col-lg-6">
                <h2>
                  Energía primaria y emisiones para ACS en perímetro próximo:
                </h2>
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
    try {
      this.props.dispatch(loadEnergyComponents(parse_components(datastr)));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Se ha producido un error al cargar los datos: ", e);
    }
  }

  downloadCarriers() {
    const {
      wfactors,
      components: { cmeta, cdata }
    } = this.props;
    return serialize_components(wfactors, cmeta, cdata);
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
