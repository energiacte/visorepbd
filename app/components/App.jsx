import React from 'react';

import Navigation from 'components/Navigation';
import EnergyComponentList from 'components/EnergyComponentList';
import EnergyComponentEditor from 'components/EnergyComponentEditor';
import IndicatorsChart from 'components/IndicatorsChart';
import Footer from 'components/Footer';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <IndicatorsChart width="100%" height="200px" />
          <EnergyComponentEditor />
          <EnergyComponentList />
        </div>
        <Footer />
      </div>
    );
  }
}
