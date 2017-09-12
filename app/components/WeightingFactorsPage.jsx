import React from 'react';
import { connect } from 'react-redux';

import NavBar from 'components/NavBar';
import Footer from 'components/Footer';

import { editWFactors } from 'actions/actions.js';

class WeightingFactorsPageClass extends React.Component {
  render() {
    const { wfactors } = this.props;
    const wfactors2 = wfactors.filter(e => !e.carrier.startsWith('RED'));
    const red1 = wfactors.filter(e => e.carrier === 'RED1')[0];
    const red2 = wfactors.filter(e => e.carrier === 'RED2')[0];

    return (
      <div>
        <NavBar match={ this.props.match } />
        <div className="container">
          <div className="page-header">
            <h1>Factores de paso</h1>
            <p>Factores de conversión de energía final a energía primaria renovable y no renovable. Estos factores corresponden a los definidos en el Documento reconocido del RITE <a href="http://www.minetad.gob.es/energia/desarrollo/EficienciaEnergetica/RITE/Reconocidos/Reconocidos/Otros%20documentos/Factores_emision_CO2.pdf">Factores de emisión de CO2 y coeficientes de paso a energía primaria de diferentes fuentes de energía final consumidas en el sector de edificios en España</a>, que incluye los factores de paso de energía final a energía primaria y a emisiones.</p>
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
                <td>RED1</td><td>RED</td><td>input</td><td>A</td>
                <td>
                  <input type="text" id="red1ren"
                         defaultValue={ red1.ren.toFixed(3) }
                         onChange={ e => this.handleChange('RED1', 'ren', e) }
                  />
                </td>
                <td>
                  <input type="text" id="red1nren"
                         defaultValue={ red1.nren.toFixed(3) }
                         onChange={ e => this.handleChange('RED1', 'nren', e) }
                  />
                </td>
              </tr>
              <tr>
                <td>RED2</td><td>RED</td><td>input</td><td>A</td>
                <td>
                  <input type="text" id="red2ren"
                         defaultValue={ red2.ren.toFixed(3) }
                         onChange={ e => this.handleChange('RED2', 'ren', e) }
                  />
                </td>
                <td>
                  <input type="text" contentEditable id="red2nren"
                         defaultValue={ red2.nren.toFixed(3) }
                         onChange={ e => this.handleChange('RED2', 'nren', e) }
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
              { wfactors2.map(
                ({ carrier, source, use, step, ren, nren }) =>
                  <tr key={ `${carrier}-${source}-${use}-${step}` }>
                    <td>{ carrier }</td>
                    <td>{ source }</td>
                    <td>{ use }</td>
                    <td>{ step }</td>
                    <td>{ ren.toFixed(3) }</td>
                    <td>{ nren.toFixed(3) }</td>
                  </tr>
              )}
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
              <li><tt>RED</tt>: red de distribución</li>
              <li><tt>INSITU</tt>: producción &quot;in situ&quot;</li>
              <li><tt>COGENERACION</tt>: cogeneración
              (energía producida usando otra energía importada dentro de la frontera de evaluación)</li>
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
    const vecobj = wfactors.find(f => f.carrier === vec);
    const otherveclist = wfactors.filter(f => f.carrier !== vec);
    vecobj[factor] = newvalue;
    dispatch(editWFactors([...otherveclist, vecobj]));
  }
}

const WeightingFactorsPage = connect(state => {
  return {
    wfactors: state.wfactors
  };
})(WeightingFactorsPageClass);

export default WeightingFactorsPage;