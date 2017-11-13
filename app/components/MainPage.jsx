import React from 'react';
import { connect } from 'react-redux';

import NavBar from 'components/NavBar';
import EPChart from 'components/EPChart';
import GlobalVarsControl from 'components/GlobalVarsControl';
import EnergyComponentEditor from 'components/EnergyComponentEditor';
import EnergyComponentList from 'components/EnergyComponentList';
import Footer from 'components/Footer';
import ModalContainer from 'components/ModalContainer';

import { serialize_components, cte } from 'epbdjs';
const { parse_components } = cte;

import { changeKexp,
         changeArea,
         cloneEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         selectEnergyComponent,
         loadEnergyComponents,
         changeCurrentFileName,
         computeEnergy } from 'actions/actions.js';

class MainPageClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  toggleModal() { this.setState({ showModal: !this.state.showModal }) }

  // Carga datos desde API al inicializar
  componentWillMount() { this.props.dispatch(computeEnergy()); }

  // Carga datos desde API al cambiar las propiedades (y antes de renderizar hijos)
  componentWillReceiveProps(nextProps) {
    const { kexp, area, components } = this.props;
    const np = nextProps;
    if ((kexp !== np.kexp) || (area !== np.area) || (components !== np.components)) {
      this.props.dispatch(computeEnergy());
    }
  }

  render() {
    const { kexp, area, selectedkey, components, storedcomponent,
            data, dispatch } = this.props;
    return (
      <div>
        <NavBar match={ this.props.match } />
        <div className="container">
          <div className="row">
            <GlobalVarsControl
              kexp={kexp}
              area={area}
              onChangeKexp={value => dispatch(changeKexp(value))}
              onChangeArea={value => dispatch(changeArea(value))}
              onCarriersLoad={d => this.uploadCarriers(d)}
              onCarriersDownload={() => this.downloadCarriers()}
              onChangeCurrentFileName={newname => dispatch(changeCurrentFileName(newname))}
              currentfilename={this.props.currentfilename}
            />
          </div>
          <div className="row">
            <EPChart data={data} kexp={kexp} />
          </div>
          <div className="row">
            <div className="btn-group pull-right btn-group-xs" role="group" aria-label="acciones">
              <button className="btn" id="add" type="button"
                onClick={() => dispatch(cloneEnergyComponent(selectedkey))}>
                <span className="glyphicon glyphicon-plus" /> Añadir
              </button>
              <button className="btn" id="remove" type="button"
                onClick={() => dispatch(removeEnergyComponent(selectedkey))}>
                <span className="glyphicon glyphicon-minus" /> Borrar
              </button>
              <button className="btn" id="edit" type="button"
                onClick={() => this.toggleModal()}>
                <span className="glyphicon glyphicon-edit" /> Editar
              </button>
            </div>
            <ModalContainer show={this.state.showModal} onClose={() => this.toggleModal()}>
              <EnergyComponentEditor
                selectedkey={selectedkey}
                components={components}
                storedcomponent={storedcomponent}
                onEdit={(key, component) => dispatch(editEnergyComponent(key, component))}
              />
            </ModalContainer>
          </div>
          <div className="row">
            <EnergyComponentList
              selectedkey={selectedkey}
              components={components}
              area={area}
              onSelect={(key, component) => dispatch(selectEnergyComponent(key, component))}
              onEdit={(key, component) => dispatch(editEnergyComponent(key, component))}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  uploadCarriers(datastr) {
    const data = parse_components(datastr);
    const cdata = data.cdata
      .map(dd => ({ ...dd, active: true }));
    // TODO: preserve metadata roundtrip
    const cmeta = data.cmeta;
    const m_Area_ref = cmeta.find(c => c.key === 'CTE_AREAREF');
    const m_kexp = cmeta.find(c => c.key === 'CTE_KEXP');

    const { dispatch, kexp, area } = this.props;
    dispatch(loadEnergyComponents(cdata));
    dispatch(changeArea(m_Area_ref ? m_Area_ref.value : area));
    dispatch(changeKexp(m_kexp ? m_kexp.value : kexp));
  }

  downloadCarriers() {
    const { kexp, area, components } = this.props;
    const activecomponents = components
      .filter(e => e.active === true)
      .map(({ _active, ...rest }) => rest); // remove active key

    // TODO: this doesn't preserve existing metadata
    const metalines = [
      { type: 'META', key: 'App', value: 'VisorEPBD_1.0' },
      { type: 'META', key: 'CTE_AREAREF', value: area },
      { type: 'META', key: 'CTE_KEXP', value: kexp },
      { type: 'META', key: 'CTE_LOCALIZACION', value: ''} //TODO:
    ];
    return serialize_components({ cdata: activecomponents, cmeta: metalines });
  }
}

const MainPage = connect(state => {
  return {
    kexp: state.kexp,
    area: state.area,
    data: state.data,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    wfactors: state.wfactors,
    components: state.components,
    currentfilename: state.currentfilename
  };
})(MainPageClass);

export default MainPage;