import React from 'react';

import PageHeader from 'react-bootstrap/lib/PageHeader';

import Navigation from 'components/Navigation.jsx';
import { ComponentList, ComponentEdit } from 'components/ComponentList';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <PageHeader>CTE DB-HE, aplicación de ISO 52000-1</PageHeader>
          <p className="lead">Energía suministrada y producida:</p>
          <ComponentEdit />
          <ComponentList />
        </div>
      </div>
    );
  }
}
