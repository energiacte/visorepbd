import React from 'react';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import esquema15603 from 'img/esquema15603.svg';

export default React.createClass({

  render() {
    return (
      <div>
        <NavBar route={ this.props.route } />
        <div className="container">
          <div className="page-header">
            <h1>VisorEPBD</h1>
          </div>
          <div className="row">
            <p className="lead">VisorEPBD es una aplicación para el cálculo de indicadores según la norma EN 15603 (futura EN ISO 52000-1) y su aplicación en el CTE DB-HE. Presenta una interfaz web a la aplicación <a href="https://github.com/pachi/epbdcalc">epbdcalc</a>.</p>
          </div>
          <div className="row">
            <h4>Balance EN 15603 / ISO 52000-1</h4>
            <img className="img-responsive col-xs-8 col-xs-offset-2" src={ esquema15603 } />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
});
