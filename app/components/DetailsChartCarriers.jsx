import React from "react";

import PieChart from "components/PieChart";

const ORIGIN_COLORS = { INSITU: "green", COGEN: "blue", RED: "red" };

// Gráfica de detalle de composición de consumos y emisiones para un vector energético
const DetailsChartForCarrier = ({ balance_cr }) => {
  // Used energy
  const uses_keys = Object.keys(balance_cr.used_EPB_an_byuse).sort();
  const used_values = uses_keys.map(k => balance_cr.used_EPB_an_byuse[k]);
  // Delivered energy (produced + grid)
  const del = {
    RED: balance_cr.delivered_grid_an,
    ...balance_cr.produced_bygen_an
  };
  const del_keys = Object.keys(del).sort();
  const del_values = del_keys.map(k => del[k]);
  // Exported energy (produced not used)
  const exp_keys = Object.keys(balance_cr.exported_bygen_an).sort();
  const exp_values = exp_keys.map(k => balance_cr.exported_bygen_an[k]);
  // EP
  const epnren_values = uses_keys.map(k => balance_cr.we_an_byuse[k].nren);
  const epren_values = uses_keys.map(k => balance_cr.we_an_byuse[k].ren);
  const co2_values = uses_keys.map(k => balance_cr.we_an_byuse[k].co2);
  const eptot_values = uses_keys.map(k => {
    const we = balance_cr.we_an_byuse[k];
    return we.ren + we.nren;
  });

  return (
    <div className="col">
      <div className="row">
        <h4>{balance_cr.carrier}</h4>
      </div>
      <div className="row" id={`finalyemisiones-${balance_cr.carrier}`}>
        <div className="col-3 offset-1">
          <PieChart
            data={{
              title: "Energía final consumida, por servicios",
              labels: uses_keys,
              series: used_values,
              units: "kWh/a"
            }}
          />
        </div>
        <div className="col-3">
          <PieChart
            data={{
              title: "Energía final suministrada, según origen",
              labels: del_keys,
              series: del_values,
              units: "kWh/a"
            }}
            colors={ORIGIN_COLORS}
          />
        </div>
        <div className="col-3">
          <PieChart
            data={{
              title: "Energía final exportada (nEPB y red), según origen",
              labels: exp_keys,
              series: exp_values,
              units: "kWh/a"
            }}
            colors={ORIGIN_COLORS}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <PieChart
            data={{
              title: "Energía primaria total, por servicios",
              labels: uses_keys,
              series: eptot_values,
              units: "kWh/a"
            }}
          />
          {/* <p>Energía primaria total</p>
          <tt>{JSON.stringify(balance_cr.we_an_byuse, undefined, 2)}</tt>
          ren + nren... */}
        </div>
        <div className="col">
          <PieChart
            data={{
              title: "Energía primaria no renovable, por servicios",
              labels: uses_keys,
              series: epnren_values,
              units: "kWh/a"
            }}
          />
        </div>
        <div className="col">
          <PieChart
            data={{
              title: "Energía primaria renovable, por servicios",
              labels: uses_keys,
              series: epren_values,
              units: "kWh/a"
            }}
          />
        </div>
        <div className="col">
          <PieChart
            data={{
              title: "Emisiones de CO2, por servicios",
              labels: uses_keys,
              series: co2_values,
              units: "kg_CO2/a"
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Gráfica de detalle de composición de consumos y emisiones
const DetailsChartCarriers = props => {
  const { balance_cr } = props.balance;
  const carriers = Object.keys(balance_cr).sort();
  return carriers.map(cr => (
    <div className="row px-4" key={`vector-${cr}`}>
      <DetailsChartForCarrier balance_cr={balance_cr[cr]} />
    </div>
  ));
};

export default DetailsChartCarriers;
