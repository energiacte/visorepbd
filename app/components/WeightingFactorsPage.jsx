import React from "react";
import { connect } from "react-redux";

import NavBar from "components/NavBar";
import Footer from "components/Footer";

import { editWFactors, changeLocalizacion } from "actions/actions.js";
import { new_wfactors } from "components/myepbdjs";

const CTELOCS = {
  PENINSULA: "Península",
  CANARIAS: "Islas Canarias",
  BALEARES: "Islas Baleares",
  CEUTAMELILLA: "Ceuta y Melilla"
};

class WeightingFactorsPageClass extends React.Component {
  render() {
    const { wfactors, localizacion } = this.props;
    const wfactors2 = wfactors.wdata.filter(
      f =>
        !f.carrier.startsWith("RED") &&
        !(f.source === "COGENERACION" && f.dest === "to_grid" && f.step === "A")
    );
    const red1 = wfactors.wdata.find(f => f.carrier === "RED1");
    const red2 = wfactors.wdata.find(f => f.carrier === "RED2");
    const cog = wfactors.wdata.find(
      f => f.source === "COGENERACION" && f.dest === "to_grid" && f.step === "A"
    );

    return (
      <div>
        <NavBar match={this.props.match} />
        <div className="container-fluid">
          <div className="page-header">
            <h1>
              Factores de paso{" "}
              <small>(de energía final a energía primaria)</small>
            </h1>
            <p>
              Factores de conversión de energía final a energía primaria
              renovable y no renovable. Estos factores corresponden a los
              definidos en el Documento reconocido del RITE{" "}
              <a href="http://www.minetad.gob.es/energia/desarrollo/EficienciaEnergetica/RITE/Reconocidos/Reconocidos/Otros%20documentos/Factores_emision_CO2.pdf">
                Factores de emisión de CO2 y coeficientes de paso a energía
                primaria de diferentes fuentes de energía final consumidas en el
                sector de edificios en España
              </a>
              , que incluye los factores de paso de energía final a energía
              primaria y a emisiones.
            </p>
          </div>
          <h3>
            Localización{" "}
            <small>(define los factores de paso reglamentarios)</small>
          </h3>
          <div className="form-group">
            <select
              id="selectLocalizacion"
              className="form-control"
              onChange={e => this.handleLocalizacionChange(e)}
              value={localizacion}
            >
              <option value={"PENINSULA"}>{CTELOCS["PENINSULA"]}</option>
              <option value={"CANARIAS"}>{CTELOCS["CANARIAS"]}</option>
              <option value={"BALEARES"}>{CTELOCS["BALEARES"]}</option>
              <option value={"CEUTAMELILLA"}>{CTELOCS["CEUTAMELILLA"]}</option>
            </select>
          </div>
          <h3>Factores definidos por el usuario</h3>
          <table
            id="weditor"
            className="table table-striped table-bordered table-condensed"
          >
            <thead>
              <tr>
                <th>Vector energético</th>
                <th>Origen</th>
                <th>Uso</th>
                <th>Paso</th>
                <th>Fp_ren</th>
                <th>Fp_nren</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RED1</td>
                <td>RED</td>
                <td>input</td>
                <td>A</td>
                <td>
                  <input
                    type="text"
                    id="red1ren"
                    defaultValue={red1.ren.toFixed(3)}
                    onChange={e => this.handleChange("RED1", "ren", e)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="red1nren"
                    defaultValue={red1.nren.toFixed(3)}
                    onChange={e => this.handleChange("RED1", "nren", e)}
                  />
                </td>
              </tr>
              <tr>
                <td>RED2</td>
                <td>RED</td>
                <td>input</td>
                <td>A</td>
                <td>
                  <input
                    type="text"
                    id="red2ren"
                    defaultValue={red2.ren.toFixed(3)}
                    onChange={e => this.handleChange("RED2", "ren", e)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    contentEditable
                    id="red2nren"
                    defaultValue={red2.nren.toFixed(3)}
                    onChange={e => this.handleChange("RED2", "nren", e)}
                  />
                </td>
              </tr>
              <tr>
                <td>ELECTRICIDAD</td>
                <td>COGENERACION</td>
                <td>to_grid</td>
                <td>A</td>
                <td>
                  <input
                    type="text"
                    id="red2ren"
                    defaultValue={cog.ren.toFixed(3)}
                    onChange={e =>
                      this.handleChange("ELECTRICIDADCOGEN", "ren", e)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    contentEditable
                    id="red2nren"
                    defaultValue={cog.nren.toFixed(3)}
                    onChange={e =>
                      this.handleChange("ELECTRICIDADCOGEN", "nren", e)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <h3>
            Factores definidos a partir de valores reglamentarios{" "}
            <small>
              (para la localización &quot;{CTELOCS[localizacion]}&quot;)
            </small>
          </h3>
          <table
            id="components"
            className="table table-striped table-bordered table-condensed"
          >
            <thead>
              <tr>
                <th>Vector energético</th>
                <th>Origen</th>
                <th>Uso</th>
                <th>Paso</th>
                <th>Fp_ren</th>
                <th>Fp_nren</th>
              </tr>
            </thead>
            <tbody>
              {wfactors2.map(({ carrier, source, dest, step, ren, nren }) => (
                <tr key={`${carrier}-${source}-${dest}-${step}`}>
                  <td>{carrier}</td>
                  <td>{source}</td>
                  <td>{dest}</td>
                  <td>{step}</td>
                  <td>{ren.toFixed(3)}</td>
                  <td>{nren.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="small bg-light">
            <p>
              <b>Notas</b>:
            </p>
            <p>Vector:</p>
            <ul>
              <li>
                <tt>MEDIOAMBIENTE</tt>: energía térmica procedente del
                medioambiente
              </li>
              <li>
                <tt>RED1</tt>: vector genérico (p.e. para energía procedente de
                red de distrito y calefacción)
              </li>
              <li>
                <tt>RED2</tt>: vector genérico (p.e. para energía procedente de
                red de distrito y refrigeración)
              </li>
            </ul>
            <p>Origen:</p>
            <ul>
              <li>
                <tt>RED</tt>: red de distribución
              </li>
              <li>
                <tt>INSITU</tt>: producción &quot;in situ&quot;
              </li>
              <li>
                <tt>COGENERACION</tt>: cogeneración (energía producida usando
                otra energía importada dentro de la frontera de evaluación)
              </li>
            </ul>
            <p>Uso:</p>
            <ul>
              <li>
                <tt>input</tt>: sumiministro
              </li>
              <li>
                <tt>to_grid</tt>: exportación a la red
              </li>
              <li>
                <tt>to_nEPB</tt>: exportación a usos nEPB
              </li>
            </ul>
            <p>
              <tt>Fpren</tt>: Factor de paso de energía final a energía primaria
              renovable
            </p>
            <p>
              <tt>Fpnren</tt>: Factor de paso de energía final a energía
              primaria no renovable
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  handleChange(vec, factor, e) {
    const newvalue = parseFloat(e.target.value.replace(/,/g, "."));
    if (isNaN(newvalue)) return;
    const { wfactors, dispatch } = this.props;
    const { wmeta, wdata } = wfactors;
    let vecobj, otherveclist;
    if (vec === "ELECTRICIDADCOGEN") {
      vecobj = wdata.find(
        f => f.source === "COGENERACION" && f.dest === "to_grid"
      );
      otherveclist = wdata.filter(
        f => f.source !== "COGENERACION" && f.dest !== "to_grid"
      );
    } else {
      vecobj = wdata.find(f => f.carrier === vec);
      otherveclist = wdata.filter(f => f.carrier !== vec);
    }
    vecobj[factor] = newvalue;
    dispatch(editWFactors({ wmeta, wdata: [...otherveclist, vecobj] }));
  }

  handleLocalizacionChange(e) {
    const loc = e.target.value;
    const { wfactors, dispatch } = this.props;
    const red1 = wfactors.wdata.find(f => f.carrier === "RED1");
    const red2 = wfactors.wdata.find(f => f.carrier === "RED2");
    const cog = wfactors.wdata.find(
      f => f.source === "COGENERACION" && f.dest === "to_grid" && f.step === "A"
    );
    dispatch(changeLocalizacion(loc));
    const newfactors = new_wfactors(loc, {
      cogen: {
        to_grid: { ren: cog.ren, nren: cog.nren },
        to_nEPB: { ren: cog.ren, nren: cog.nren }
      },
      red: {
        RED1: { ren: red1.ren, nren: red1.nren },
        RED2: { ren: red2.ren, nren: red2.nren }
      }
    });
    dispatch(editWFactors(newfactors));
  }
}

const WeightingFactorsPage = connect(state => {
  return {
    wfactors: state.wfactors,
    localizacion: state.localizacion
  };
})(WeightingFactorsPageClass);

export default WeightingFactorsPage;
