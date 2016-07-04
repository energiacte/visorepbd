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
            <h1>CTE DB-HE, aplicación de ISO 52000-1</h1>
          </div>
          <p className="lead">Evaluación de indicadores de la ISO 52000-1 para su aplicación en el CTE DB-HE.</p>
          <p>Este programa presenta una interfaz web a la aplicación <a href="https://github.com/pachi/epbdcalc">epbdcalc</a>.</p>
          <p>Equipo de desarrollo (IETcc-CSIC):</p>
          <ul>
            <li>Rafael Villar Burke</li>
            <li>Daniel Jiménez González</li>
            <li>Marta Sorribes Gil</li>
          </ul>
          <div>
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
          </div>
        </div>
        <Footer />
      </div>
    );
  }
});
