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
  const { kexp, area, location, wfactors_ep, components } = state;
  const { cmeta, cdata } = components;


  let appmeta = [
    ({ key: "App", value: "VisorEPBD_1.0" },
    { key: "CTE_AREAREF", value: area },
    { key: "CTE_KEXP", value: kexp },
    { key: "CTE_LOCALIZACION", value: location })
    // TODO: store wfactors (RED1, RED2, COGEN...)
  ];

  appmeta.map(({ key, value }) => {
    const match = cmeta.find(c => c.key === key);
    if (match) {
      match.value = `${value}`;
    } else {
      cmeta.push({ key, value: `${value}` });
    }
    return cmeta;
  });

  const cmetalines = cmeta.map(mm => `#META ${mm.key}: ${mm.value}`);

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
              <EPChart balance={balance} kexp={kexp} />
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
    const { cdata, cmeta } = parse_components(datastr);
    const newcdata = cdata.map(dd => ({ ...dd, active: true }));
    this.props.dispatch(loadEnergyComponents({ cmeta, cdata: newcdata }));
  }

  downloadCarriers() {
    const { kexp, area, location, wfactors_ep, components } = this.props;
    return serialize_components({ kexp, area, location, wfactors_ep, components });
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
    components: state.components,
    currentfilename: state.currentfilename,
    balance: state.balance
  };
})(MainPageClass);

export default MainPage;
