import React from 'react';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import mfomlogo from 'img/logomfom.png';
import ietcclogo from 'img/logoietcccsic.png';

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
            <p className="lead">Créditos</p>
            <p>
              Este programa está desarrollado por el <b><a href="http://www.ietcc.csic.es">Instituto Eduardo Torroja de Ciencias de la Construcción (IETcc-CSIC)</a></b> en el marco del convenio suscrito con el <b><a href="http://www.fomento.gob.es">Ministerio de Fomento</a></b>.
            </p>
            <div className="clearfix">
              <a href="http://www.fomento.gob.es">

                <img className="img-responsive col-xs-offset-3 col-xs-3" src={ mfomlogo } />
              </a>
              <a href="http://www.ietcc.csic.es">
                <img className="img-responsive col-xs-3" src={ ietcclogo } />
              </a>
            </div>
            <p>Equipo de desarrollo (IETcc-CSIC):</p>
            <ul>
              <li>Rafael Villar Burke, <i>pachi@ietcc.csic.es</i></li>
              <li>Daniel Jiménez González, <i>danielj@ietcc.csic.es</i></li>
              <li>Marta Sorribes Gil, <i>msorribes@ietcc.csic.es</i></li>
            </ul>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
});
