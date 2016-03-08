import React from 'react';

import PageHeader from 'react-bootstrap/lib/PageHeader';

import Navigation from 'components/Navigation.jsx';

export default React.createClass({

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <PageHeader>Créditos:</PageHeader>
          <p className="lead">Acerca de...</p>
        </div>
      </div>
    );
  }
})
