import React from 'react';

const EPChart = props => {
  const { width = "100%", height = "135px", className = null, data, kexp } = props;

  const { EPtotal, EPnren, EPren, EPrer } = data;

  const steps = [0, 100, 200, 500];
  const maxvalue = Math.max(0, EPtotal, EPnren, EPren);
  const minvalue = Math.min(0, EPtotal, EPnren, EPren);

  const maxlimit = Math.max(steps[1], steps.find(v => v >= maxvalue));
  const minlimit = Math.min(0, -steps.find(v => -v <= minvalue ));
  const pos0 = -minlimit;
  // TODO: Poner línea de 0 y límites de escala
  console.log('Limits: ', minvalue, maxvalue, minlimit, maxlimit);


  return (
    <svg width={ width } height={ height } className={ className }
      style={{ display: props.display || "inline-block", padding: props.padding || 0, font: "14px sans-serif" }}>
      <title id="title" fill="black">Consumo de energía primaria</title>
      <desc id="desc">EP_total: { EPtotal.toFixed(2) }, EP_nren: { EPnren.toFixed(2) }, EP_ren: { EPren.toFixed(2) }</desc>
      <rect width={ width } height={ height } fill='steelblue' fillOpacity="0.5" />
      <g transform="translate(70,20)" style={{ font: "16px sans-serif", fontWeight: "bold", fill: "#444" }}>
        <text>Consumo de energía primaria [kWh/m²·año]</text>
        <text dy="20px" style={{ fontWeight: "normal" }}>(k_exp: { kexp.toFixed(2) } , RER: { EPrer.toFixed(2) } )</text>
      </g>
      <g transform="translate(70,55)">
        <g className="bar" style={{ height: "25px" }}>
          <rect width={ Math.abs(EPtotal) } height="22"
            x={ Math.min(pos0, pos0 + EPtotal) } y="0"
            fill="blue" fillOpacity="0.7"></rect>
          <text x={ -70 + 5 } y="12" dominantBaseline="middle" fill="#555">
            EP<tspan dy="4">total</tspan>
          </text>
          <text x={ Math.min(pos0, pos0 + EPtotal) + 5 } y="12" dominantBaseline="middle" fill="white">
            <tspan fontWeight="bold">{ EPtotal.toFixed(2) }</tspan>
          </text>
        </g>
        <g className="bar" style={{ height: "25px" }}>
          <rect width={ Math.abs(EPnren) } x={ Math.min(pos0, pos0 + EPnren) } height="22" y="25" fill="red" fillOpacity="0.7"></rect>
          <text x={ -70 + 5 } y="37" dominantBaseline="middle" fill="#555">
            EP<tspan dy="4">nren</tspan>
          </text>
          <text x={ Math.min(pos0, pos0 + EPnren) + 5 } y="37" dominantBaseline="middle" fill="white">
            <tspan fontWeight="bold">{ EPnren.toFixed(2) }</tspan>
          </text>
        </g>
        <g className="bar" style={{ height: "25px" }}>
          <rect width={ Math.abs(EPren) } x={ Math.min(pos0, pos0 + EPren) } height="22" y="50" fill="green" fillOpacity="0.7"></rect>
          <text x={ -70 + 5 } y="62" dominantBaseline="middle" fill="#555">
            EP<tspan dy="4">ren</tspan>
          </text>
          <text x={ Math.min(pos0, pos0 + EPren) + 5 } y="62" dominantBaseline="middle" fill="white">
            <tspan fontWeight="bold">{ EPren.toFixed(2) }</tspan>
          </text>
        </g>
      </g>
    </svg>
  )
};
export default EPChart;
  