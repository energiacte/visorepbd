import React from "react";

import PieChart from "components/PieChart";

// Gráfica de detalle de composición de consumos y emisiones
class DetailsChart extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = { balance: { balance_m2: null } };

  render() {
    const {
      balance: { balance_m2: b }
    } = this.props;

    if (b == null) return null;

    const bkeys = Object.keys(b.used_EPB_byuse).sort();
    return (
      <div className="row px-4">
        <div className="col">
          <PieChart
            data={{
              title: "Consumo de energía final",
              labels: bkeys,
              series: bkeys.map(k => b.used_EPB_byuse[k]),
              units: "kWh/m²·a"
            }}
          />
        </div>
        <div className="col">
          <PieChart
            data={{
              title: "Energía primaria total",
              labels: bkeys,
              series: bkeys.map(k => b.B_byuse[k].ren + b.B_byuse[k].nren),
              units: "kWh/m²·a"
            }}
          />
        </div>
        <div className="col">
          <PieChart
            data={{
              title: "Energía primaria no renovable",
              labels: bkeys,
              series: bkeys.map(k => b.B_byuse[k].nren),
              units: "kWh/m²·a"
            }}
          />
        </div>
        <div className="col">
          <PieChart
            data={{
              title: "Energía primaria renovable",
              labels: bkeys,
              series: bkeys.map(k => b.B_byuse[k].ren),
              units: "kWh/m²·a"
            }}
          />
        </div>
        <div className="col">
          <PieChart
            data={{
              title: "Emisiones de CO2",
              labels: bkeys,
              series: bkeys.map(k => b.B_byuse[k].co2),
              units: "kg_CO2/m²·a"
            }}
          />
        </div>
      </div>
    );
  }
}

export default DetailsChart;
