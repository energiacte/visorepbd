import React from "react";
import { connect } from "react-redux";

import NavBar from "components/NavBar";
import EPChart from "components/EPChart";
import GlobalVarsControl from "components/GlobalVarsControl";
import EnergyComponentEditor from "components/EnergyComponentEditor";
import EnergyComponentList from "components/EnergyComponentList";
import Footer from "components/Footer";
import ModalContainer from "components/ModalContainer";

import { serialize_components, cte } from "epbdjs";
const { parse_components, updatemeta, CTE_LOCS } = cte;

import {
  changeKexp,
  changeArea,
  changeLocalizacion,
  cloneEnergyComponent,
  removeEnergyComponent,
  editEnergyComponent,
  selectEnergyComponent,
  loadEnergyComponents,
  changeCurrentFileName,
  computeEnergy
} from "actions/actions.js";

class MainPageClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
    // Carga datos desde API al inicializar
    this.props.dispatch(computeEnergy()); // nuevo
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    const {
      kexp,
      area,
      selectedkey,
      components,
      storedcomponent,
      data,
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
                  dispatch(computeEnergy());
                }}
                onChangeArea={value => {
                  dispatch(changeArea(value));
                  dispatch(computeEnergy());
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
              <EPChart data={data} kexp={kexp} />
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
                  onClick={() => this.toggleModal()}
                >
                  <span className="fa fa-edit" /> Editar
                </button>
              </div>
            </div>
            <ModalContainer
              show={this.state.showModal}
              onClose={() => this.toggleModal()}
            >
              <EnergyComponentEditor
                selectedkey={selectedkey}
                cdata={components.cdata}
                storedcomponent={storedcomponent}
                onEdit={(key, component) => {
                  dispatch(editEnergyComponent(key, component));
                  dispatch(computeEnergy());
                }}
              />
            </ModalContainer>
          </div>
          <div className="row">
            <div className="col">
              <EnergyComponentList
                selectedkey={selectedkey}
                cdata={components.cdata}
                area={area}
                onSelect={(key, component) =>
                  dispatch(selectEnergyComponent(key, component))
                }
                onEdit={(key, component) => {
                  dispatch(editEnergyComponent(key, component));
                  dispatch(computeEnergy());
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
    const m_localizacion = cmeta.find(c => c.key === "CTE_LOCALIZACION");
    const { dispatch, kexp, area, localizacion } = this.props;
    dispatch(loadEnergyComponents({ cmeta, cdata: newcdata }));
    dispatch(
      changeArea(
        m_Area_ref && !isNaN(m_Area_ref.value) ? m_Area_ref.value : area
      )
    );
    dispatch(changeKexp(m_kexp && !isNaN(m_kexp.value) ? m_kexp.value : kexp));
    dispatch(
      changeLocalizacion(
        m_localizacion && CTE_LOCS.includes(m_localizacion.value)
          ? m_localizacion.value
          : localizacion
      )
    );
    dispatch(computeEnergy());
  }

  downloadCarriers() {
    const { kexp, area, localizacion, components } = this.props;
    const { cmeta, cdata } = components;
    // remove active key
    const newcdata = cdata.filter(e => e.active); //.map(({ active, ...rest }) => rest);
    [
      { key: "App", value: "VisorEPBD_1.0" },
      { key: "CTE_AREAREF", value: area },
      { key: "CTE_KEXP", value: kexp },
      { key: "CTE_LOCALIZACION", value: localizacion }
    ].map(m => updatemeta(cmeta, m.key, m.value));
    return serialize_components({ cdata: newcdata, cmeta });
  }
}

const MainPage = connect(state => {
  return {
    kexp: state.kexp,
    area: state.area,
    localizacion: state.localizacion,
    data: state.data,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    wfactors: state.wfactors,
    components: state.components,
    currentfilename: state.currentfilename
  };
})(MainPageClass);

export default MainPage;
