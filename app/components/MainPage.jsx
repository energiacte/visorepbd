import React from 'react';
import { connect } from 'react-redux';

import NavBar from 'components/NavBar';
import ChartsContainer from 'components/ChartsContainer';
import GlobalVarsControl from 'components/GlobalVarsControl';
import EnergyComponentEditor from 'components/EnergyComponentEditor';
import EnergyComponentList from 'components/EnergyComponentList';
import Footer from 'components/Footer';

import { carrier_list_to_string, string_to_carrier_list } from '../energycalculations.js';
import { carrier_isvalid } from '../cteepbd.js';

import { changeKexp,
         changeArea,
         addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         selectEnergyComponent,
         loadEnergyComponents,
         changeCurrentFileName,
         computeEnergy } from 'actions/actions.js';

class MainPage extends React.Component {

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
        <NavBar route={ this.props.route } />
        <div className="container">
          <ChartsContainer
              width="100%" height="200px"
              kexp={ kexp }
              data={ data }
          />
          <GlobalVarsControl
              kexp={ kexp }
              area={ area }
              onChangeKexp={ value => dispatch(changeKexp(value)) }
              onChangeArea={ value => dispatch(changeArea(value)) }
              onCarriersLoad={ d => this.carriersLoadHandler(d) }
              onCarriersDownload={ () => this.carriersDownloadHandler() }
              onChangeCurrentFileName={ newname => dispatch(changeCurrentFileName(newname)) }
              currentfilename={ this.props.currentfilename }
          />
          <EnergyComponentEditor
              selectedkey = { selectedkey }
              components = { components }
              storedcomponent = { storedcomponent }
              onEdit={ (key, component) => dispatch(editEnergyComponent(key, component)) }
          />
          <EnergyComponentList
              selectedkey = { selectedkey }
              components = { components }
              area ={ area }
              onSelect={ (key, component) => dispatch(selectEnergyComponent(key, component)) }
              onEdit={ (key, component) => dispatch(editEnergyComponent(key, component)) }
              onAdd={ component => dispatch(addEnergyComponent(component)) }
              onRemove={ key => dispatch(removeEnergyComponent(key)) }
          />
        </div>
        <Footer />
      </div>
    );
  }

  carriersLoadHandler(datastr) {
    const data = string_to_carrier_list(datastr);
    const components = data
      .filter(c => c.type === 'CARRIER')
      .filter(c => carrier_isvalid(c))
      .map(dd => ({ ...dd, active: true }));
    // TODO: preserve metadata roundtrip
    const meta = data.filter(c => c.type === 'META');
    const m_Area_ref = meta.find(c => c.key === 'Area_ref');
    const m_kexp = meta.find(c => c.key === 'kexp');

    const { dispatch, kexp, area } = this.props;
    dispatch(loadEnergyComponents(components));
    dispatch(changeArea(m_Area_ref ? m_Area_ref.value : area));
    dispatch(changeKexp(m_kexp ? m_kexp.value : kexp));
  }

  carriersDownloadHandler() {
    const { kexp, area, components } = this.props;
    const activecomponents = components
      .filter(e => e.active === true)
      .map(({ active, ...rest }) => rest); // remove active key

    // TODO: this doesn't preserve previous existing metadata
    const metalines = [
      { type: 'META', key: 'App', value: 'VisorEPBD_1.0' },
      { type: 'META', key: 'Area_ref', value: area },
      { type: 'META', key: 'kexp', value: kexp }
    ];
    return carrier_list_to_string([...activecomponents, ...metalines]);
  }
}

export default MainPage = connect(state => {
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
})(MainPage);
