import React from 'react';
import { connect } from 'react-redux';

import Navigation from 'components/Navigation';
import ChartsContainer from 'components/ChartsContainer';
import GlobalVarsControl from 'components/GlobalVarsControl';
import EnergyComponentEditor from 'components/EnergyComponentEditor';
import EnergyComponentList from 'components/EnergyComponentList';
import Footer from 'components/Footer';

import { changeKexp,
         changeKrdel,
         changeArea,
         addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         selectEnergyComponent,
         loadEnergyComponents,
         fetchData } from 'actions/actions.js';

class App extends React.Component {

  // Carga datos desde API al inicializar
  componentWillMount() { this.props.dispatch(fetchData()); }

  // Carga datos desde API al cambiar las propiedades (y antes de renderizar hijos)
  componentWillReceiveProps(nextProps) {
    const { kexp, krdel, area, components } = this.props;
    const np = nextProps;
    if ((kexp !== np.kexp) || (krdel !== np.krdel) || (area !== np.area) || (components !== np.components)) {
      this.props.dispatch(fetchData());
    }
  }

  render() {
    const { kexp, krdel, area, selectedkey, components, storedcomponent,
            data, dispatch } = this.props;
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" route={ this.props.route } />
        <div className="container">
          <ChartsContainer
              width="100%" height="200px"
              kexp={ kexp }
              krdel={ krdel }
              data={ data }
          />
          <GlobalVarsControl
              kexp={ kexp }
              krdel={ krdel }
              area={ area }
              onChangeKexp={ value => dispatch(changeKexp(value)) }
              onChangeKrdel={ value => dispatch(changeKrdel(value)) }
              onChangeArea={ value => dispatch(changeArea(value)) } />
          <EnergyComponentEditor
              selectedkey = { selectedkey }
              components = { components }
              storedcomponent = { storedcomponent }
              onAdd={ component => dispatch(addEnergyComponent(component)) }
              onRemove={ key => dispatch(removeEnergyComponent(key)) }
              onEdit={ (key, component) => dispatch(editEnergyComponent(key, component)) }
              onLoad={ textdata => dispatch(loadEnergyComponents(textdata)) } />
          <EnergyComponentList
              selectedkey = { selectedkey }
              components = { components }
              onSelect={ (key, component) => dispatch(selectEnergyComponent(key, component)) }
              onEdit={ (key, component) => dispatch(editEnergyComponent(key, component)) } />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel,
    area: state.area,
    data: state.data,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    components: state.components
  };
})(App);
