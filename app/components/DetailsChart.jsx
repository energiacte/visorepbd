import React from "react";
import ChartistGraph from "components/Chartist";
import "chartist/dist/chartist.min.css";

const add = (a, b) => a + b;

// Gráfica de detalle de composición de consumos y emisiones
// Ver https://gionkunz.github.io/chartist-js/index.html
// TODO: corregir estilos (colores de segmentos y estilo y posición de texto)
class DetailsChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { balance } = this.props;

    const b = balance.balance_m2;
    const bkeys = Object.keys(b.used_EPB_byuse).sort();

    const chartData = {
      final: {
        data: {
          labels: bkeys.map(k => `${k}: ${b.used_EPB_byuse[k].toFixed(1)}`),
          series: bkeys.map(k => b.used_EPB_byuse[k])
        },
        options: {
          width: "100%",
          donut: true,
          donutWidth: "50%",
          startAngle: 270,
          total: 2 * Object.values(b.used_EPB_byuse).reduce(add)
        },
        type: "Pie"
      },
      ren: {
        data: {
          labels: bkeys.map(k => `${k}: ${b.B_byuse[k].ren.toFixed(1)}`),
          series: bkeys.map(k => b.B_byuse[k].ren)
        },
        options: {
          donut: true,
          donutWidth: 60,
          startAngle: 270,
          total: 2 * b.B.ren
        },
        type: "Pie"
      },
      nren: {
        data: {
          labels: bkeys.map(k => `${k}: ${b.B_byuse[k].nren.toFixed(1)}`),
          series: bkeys.map(k => b.B_byuse[k].nren)
        },
        options: {
          donut: true,
          donutWidth: 60,
          startAngle: 270,
          total: 2 * b.B.nren
        },
        type: "Pie"
      },
      co2: {
        data: {
          labels: bkeys.map(k => `${k}: ${b.B_byuse[k].co2.toFixed(1)}`),
          series: bkeys.map(k => b.B_byuse[k].co2)
        },
        options: {
          donut: true,
          donutWidth: 60,
          startAngle: 270,
          total: 2 * b.B.co2
        },
        type: "Pie"
      }
    };

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <p className="text-center">
              <b>Consumo de energía final</b>
              <br />
              <i>[kWh/m2.a]</i>
            </p>
          </div>
          <div className="col">
            <p className="text-center">
              <b>Consumo de energía primaria renovable</b>
              <br />
              <i>[kWh/m2.a]</i>
            </p>
          </div>
          <div className="col">
            <p className="text-center">
              <b>Consumo de energía primaria no renovable</b>
              <br />
              <i>[kWh/m2.a]</i>
            </p>
          </div>
          <div className="col">
            <p className="text-center">
              <b>Emisiones de CO2</b>
              <br />
              <i>[kg_CO2/m2.a]</i>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ChartistGraph
              className={"ct-golden-section"}
              data={chartData.final.data}
              options={chartData.final.options}
              type={chartData.final.type}
            />
          </div>
          <div className="col">
            <ChartistGraph
              className={"ct-golden-section"}
              data={chartData.ren.data}
              options={chartData.ren.options}
              type={chartData.ren.type}
            />
          </div>
          <div className="col">
            <ChartistGraph
              className={"ct-golden-section"}
              data={chartData.nren.data}
              options={chartData.nren.options}
              type={chartData.nren.type}
            />
          </div>
          <div className="col">
            <ChartistGraph
              className={"ct-golden-section"}
              data={chartData.co2.data}
              options={chartData.co2.options}
              type={chartData.co2.type}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DetailsChart;
