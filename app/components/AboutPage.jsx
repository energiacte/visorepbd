import React from "react";

import NavBar from "components/NavBar";
import Footer from "components/Footer";
import mfomlogo from "img/logomfom.svg";
import ietcclogo from "img/logoietcccsic.png";
import pachi from "img/equipo/FotoPachi.jpg";
import dani from "img/equipo/FotoDani.jpg";
import marta from "img/equipo/FotoMarta.jpg";

// Página de créditos de la aplicación
const AboutPage = props => (
  <div>
    <NavBar match={props.match} />
    <div className="container-fluid">
      <h1>VisorEPBD</h1>
      <p>
        Herramienta de análisis y diseño para la evaluación de la eficiencia
        energética de edificios y aplicación del Documento Básico de Ahorro de
        Energía (DB-HE) del Código Técnico de la Edificación (CTE) mediante el
        procedimiento de la norma ISO UNE-EN 52000-1.
      </p>
      <h3>Equipo de desarrollo (IETcc-CSIC):</h3>
      <div className="row">
        <div className="col-2 offset-2">
          <img className="img-fluid" alt="Rafael Villar Burke" src={pachi} />
          <p>
            Rafael Villar Burke, <i>pachi@ietcc.csic.es</i>
          </p>
        </div>
        <div className="col-2">
          <img className="img-fluid" alt="Daniel Jiménez González" src={dani} />
          <p>
            Daniel Jiménez González, <i>danielj@ietcc.csic.es</i>
          </p>
        </div>
        <div className="col-2">
          <img className="img-fluid" alt="Marta Sorribes Gil" src={marta} />
          <p>
            Marta Sorribes Gil, <i>msorribes@ietcc.csic.es</i>
          </p>
        </div>
      </div>
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
          <a href="http://www.mitma.gob.es">Ministerio de Transportes, Movilidad y Agenda Urbana</a>
        </b>
        .
      </p>
      {/* <div className="container-fluid"> */}
      <div className="container-fluid">
        <a href="http://www.mitma.gob.es">
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
