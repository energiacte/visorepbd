import React, { PropTypes } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Navigation from 'components/Navigation.jsx';
import { ComponentList, ComponentEdit } from 'components/ComponentList';

class App extends React.Component {
  render() {
    const { store } = this.context;
    const state = store.getState();

    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <PageHeader>CTE DB-HE, aplicación de ISO 52000-1</PageHeader>
          <p className="lead">Energía suministrada y producida:</p>
          <ComponentList />
          <ComponentEdit />
        </div>
      </div>
    );
  }
}

App.contextTypes = { store: React.PropTypes.object };

export default App;
