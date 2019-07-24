import React from "react";
import { connect } from "react-redux";

import NavBar from "components/NavBar";
import Footer from "components/Footer";

import { editUserWFactors, changeLocation } from "actions/actions.js";

const CTELOCS = {
  PENINSULA: "Península",
  CANARIAS: "Islas Canarias",
  BALEARES: "Islas Baleares",
  CEUTAMELILLA: "Ceuta y Melilla"
};

// Visualización y edición de factores de paso activos
class WeightingFactorsPageClass extends React.Component {
  render() {
    const { wfactors_ep, wfactors_co2, location } = this.props;

    // Energía primaria --------------------
    // Factores definidos reglamentariamente
    const wfactors_reglamentarios_ep = wfactors_ep.wdata.filter(
      f =>
        !f.carrier.startsWith("RED") &&
        !(f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A")
    );
    // Factores definibles por el usuario
    const red1 = wfactors_ep.wdata.find(f => f.carrier === "RED1");
    const red2 = wfactors_ep.wdata.find(f => f.carrier === "RED2");
    const cog = wfactors_ep.wdata.find(
      f => f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A"
    );
    // Emisiones ---------------------------
    // Factores definidos reglamentariamente
    const wfactors_reglamentarios_co2 = wfactors_co2.wdata.filter(
      f =>
        !f.carrier.startsWith("RED") &&
        !(f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A")
    );
    // Factores definibles por el usuario
    const red1co2 = wfactors_co2.wdata.find(f => f.carrier === "RED1");
    const red2co2 = wfactors_co2.wdata.find(f => f.carrier === "RED2");
    const cogco2 = wfactors_co2.wdata.find(
      f => f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A"
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
              id="selectLocation"
              className="form-control"
              onChange={e =>
                this.props.dispatch(changeLocation(e.target.value))
              }
              value={location}
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
                <th colSpan="4" />
                <th colSpan="2">Energía primaria</th>
                <th colSpan="2">Emisiones de CO2</th>
              </tr>
              <tr>
                <th>Vector energético</th>
                <th>Origen</th>
                <th>Uso</th>
                <th>Paso</th>
                <th>Fp_ren</th>
                <th>Fp_nren</th>
                <th>Fp_ren</th>
                <th>Fp_nren</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RED1</td>
                <td>RED</td>
                <td>SUMINISTRO</td>
                <td>A</td>
                <td>
                  <input
                    type="text"
                    id="red1ren"
                    defaultValue={red1.ren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "EP",
                        "RED1",
                        { ...red1 },
                        "ren",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="red1nren"
                    defaultValue={red1.nren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "EP",
                        "RED1",
                        { ...red1 },
                        "nren",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="red1renco2"
                    defaultValue={red1co2.ren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "CO2",
                        "RED1",
                        { ...red1co2 },
                        "ren",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="red1nrenco2"
                    defaultValue={red1co2.nren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "CO2",
                        "RED1",
                        { ...red1co2 },
                        "nren",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>RED2</td>
                <td>RED</td>
                <td>SUMINISTRO</td>
                <td>A</td>
                <td>
                  <input
                    type="text"
                    id="red2ren"
                    defaultValue={red2.ren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "EP",
                        "RED2",
                        { ...red2 },
                        "ren",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    contentEditable
                    id="red2nren"
                    defaultValue={red2.nren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "EP",
                        "RED2",
                        { ...red2 },
                        "nren",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="red2renco2"
                    defaultValue={red2co2.ren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "CO2",
                        "RED2",
                        { ...red2co2 },
                        "ren",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    contentEditable
                    id="red2nrenco2"
                    defaultValue={red2co2.nren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "CO2",
                        "RED2",
                        { ...red2co2 },
                        "nren",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>ELECTRICIDAD</td>
                <td>COGENERACION</td>
                <td>A_RED</td>
                <td>A</td>
                <td>
                  <input
                    type="text"
                    id="red2ren"
                    defaultValue={cog.ren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "EP",
                        "ELECTRICIDADCOGEN",
                        { ...cog },
                        "ren",
                        e.target.value
                      )
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
                      this.handleChange(
                        "EP",
                        "ELECTRICIDADCOGEN",
                        { ...cog },
                        "nren",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="red2renco2"
                    defaultValue={cogco2.ren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "CO2",
                        "ELECTRICIDADCOGEN",
                        { ...cogco2 },
                        "ren",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    contentEditable
                    id="red2nrenco2"
                    defaultValue={cogco2.nren.toFixed(3)}
                    onChange={e =>
                      this.handleChange(
                        "CO2",
                        "ELECTRICIDADCOGEN",
                        { ...cogco2 },
                        "nren",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <h3>
            Factores definidos a partir de valores reglamentarios{" "}
            <small>
              (para la localización &quot;{CTELOCS[location]}&quot;)
            </small>
          </h3>
          <table
            id="components"
            className="table table-striped table-bordered table-condensed"
          >
            <thead>
              <tr>
                <th colSpan="4" />
                <th colSpan="2">Energía primaria</th>
                <th colSpan="2">Emisiones de CO2</th>
              </tr>
              <tr>
                <th>Vector energético</th>
                <th>Origen</th>
                <th>Uso</th>
                <th>Paso</th>
                <th>Fp_ren</th>
                <th>Fp_nren</th>
                <th>Fp_ren</th>
                <th>Fp_nren</th>
              </tr>
            </thead>
            <tbody>
              {wfactors_reglamentarios_ep.map(
                ({ carrier, source, dest, step, ren, nren }) => {
                  let co2facs = wfactors_reglamentarios_co2.find(
                    f =>
                      f.carrier === carrier &&
                      f.source === source &&
                      f.dest === dest &&
                      f.step === step
                  );
                  let [co2ren, co2nren] = co2facs
                    ? [co2facs.ren, co2facs.nren]
                    : ["-", "-"];
                  return (
                    <tr key={`${carrier}-${source}-${dest}-${step}`}>
                      <td>{carrier}</td>
                      <td>{source}</td>
                      <td>{dest}</td>
                      <td>{step}</td>
                      <td>{ren.toFixed(3)}</td>
                      <td>{nren.toFixed(3)}</td>
                      <td>{co2ren.toFixed(3)}</td>
                      <td>{co2nren.toFixed(3)}</td>
                    </tr>
                  );
                }
              )}
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
                <tt>SUMINISTRO</tt>: sumiministro
              </li>
              <li>
                <tt>A_RED</tt>: exportación a la red
              </li>
              <li>
                <tt>A_NEPB</tt>: exportación a usos nEPB
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

  handleChange(indicator, carrier, factors, part, newvalue) {
    const newvalueforpart = parseFloat(String(newvalue).replace(/,/g, "."));
    if (isNaN(newvalueforpart)) return;
    const newfactors = { ...factors, [part]: newvalueforpart };
    this.props.dispatch(editUserWFactors(indicator, carrier, newfactors));
  }
}

const WeightingFactorsPage = connect(state => {
  return {
    wfactors_ep: state.wfactors_ep,
    wfactors_co2: state.wfactors_co2,
    location: state.location
  };
})(WeightingFactorsPageClass);

export default WeightingFactorsPage;
