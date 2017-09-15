import React from 'react';

const EPChart = props => {
  const { width = "100%", height = "135px", className = null, data, kexp } = props;
  const { EPtotal, EPnren, EPren, EPrer } = data;

  const steps = [0, 100, 200, 500];
  const barheight = 25;
  const maxvalue = Math.max(0, EPtotal, EPnren, EPren);
  const minvalue = Math.min(0, EPtotal, EPnren, EPren);
  const maxlimit = Math.max(100, steps.find(v => v >= maxvalue) || maxvalue);
  const minlimit = Math.min(0, -steps.find(v => -v <= minvalue) || minvalue);
  const pos0 = -minlimit;
  const textw = 70;
  const vbw = textw + maxlimit - minlimit + 20;
  const vbh = 4 * barheight;

  const bars = [
    { label: "EP_total", value: EPtotal, color: "blue" },
    { label: "EP_nren", value: EPnren, color: "red" },
    { label: "EP_ren", value: EPren, color: "green" }
  ];

  const Bars = bars.map((el, i) => (
    <g className="bar" height={ barheight } key={ `${el.label}_bar` }>
      <rect width={ Math.abs(el.value) } height={ barheight - 3 }
        x={ Math.min(pos0, pos0 + el.value) } y={ i * barheight }
        fill={ el.color } fillOpacity="0.7" />
      <text x={ -textw + 5 } y={ (i + 0.5) * barheight }
        dominantBaseline="middle" fill="#555">{ el.label }</text>
      <text x={ Math.min(pos0, pos0 + el.value) + 5 } y={ (i + 0.5) * barheight }
        dominantBaseline="middle" fill="white" fontWeight="bold">
        { (el.value).toFixed(2) }</text>
      <title>{ el.label }: { (el.value).toFixed(2) } kWh/m²·año</title>
    </g>
  ));

  const LimitAxis = [minlimit, 0, maxlimit].map((v, i) => (
    <g key={ `limitaxis_${i}` }>
      <line x1={ pos0 + v } y1="0" x2={ pos0 + v } y2="75" strokeWidth="1" stroke="#333" />
      <text x={ pos0 + v } y="90" textAnchor="middle" fill="#333">{ v.toFixed(0) }</text>
    </g>
  ));

  const gridstep = Math.max(maxlimit / 10, -minlimit / 10, 25);
  const gridposmax = Array.from(Array(9), (v, i) => (i + 1) * gridstep).filter(v => v < maxlimit);
  const gridposmin = Array.from(Array(9), (v, i) => -(i + 1) * gridstep).filter(v => v > minlimit);
  const GridLines = gridposmin.concat(gridposmax).map((v, i) =>(
    <g key={`gridline_${i}`}>
      <line x1={ pos0 + v } y1="0" x2={ pos0 + v } y2="75"
        strokeWidth="0.5" stroke="#333" strokeDasharray="2,3" />
        <text x={ pos0 + v } y="90"
          textAnchor="middle" fill="#555" fontSize="10px">{ v.toFixed(0) }</text>
    </g>
  ));

  return (
    <div width={ width } height={ height }
      style={{
        backgroundColor: "rgb(70, 130, 180, 0.3)",
        textAlign: "center", font: "14px sans-serif", fontWeight: "normal"
      }}>
      <p style={{ fontSize: "16px", fontWeight: "bold", fill: "#444" }}>
        Consumo de energía primaria [kWh/m²·año]
      </p>
      <p>(k_exp: { kexp.toFixed(2) }, RER: { EPrer.toFixed(2) })</p>
      <svg width="100%" height="100px" className={ className }
        preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${ vbw } ${ vbh }`}
        style={{
          display: props.display || "inline-block",
          padding: props.padding || 0,
          font: "12px sans-serif"
        }}>
        <title id="title" fill="black">
          Consumo de energía primaria (k_exp: { kexp.toFixed(2) }, RER: { EPrer.toFixed(2) })
        </title>
        <desc id="desc">EP_total: { EPtotal.toFixed(2) }, EP_nren: { EPnren.toFixed(2) }, EP_ren: { EPren.toFixed(2) }</desc>
        <g transform={`translate(${ textw },0)`}>
          { LimitAxis }
          { GridLines }
          { Bars }
        </g>
      </svg>
    </div>
  )
};
export default EPChart;
  