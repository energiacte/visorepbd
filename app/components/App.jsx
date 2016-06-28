import React from 'react';

import Navigation from 'components/Navigation';
import ChartsContainer from 'components/ChartsContainer';
import GlobalVarsControl from 'components/GlobalVarsControl';
import EnergyComponentEditor from 'components/EnergyComponentEditor';
import EnergyComponentList from 'components/EnergyComponentList';
import Footer from 'components/Footer';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <ChartsContainer width="100%" height="200px" />
          <GlobalVarsControl />
          <EnergyComponentEditor />
          <EnergyComponentList />
        </div>
        <Footer />
      </div>
    );
  }
}
