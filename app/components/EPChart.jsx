import React from 'react';

const EPChart = props => {
  const { width = "100%", height = "135px", className = null, data, kexp } = props;
  const { EPtotal, EPnren, EPren, EPrer } = data;

  const steps = [0, 100, 200, 500];
  const maxvalue = Math.max(0, EPtotal, EPnren, EPren);
  const minvalue = Math.min(0, EPtotal, EPnren, EPren);
  const maxlimit = Math.max(100, steps.find(v => v >= maxvalue) || maxvalue);
  const minlimit = Math.min(0, -steps.find(v => -v <= minvalue) || minvalue);
  const pos0 = -minlimit;
  const vbw = 70 + maxlimit - minlimit + 20;
  const vbh = 100;

  return (
    <div width={ width } height={ height } style={{ backgroundColor: "rgb(70, 130, 180, 0.3)", textAlign: "center", font: "14px sans-serif", fontWeight: "normal"  }}>
      <p style={{ fontSize: "16px", fontWeight: "bold", fill: "#444" }}>
        Consumo de energía primaria [kWh/m²·año]
      </p>
      <p>(k_exp: { kexp.toFixed(2) } , RER: { EPrer.toFixed(2) } )</p>
    <svg width="100%" height="100px" className={ className }
      preserveAspectRatio="xMidYMin meet" viewBox={ `0 0 ${ vbw } ${ vbh }` }
      style={{
        display: props.display || "inline-block",
        padding: props.padding || 0,
        font: "12px sans-serif"
      }}>
      <title id="title" fill="black">Consumo de energía primaria</title>
      <desc id="desc">EP_total: { EPtotal.toFixed(2) }, EP_nren: { EPnren.toFixed(2) }, EP_ren: { EPren.toFixed(2) }</desc>
      <g transform="translate(70,0)">
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
          <title>EP_total: { EPtotal.toFixed(2) } kWh/m²·año</title>
        </g>
        <g className="bar" style={{ height: "25px" }}>
          <rect width={ Math.abs(EPnren) } x={ Math.min(pos0, pos0 + EPnren) } height="22" y="25" fill="red" fillOpacity="0.7"></rect>
          <text x={ -70 + 5 } y="37" dominantBaseline="middle" fill="#555">
            EP<tspan dy="4">nren</tspan>
          </text>
          <text x={ Math.min(pos0, pos0 + EPnren) + 5 } y="37" dominantBaseline="middle" fill="white">
            <tspan fontWeight="bold">{ EPnren.toFixed(2) }</tspan>
          </text>
          <title>EP_nren: { EPnren.toFixed(2) } kWh/m²·año</title>
        </g>
        <g className="bar" style={{ height: "25px" }}>
          <rect width={ Math.abs(EPren) } x={ Math.min(pos0, pos0 + EPren) } height="22" y="50" fill="green" fillOpacity="0.7"></rect>
          <text x={ -70 + 5 } y="62" dominantBaseline="middle" fill="#555">
            EP<tspan dy="4">ren</tspan>
          </text>
          <text x={ Math.min(pos0, pos0 + EPren) + 5 } y="62" dominantBaseline="middle" fill="white">
            <tspan fontWeight="bold">{ EPren.toFixed(2) }</tspan>
          </text>
          <title>EP_ren: { EPren.toFixed(2) } kWh/m²·año</title>
        </g>
        <line x1={ pos0 + minlimit } y1="0" x2={ pos0 + minlimit } y2="75" strokeWidth="1" stroke="#333"/>
        <text x={ pos0 + minlimit } y="90" textAnchor="middle" fill="#333">{ minlimit.toFixed(0) }</text>
        <line x1={ pos0 } y1="0" x2={ pos0 } y2="75" strokeWidth="2" stroke="#333"/>
        <text x={ pos0 } y="90" textAnchor="middle" fill="#333">0</text>
        <line x1={ pos0 + maxlimit } y1="0" x2={ pos0 + maxlimit } y2="75" strokeWidth="1" stroke="#333" strokeDasharray="2,3"/>
        <text x={ pos0 + maxlimit } y="90" textAnchor="middle" fill="#333">{ maxlimit.toFixed(0) }</text>
      </g>
    </svg>
    </div>
  )
};
export default EPChart;
  