import React from 'react';

import PageHeader from 'react-bootstrap/lib/PageHeader';
import Panel from 'react-bootstrap/lib/Panel';

import Navigation from 'components/Navigation.jsx';
import { ComponentList, ComponentEditor } from 'components/ComponentList';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <PageHeader>CTE DB-HE, aplicación de ISO 52000-1</PageHeader>
          <p className="lead">Energía suministrada y producida:</p>

          <Panel bsStyle="primary"
                 header="Energía suministrada o producida en el edificio">

            <div id="results">
              Resultados
            </div>

            <Panel header="Entrada de datos">
              <ComponentEditor />
              <ComponentList />
            </Panel>

          </Panel>

        </div>
      </div>
    );
  }
}
