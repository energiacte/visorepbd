import React from "react";
import { connect } from "react-redux";

import NavBar from "components/NavBar";
import EPChart from "components/EPChart";
import GlobalVarsControl from "components/GlobalVarsControl";
import EnergyComponentEditor from "components/EnergyComponentEditor";
import EnergyComponentsTable from "components/EnergyComponentsTable";
import Footer from "components/Footer";
import ModalContainer from "components/ModalContainer";

import {
  parse_components,
  energy_performance,
  energy_performance_acs_nrb
} from "wasm-cteepbd";

import {
  changeKexp,
  changeArea,
  changeLocation,
  cloneEnergyComponent,
  removeEnergyComponent,
  editEnergyComponent,
  selectEnergyComponent,
  loadEnergyComponents,
  changeCurrentFileName
} from "actions/actions.js";

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
      storedcomponent,
      dispatch
    } = this.props;

    const results = this.computeEnergyResults();

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
              <EPChart data={results} kexp={kexp} />
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
    // TODO: preserve RED1, RED2 and COGEN values
    const m_Area_ref = cmeta.find(c => c.key === "CTE_AREAREF");
    const m_kexp = cmeta.find(c => c.key === "CTE_KEXP");
    const m_location = cmeta.find(c => c.key === "CTE_LOCALIZACION");
    const { dispatch, kexp, area, location } = this.props;
    // Localizaciones válidas para CTE
    const CTE_LOCS = ["PENINSULA", "BALEARES", "CANARIAS", "CEUTAMELILLA"];

    dispatch(loadEnergyComponents({ cmeta, cdata: newcdata }));
    dispatch(
      changeArea(
        m_Area_ref && !isNaN(m_Area_ref.value) ? m_Area_ref.value : area
      )
    );
    dispatch(changeKexp(m_kexp && !isNaN(m_kexp.value) ? m_kexp.value : kexp));
    dispatch(
      changeLocation(
        m_location && CTE_LOCS.includes(m_location.value)
          ? m_location.value
          : location
      )
    );
  }

  downloadCarriers() {
    const { kexp, area, location, components } = this.props;
    const { cmeta, cdata } = components;
    // remove active key
    const newcdata = cdata.filter(e => e.active); //.map(({ active, ...rest }) => rest);

    // Actualiza objeto de metadatos con nuevo valor o inserta si no existe
    function updatemeta(metaobj, key, value) {
      const match = metaobj.find(c => c.key === key);
      if (match) {
        match.value = value;
      } else {
        metaobj.push({ key, value });
      }
      return metaobj;
    }

    [
      { key: "App", value: "VisorEPBD_1.0" },
      { key: "CTE_AREAREF", value: area },
      { key: "CTE_KEXP", value: kexp },
      { key: "CTE_LOCALIZACION", value: location }
    ].map(m => updatemeta(cmeta, m.key, m.value));

    // Convert components (carrier data with metadata) to string
    function serialize_components(components) {
      // Serialize basic types to string
      const cmetas = components.cmeta.map(mm => `#META ${mm.key}: ${mm.value}`);
      const carriers = components.cdata.map(
        cc =>
          `${cc.carrier}, ${cc.ctype}, ${cc.csubtype}, ${
            cc.service
          }, ${cc.values.map(v => v.toFixed(2)).join(",")}${
            cc.comment !== "" ? " # " + cc.comment : ""
          }`
      );
      return [...cmetas, ...carriers].join("\n");
    }

    return serialize_components({ cdata: newcdata, cmeta });
  }

  computeEnergyResults() {
    const { kexp, area, components, wfactors } = this.props;
    const componentsobj = {
      cmeta: components.cmeta,
      cdata: components.cdata.filter(c => c.active)
    };
    // Cálculo global
    const ep = energy_performance(componentsobj, wfactors, kexp, area);
    const { ren, nren } = ep.balance_m2.B;
    const total = ren + nren;
    const rer = total === 0 ? 0 : ren / total;
    // Cálculo para ACS en perímetro próximo
    const res_acs_nrb = energy_performance_acs_nrb(
      componentsobj,
      wfactors,
      kexp,
      area
    );
    const { ren: ren_acs, nren: nren_acs } = res_acs_nrb.balance_m2.B;
    const total_acs = ren_acs + nren_acs;
    const rer_acs_nrb = total_acs === 0 ? 0 : ren_acs / total_acs;
    // Actualización
    return { ren, nren, total, rer, rer_acs_nrb };
  }
}

const MainPage = connect(state => {
  return {
    kexp: state.kexp,
    area: state.area,
    location: state.location,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    wfactors: state.wfactors,
    components: state.components,
    currentfilename: state.currentfilename
  };
})(MainPageClass);

export default MainPage;
