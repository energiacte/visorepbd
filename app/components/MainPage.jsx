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

import { selectBalance, selectWFactors } from "reducers/reducers";

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
      wfactors,
      cmeta,
      cdata,
      selectedkey,
      balance,
      storedcomponent
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
                onChangeKexp={value => this.props.changeKexp(value)}
                onChangeArea={value => this.props.changeArea(value)}
                onCarriersLoad={datastr => this.props.loadComponents(datastr)}
                onCarriersDownload={() => serialize_components(wfactors, cmeta, cdata)}
                onChangeCurrentFileName={newname =>
                  this.props.changeCurrentFileName(newname)
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
            <div className="row" style={{ height: "250px", overflow: "auto" }}>
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
                  onClick={() => this.props.cloneEnergyComponent(selectedkey)}
                >
                  <span className="fa fa-plus" /> Añadir
                </button>
                <button
                  className="btn"
                  id="remove"
                  type="button"
                  onClick={() => this.props.removeEnergyComponent(selectedkey)}
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
                cdata={cdata}
                storedcomponent={storedcomponent}
                onEdit={(key, component) =>
                  this.props.editEnergyComponent(key, component)
                }
              />
            </ModalContainer>
          </div>
          {/* Tabla de componentes */}
          <div className="row">
            <div className="col">
              <EnergyComponentsTable
                selectedkey={selectedkey}
                cdata={cdata}
                area={area}
                onSelect={(key, component) =>
                  this.props.selectEnergyComponent(key, component)
                }
                onEdit={(key, component) =>
                  this.props.editEnergyComponent(key, component)
                }
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const MainPage = connect(
  state => ({
    kexp: state.kexp,
    area: state.area,
    location: state.location,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    cmeta: state.cmeta,
    cdata: state.cdata,
    currentfilename: state.currentfilename,
    wfactors: selectWFactors(state),
    balance: selectBalance(state)
  }),
  dispatch => ({
    loadComponents: datastr => dispatch(loadEnergyComponents(datastr)),
    selectEnergyComponent: (key, component) =>
      dispatch(selectEnergyComponent(key, component)),
    editEnergyComponent: (key, component) =>
      dispatch(editEnergyComponent(key, component)),
    cloneEnergyComponent: selectedkey =>
      dispatch(cloneEnergyComponent(selectedkey)),
    removeEnergyComponent: selectedkey =>
      dispatch(removeEnergyComponent(selectedkey)),
    changeCurrentFileName: newname => dispatch(changeCurrentFileName(newname)),
    changeKexp: value => dispatch(changeKexp(value)),
    changeArea: value => dispatch(changeArea(value))
  })
)(MainPageClass);

export default MainPage;
