import React from 'react';
import { connect } from 'react-redux';

import NavBar from 'components/NavBar';
import ChartsContainer from 'components/ChartsContainer';
import GlobalVarsControl from 'components/GlobalVarsControl';
import EnergyComponentEditor from 'components/EnergyComponentEditor';
import EnergyComponentList from 'components/EnergyComponentList';
import Footer from 'components/Footer';

import { carrier_data_to_string, string_to_carrier_data } from '../energycalculations.js';

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
              onChangeArea={ value => dispatch(changeArea(value)) } />
          <EnergyComponentEditor
              selectedkey = { selectedkey }
              components = { components }
              storedcomponent = { storedcomponent }
              onAdd={ component => dispatch(addEnergyComponent(component)) }
              onRemove={ key => dispatch(removeEnergyComponent(key)) }
              onEdit={ (key, component) => dispatch(editEnergyComponent(key, component)) }
              onLoad={ d => this.onLoad(d) }
              onChangeCurrentFileName={ newname => dispatch(changeCurrentFileName(newname)) }
              currentfilename={ this.props.currentfilename }
              getEnergyString={ () => this.getEnergyString() }
          />
          <EnergyComponentList
              selectedkey = { selectedkey }
              components = { components }
              area ={ area }
              onSelect={ (key, component) => dispatch(selectEnergyComponent(key, component)) }
              onEdit={ (key, component) => dispatch(editEnergyComponent(key, component)) } />
        </div>
        <Footer />
      </div>
    );
  }

  onLoad(datastr) {
    let { components, meta } = string_to_carrier_data(datastr);
    components = components.map(dd => { return { ...dd, active: true }; });

    const { dispatch, kexp, area } = this.props;
    dispatch(loadEnergyComponents(components));
    dispatch(changeArea(meta.Area_ref || area));
    dispatch(changeKexp(meta.kexp || kexp));
  }

  getEnergyString() {
    const { kexp, area, components } = this.props;
    const meta = { area, kexp };
    const activecomponents = components.filter(e => e.active === true);
    return carrier_data_to_string(activecomponents, meta);
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
