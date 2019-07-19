import React from "react";

import NavBar from "components/NavBar";
import Footer from "components/Footer";
import mfomlogo from "img/logomfom.png";
import ietcclogo from "img/logoietcccsic.png";

// Página de créditos de la aplicación
const AboutPage = props => (
  <div>
    <NavBar match={props.match} />
    <div className="container-fluid">
      <h1>VisorEPBD</h1>
      <h3>Equipo de desarrollo (IETcc-CSIC):</h3>
      <ul>
        <li>
          Rafael Villar Burke, <i>pachi@ietcc.csic.es</i>
        </li>
        <li>
          Daniel Jiménez González, <i>danielj@ietcc.csic.es</i>
        </li>
        <li>
          Marta Sorribes Gil, <i>msorribes@ietcc.csic.es</i>
        </li>
      </ul>
      <h3>Licencia</h3>
      <p>
        <em>VisorEPBD</em> es software libre y se distribuye bajo la licencia{" "}
        <b>MIT</b>, estándo disponible el código en el{" "}
        <a href="https://github.com/energiacte">
          repositorio del equipo de energía CTE DB-HE del IETcc-CSIC
        </a>
        .
      </p>
      <h3>Créditos</h3>
      <p>
        Este programa está desarrollado por el{" "}
        <b>
          <a href="http://www.ietcc.csic.es">
            Instituto Eduardo Torroja de Ciencias de la Construcción
            (IETcc-CSIC)
          </a>
        </b>{" "}
        en el marco del convenio suscrito con el{" "}
        <b>
          <a href="http://www.fomento.gob.es">Ministerio de Fomento</a>
        </b>
        .
      </p>
      {/* <div className="container-fluid"> */}
      <div className="container-fluid">
        <a href="http://www.fomento.gob.es">
          <img className="img offset-md-3 col-md-3" src={mfomlogo} />
        </a>
        <a href="http://www.ietcc.csic.es">
          <img className="img col-md-3" src={ietcclogo} />
        </a>
      </div>
      {/* </div> */}
    </div>
    <Footer />
  </div>
);

export default AboutPage;
