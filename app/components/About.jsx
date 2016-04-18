import React from 'react';

import Navigation from 'components/Navigation.jsx';

export default React.createClass({

  render() {
    return (
      <div>
        <Navigation projectName="DB-HE NZEB" />
        <div className="container">
          <div className="page-header">
            <h1>CTE DB-HE, aplicación de ISO 52000-1</h1>
          </div>
          <p className="lead">Evaluación de indicadores de la ISO 52000-1 para su aplicación en el CTE DB-HE.</p>
        </div>
      </div>
    );
  }
});
