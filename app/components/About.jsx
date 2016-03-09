import React from 'react';

import Navigation from 'components/Navigation.jsx';

export default React.createClass({

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <div className="page-header">
            <h1>Créditos:</h1>
          </div>
          <p className="lead">Acerca de...</p>
        </div>
      </div>
    );
  }
})
