import React from 'react';

import numeral from 'numeral';
import $ from 'jquery';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import mfomlogo from 'img/logomfom.png';
import ietcclogo from 'img/logoietcccsic.png';

export default class WeightingFactorsPage extends React.Component {
  constructor() {
    super();
    this.state = {wfactors: []};
  }

  componentDidMount = () => {
    $.ajax({
      url: 'http://' + document.location.host + __EPBDURLPREFIX__ + '/api/wfactors',
      dataType: 'json',
      cache: false})
     .done(data => { this.setState({ wfactors: data.wfactors }); })
     .fail((xhr, status, err) => { console.error(xhr.status + ':' + xhr.responseText + ':' + err); });
  }

  render() {
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
              { this.state.wfactors.map( entry => {
                  const [carrier, origin, use, step, fpren, fpnren] = entry;
                  return (<tr>
              <td>{ carrier }</td>
              <td>{ origin }</td>
              <td>{ use }</td>
              <td>{ step }</td>
              <td>{ numeral(fpren).format('0.000') }</td>
              <td>{ numeral(fpnren).format('0.000') }</td>
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
