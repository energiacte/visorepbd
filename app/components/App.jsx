import React from 'react';
import { connect } from 'react-redux';

import Navigation from 'components/Navigation';
import ChartsContainer from 'components/ChartsContainer';
import GlobalVarsControl from 'components/GlobalVarsControl';
import EnergyComponentEditor from 'components/EnergyComponentEditor';
import EnergyComponentList from 'components/EnergyComponentList';
import Footer from 'components/Footer';

import { addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         fetchData } from 'actions/actions.js';

class App extends React.Component {

  // Carga datos desde API al inicializar
  componentWillMount() { this.props.dispatch(fetchData()); }

  // Carga datos desde API al cambiar las propiedades (y antes de renderizar hijos)
  componentWillReceiveProps(nextProps) { this.props.dispatch(fetchData()); }

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <ChartsContainer width="100%" height="200px" />
          <GlobalVarsControl />
          <EnergyComponentEditor
              selectedkey = { this.props.selectedkey }
              components = { this.props.components }
              storedcomponent = { this.props.storedcomponent }
              onAdd={ component => { this.props.dispatch(addEnergyComponent(component))} }
              onRemove={ key => { this.props.dispatch(removeEnergyComponent(key))} }
              onEdit={ (key, component) => { this.props.dispatch(editEnergyComponent(key, component)) } } />
          <EnergyComponentList />
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
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    components: state.components
  };
})(App);
