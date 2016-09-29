import React from 'react';
import { connect } from 'react-redux';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import mfomlogo from 'img/logomfom.png';
import ietcclogo from 'img/logoietcccsic.png';

class WeightingFactorsPage extends React.Component {

  render() {
    const { wfactors, dispatch } = this.props;

    return (
      <div>
        <NavBar route={ this.props.route } />
        <div className="container">
          <div className="page-header">
            <h1>Factores de ponderación</h1>
            <p>Factores de paso de energía final a energía primaria.</p>
          </div>
          <table id="components" className="table table-striped table-bordered table-condensed">
            <thead>
              <tr>
                <th>Vector energético</th><th>Origen</th>
                <th>Uso</th><th>Paso</th>
                <th>Fp_ren</th>
                <th>Fp_nren</th>
              </tr>
            </thead>
            <tbody>
              { wfactors.map( entry => {
                  const { vector, fuente, uso, step, fren, fnren } = entry;
                  return (<tr key={ `${vector}-${fuente}-${uso}-${step}` }>
              <td>{ vector }</td>
              <td>{ fuente }</td>
              <td>{ uso }</td>
              <td>{ step }</td>
              <td>{ fren.toFixed(3) }</td>
              <td>{ fnren.toFixed(3) }</td>
                  </tr>); })
              }
            </tbody>
          </table>
          <div className="small bg-info">
            <p><b>Notas</b>:</p>
            <p>Origen:</p>
            <ul>
              <li><tt>grid</tt>: red</li>
              <li><tt>INSITU</tt>: producción 'in situ'</li>
              <li><tt>COGENERACION</tt>: red</li>
            </ul>
            <p>Uso:</p>
            <ul>
              <li><tt>input</tt>: sumiministro</li>
              <li><tt>to_grid</tt>: exportación a la red</li>
              <li><tt>to_nEPB</tt>: exportación a usos nEPB</li>
            </ul>
            <p><tt>Fpren</tt>: Factor de paso de energía final a energía primaria renovable</p>
            <p><tt>Fpnren</tt>: Factor de paso de energía final a energía primaria no renovable</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};

export default WeightingFactorsPage = connect(state => {
  return {
    wfactors: state.wfactors
  };
})(WeightingFactorsPage);
