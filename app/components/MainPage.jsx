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

// Serialize energy components (carrier data with metadata) to string
function serialize_components(state) {
  const { components, wfactors_co2, wfactors_ep } = state;
  const { cmeta, cdata } = components;

  // Serializar metadatos generales
  let cmetalines = cmeta.map(mm => `#META ${mm.key}: ${mm.value}`);

  // Metadatos de factores de paso de usuario
  // Energía primaria --------------------
  const red1 = wfactors_ep.wdata.find(f => f.carrier === "RED1");
  const red2 = wfactors_ep.wdata.find(f => f.carrier === "RED2");
  const cog = wfactors_ep.wdata.find(
    f => f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A"
  );
  cmetalines.push(`#META CTE_RED1: "${red1.ren}, ${red1.nren}"`);
  cmetalines.push(`#META CTE_RED2: "${red2.ren}, ${red2.nren}"`);
  cmetalines.push(`#META CTE_COGEN: "${cog.ren}, ${cog.nren}"`);
  // Emisiones ---------------------------
  const red1co2 = wfactors_co2.wdata.find(f => f.carrier === "RED1");
  const red2co2 = wfactors_co2.wdata.find(f => f.carrier === "RED2");
  const cogco2 = wfactors_co2.wdata.find(
    f => f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A"
  );
  cmetalines.push(`#META CTE_RED1_CO2: "${red1co2.ren}, ${red1co2.nren}"`);
  cmetalines.push(`#META CTE_RED2_CO2: "${red2co2.ren}, ${red2co2.nren}"`);
  cmetalines.push(`#META CTE_COGEN_CO2: "${cogco2.ren}, ${cogco2.nren}"`);

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
    this.state = { showEditWindow: false }; // Mostrar ventana modal de edición
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
      const { ren, nren } = balance.ep.balance_m2.B;
      // Cálculo para ACS en perímetro próximo
      const { ren: ren_acs, nren: nren_acs } = balance.ep_acs_nrb.balance_m2.B;
      // Emisiones
      const co2 = balance.co2.balance_m2.B.nren;
      data = { kexp, ren, nren, ren_acs, nren_acs, co2 };
    }

    return (
      <div>
        <NavBar match={this.props.match} />
        <div className="container-fluid">
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
          <div className="row">
            <div className="col">
              <EPChart {...data} />
            </div>
          </div>
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
    const { wfactors_ep, wfactors_co2, components } = this.props;
    return serialize_components({
      wfactors_ep,
      wfactors_co2,
      components
    });
  }
}

const MainPage = connect(state => {
  return {
    kexp: state.kexp,
    area: state.area,
    location: state.location,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    wfactors_ep: state.wfactors_ep,
    wfactors_co2: state.wfactors_co2,
    components: state.components,
    currentfilename: state.currentfilename,
    balance: state.balance
  };
})(MainPageClass);

export default MainPage;
