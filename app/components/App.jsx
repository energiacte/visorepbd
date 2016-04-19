import React from 'react';

import Navigation from 'components/Navigation.jsx';
import EnergyComponentList from 'components/EnergyComponentList';
import EnergyComponentEditor from 'components/EnergyComponentEditor';
import IndicatorsChart from 'components/IndicatorsChart';

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
      </div>
    );
  }
}
