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
          <div className="page-header">
            <h1>CTE DB-HE, aplicación de ISO 52000-1</h1>
          </div>

          <IndicatorsChart width="50%" height="200" />

          <div id="results">
            Resultados
          </div>

          <div className="panel panel-primary">
            <div className="panel-heading">Entrada de datos</div>
            <div className="panel-body">
              <div className="panel panel-default">
                <div className="panel-body bg-info">
                  <EnergyComponentEditor />
                </div>
                <EnergyComponentList />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
