import React from "react";

import EnergyComponentChart from "components/EnergyComponentChart.jsx";

const get_service_icon = service => {
  switch (service) {
    case "CAL":
      return { icon: "fa-fire", color: "red", name: "Calefacción" };
    case "REF":
      return { icon: "fa-asterisk", color: "navy", name: "Refrigeración" };
    case "ACS":
      return { icon: "fa-tint", color: "blue", name: "ACS" };
    case "VEN":
      return { icon: "fa-random", color: "blue", name: "Ventilación" };
    case "ILU":
      return { icon: "fa-lightbulb-o", color: "yellow", name: "Iluminación" };
    case "HU":
      return { icon: "fa-cloud", color: "navy" };
    case "DHU":
      return { icon: "fa-cloud", color: "red" };
    default:
      // NDEF y otros
      return { icon: "fa-question-circle", color: "gray" };
  }
};

export default class EnergyComponentList extends React.Component {
  // Seleccionar componente
  handleClick(i) {
    const component = this.props.cdata[i];
    this.props.onSelect(i, component);
  }

  // Cambiar estado activo del componente
  handleChange(i) {
    const component = this.props.cdata[i];
    this.props.onEdit(i, { ...component, active: !component.active });
  }

  render() {
    const { cdata, selectedkey, area } = this.props;
    const maxvalue = Math.max(
      ...cdata.map(component => Math.max(...component.values))
    );

    return (
      <div>
        <table
          id="components"
          className="table table-striped table-bordered table-condensed"
        >
          <thead>
            <tr>
              <th />
              <th className="col-lg-2">Vector energético</th>
              <th className="col-lg-1">Tipo</th>
              <th className="col-lg-1">Subtipo</th>
              <th className="col-lg-1">Servicio</th>
              <th className="col-lg-1">kWh/a</th>
              <th className="col-lg-1">kWh/m²·a</th>
              <th className="col-lg-1">Valores</th>
              <th className="col-lg-4">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {cdata.map((component, i) => {
              const {
                active,
                ctype,
                csubtype,
                carrier,
                service,
                values,
                comment
              } = component;
              const data = values.map((value, imes) => ({
                Mes: imes,
                Valor: value
              }));
              const rowstyles = [
                selectedkey === i ? "bg-info" : "",
                active ? "" : "inactivecomponent",
                ctype === "CONSUMO" ? "deliveredstyle" : ""
              ].join(" ");
              const sumvalues = values.reduce((a, b) => a + b, 0);
              const { icon: iconname, color: iconcolor } = get_service_icon(
                service
              );
              return (
                <tr
                  key={i}
                  className={rowstyles}
                  onClick={_ => this.handleClick(i)}
                >
                  <td>
                    <input
                      type="checkbox"
                      defaultChecked={active}
                      onClick={_e => this.handleChange(i)}
                    />
                  </td>
                  <td>{carrier}</td>
                  <td>{ctype}</td>
                  <td>{csubtype}</td>
                  <td>
                    <span
                      className={`fa ${iconname}`}
                      aria-hidden="true"
                      style={{ opacity: 0.5, color: iconcolor }}
                    />{" "}
                    {service}
                  </td>
                  <td>
                    <p className="float-right">{sumvalues.toFixed(2)}</p>
                  </td>
                  <td>
                    <p className="float-right">
                      {(sumvalues / area).toFixed(2)}
                    </p>
                  </td>
                  <td>
                    <EnergyComponentChart
                      ctype={ctype}
                      data={data}
                      maxvalue={maxvalue}
                      width="100%"
                    />
                  </td>
                  <td>{comment}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
