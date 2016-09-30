import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';
import mfomlogo from 'img/logomfom.png';
import ietcclogo from 'img/logoietcccsic.png';

import { editWFactors } from 'actions/actions.js';

class WeightingFactorsPage extends React.Component {

  render() {
    const { wfactors } = this.props;
    const wfactors2 = wfactors.filter(e => !e.vector.startsWith('RED'));
    const red1 = wfactors.filter(e => e.vector === 'RED1')[0];
    const red2 = wfactors.filter(e => e.vector === 'RED2')[0];

    return (
      <div>
        <NavBar route={ this.props.route } />
        <div className="container">
          <div className="page-header">
            <h1>Factores de paso</h1>
            <p>Conversión de energía final a energía primaria renovable y no renovable.</p>
          </div>

          <h3>Factores personalizables</h3>
          <table id="weditor" className="table table-striped table-bordered table-condensed">
            <thead>
              <tr>
                <th>Vector energético</th><th>Origen</th><th>Uso</th><th>Paso</th><th>Fp_ren</th><th>Fp_nren</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RED1</td><td>grid</td><td>input</td><td>A</td>
                <td>
                  <input type="text" ref="red1fren"
                         defaultValue={ red1.fren.toFixed(3) }
                         onChange={ e => this.handleChange('RED1', 'fren', e) }
                  />
                </td>
                <td>
                  <input type="text" ref="red1fnren"
                         defaultValue={ red1.fnren.toFixed(3) }
                         onChange={ e => this.handleChange('RED1', 'fnren', e) }
                  />
                </td>
              </tr>
              <tr>
                <td>RED2</td><td>grid</td><td>input</td><td>A</td>
                <td>
                  <input type="text" ref="red2fren"
                         defaultValue={ red2.fren.toFixed(3) }
                         onChange={ e => this.handleChange('RED2', 'fren', e) }
                  />
                </td>
                <td>
                  <input type="text" contentEditable ref='red2fnren'
                         defaultValue={ red2.fnren.toFixed(3) }
                         onChange={ e => this.handleChange('RED2', 'fnren', e) }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <h3>Factores definidos reglamentariamente</h3>
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
              { wfactors2.map( entry => {
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
            <p>Vector:</p>
            <ul>
              <li><tt>MEDIOAMBIENTE</tt>: energía térmica procedente del medioambiente</li>
              <li><tt>RED1</tt>: vector genérico (p.e. para energía procedente de red de distrito y calefacción)</li>
              <li><tt>RED2</tt>: vector genérico (p.e. para energía procedente de red de distrito y refrigeración)</li>
            </ul>
            <p>Origen:</p>
            <ul>
              <li><tt>grid</tt>: red</li>
              <li><tt>INSITU</tt>: producción 'in situ'</li>
              <li><tt>COGENERACION</tt>: energía procedente de la cogeneración (debe aplicarse únicamente a la energía eléctrica producida, considerando la energía térmica dentro de la frontera de evaluación)</li>
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

  handleChange(vec, factor, e) {
    const newvalue = parseFloat(e.target.value.replace(/,/g, '.'));
    if (isNaN(newvalue)) return;

    const { wfactors, dispatch } = this.props;
    let [[ vecobj ], otherveclist] = _.partition(wfactors, e => e.vector === vec);
    vecobj[factor] = newvalue;
    dispatch(editWFactors([...otherveclist, vecobj]));
  }
};

export default WeightingFactorsPage = connect(state => {
  return {
    wfactors: state.wfactors
  };
})(WeightingFactorsPage);
