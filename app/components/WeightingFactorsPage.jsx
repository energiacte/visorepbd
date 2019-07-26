import React from "react";
import { connect } from "react-redux";

import NavBar from "components/NavBar";
import Footer from "components/Footer";
import NumInput from "components/NumInput";

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
    const wfactors_reglamentarios_ep = wfactors_ep.wdata
      .filter(
        f =>
          !f.carrier.startsWith("RED") &&
          !(f.source === "COGENERACION" && f.dest === "A_RED" && f.step === "A")
      )
      .sort((a, b) =>
        `${a.carrier}-${a.source}-${a.dest}-${a.step}`.localeCompare(
          `${b.carrier}-${b.source}-${b.dest}-${b.step}`
        )
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
            className="table table-sm table-striped table-borderless table-condensed table-hover"
          >
            <caption>
              Lista de factores definibles por el usuario de paso de energía
              final a otros indicadores en función del origen de la energía, el
              destino/uso y el paso de cálculo (A o B)
            </caption>
            <thead className="border-bottom border-dark">
              <tr>
                <th scope="col" colSpan="4" />
                <th
                  scope="col"
                  colSpan="2"
                  className="border-bottom border-dark"
                >
                  Energía primaria
                </th>
                <th scope="col" className="border-bottom border-dark">
                  Emisiones
                </th>
              </tr>
              <tr>
                <th scope="col" className="col-lg-2">Vector energético</th>
                <th scope="col" className="col-lg-2">Origen</th>
                <th scope="col" className="col-lg-2">Uso</th>
                <th scope="col" className="col-lg-1">Paso</th>
                <th scope="col">
                  f<sub>ep;ren</sub>
                </th>
                <th scope="col">
                  f<sub>ep;nren</sub>
                </th>
                <th scope="col">
                  f<sub>CO2</sub>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ELECTRICIDAD</td>
                <td>COGENERACION</td>
                <td>A_RED</td>
                <td>A</td>
                <td>
                  <NumInput
                    id="cogenrenep_input"
                    min={0}
                    precision={3}
                    value={cog.ren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("EP", "ELECTRICIDADCOGEN", {
                          ...cog,
                          ren: val
                        })
                      );
                    }}
                  />
                </td>
                <td>
                  <NumInput
                    id="cogennrenep_input"
                    min={0}
                    precision={3}
                    value={cog.nren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("EP", "ELECTRICIDADCOGEN", {
                          ...cog,
                          nren: val
                        })
                      );
                    }}
                  />
                </td>
                <td>
                  <NumInput
                    id="cogennrenco2_input"
                    min={0}
                    precision={3}
                    value={cogco2.nren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("CO2", "ELECTRICIDADCOGEN", {
                          ...cogco2,
                          nren: val
                        })
                      );
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>RED1</td>
                <td>RED</td>
                <td>SUMINISTRO</td>
                <td>A</td>
                <td>
                  <NumInput
                    id="red1renep_input"
                    min={0}
                    precision={3}
                    value={red1.ren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("EP", "RED1", { ...red1, ren: val })
                      );
                    }}
                  />
                </td>
                <td>
                  <NumInput
                    id="red1nrenep_input"
                    min={0}
                    precision={3}
                    value={red1.nren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("EP", "RED1", { ...red1, nren: val })
                      );
                    }}
                  />
                </td>
                <td>
                  <NumInput
                    id="red1nrenco2_input"
                    min={0}
                    precision={3}
                    value={red1co2.nren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("CO2", "RED1", {
                          ...red1co2,
                          nren: val
                        })
                      );
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>RED2</td>
                <td>RED</td>
                <td>SUMINISTRO</td>
                <td>A</td>
                <td>
                  <NumInput
                    id="red2renep_input"
                    min={0}
                    precision={3}
                    value={red2.ren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("EP", "RED2", { ...red2, ren: val })
                      );
                    }}
                  />
                </td>
                <td>
                  <NumInput
                    id="red2nrenep_input"
                    min={0}
                    precision={3}
                    value={red2.nren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("EP", "RED2", { ...red2, nren: val })
                      );
                    }}
                  />
                </td>
                <td>
                  <NumInput
                    id="red2nrenco2_input"
                    min={0}
                    precision={3}
                    value={red2co2.nren.toFixed(3)}
                    onValueChange={val => {
                      this.props.dispatch(
                        editUserWFactors("CO2", "RED2", {
                          ...red2co2,
                          nren: val
                        })
                      );
                    }}
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
            className="table table-sm table-striped table-borderless table-condensed table-hover"
          >
            <caption>
              Lista de factores reglamentarios de paso de energía final a otros
              indicadores en función del origen de la energía, el destino/uso y
              el paso de cálculo (A o B)
            </caption>
            <thead className="border-bottom border-dark">
              <tr>
                <th scope="col" colSpan="4" />
                <th
                  scope="col"
                  colSpan="2"
                  className="border-bottom border-dark"
                >
                  Energía primaria
                </th>
                <th scope="col" className="border-bottom border-dark">
                  Emisiones
                </th>
              </tr>
              <tr>
                <th scope="col" className="col-lg-2">Vector energético</th>
                <th scope="col" className="col-lg-2">Origen</th>
                <th scope="col" className="col-lg-2">Uso</th>
                <th scope="col" className="col-lg-1">Paso</th>
                <th scope="col">
                  f<sub>ep;ren</sub>
                </th>
                <th scope="col">
                  f<sub>ep;nren</sub>
                </th>
                <th scope="col">
                  f<sub>CO2</sub>
                </th>
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
                  let co2 = co2facs ? co2facs.nren : 0.0;
                  return (
                    <tr key={`${carrier}-${source}-${dest}-${step}`}>
                      <td>{carrier}</td>
                      <td>{source}</td>
                      <td>{dest}</td>
                      <td>{step}</td>
                      <td>{ren.toFixed(3)}</td>
                      <td>{nren.toFixed(3)}</td>
                      <td>{co2.toFixed(3)}</td>
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
            <p>Vectores energéticos:</p>
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
            <p>Origen de la energía:</p>
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
            <p>Uso / destino de la energía:</p>
            <ul>
              <li>
                <tt>SUMINISTRO</tt>: sumiministro
              </li>
              <li>
                <tt>A_RED</tt>: exportación a la red
              </li>
              <li>
                <tt>A_NEPB</tt>: exportación a usos no EPB
              </li>
            </ul>
            <p>Paso de cálculo:</p>
            <ul>
              <li>
                <tt>A</tt>: paso de cálculo A. Recusos usados
              </li>
              <li>
                <tt>B</tt>: paso de cálculo B. Recursos evitados a la red
              </li>
            </ul>
            <p>Factores de paso:</p>
            <ul>
              <li>
                <tt>
                  f<sub>ep;ren</sub>
                </tt>
                : Factor de paso de energía final a energía primaria renovable
                [kWh/kWh<sub>f</sub>]
              </li>
              <li>
                <tt>
                  f<sub>ep;nren</sub>
                </tt>
                : Factor de paso de energía final a energía primaria no
                renovable [kWh/kWh<sub>f</sub>]
              </li>
              <li>
                <tt>
                  f<sub>CO2</sub>
                </tt>
                : Factor de paso de energía final a emisiones de CO2 [kg
                <sub>CO2e</sub>/kWh<sub>f</sub>]
              </li>
            </ul>
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
