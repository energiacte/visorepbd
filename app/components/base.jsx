import uuid from 'node-uuid';
import React from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Navigation from 'components/navigation.jsx';
import Components from 'components/Components';

class Base extends React.Component {
  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <PageHeader>{this.props.headertitle}</PageHeader>
          <div className="page">
            <p className="lead">Aplicación de prueba de ISO 52000-1.</p>
            <p>Seleccione los componentes de energía consumida y producida:</p>
          </div>
          <Components />
        </div>
      </div>
    );
  }
}

export default Base;
