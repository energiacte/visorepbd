import React from 'react';

// Gráfico SVG de barras para eficiencia energética
export default class EPChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: 0 };
  }

  updateDimensions() {
    const width = this.divElement.clientWidth || this.divElement.parentNode.clientWidth;
    this.setState({ width });
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    const {
      width = "100%", height = "135px",
      display = "inline-block", padding = 0,
      className = null, data, kexp
    } = this.props;
    const { ren, nren, total, rer, rer_acs_nrb } = data;
    const svgwidth = this.state.width;

    const steps = [0, 50, 100, 200, 300];
    const barheight = 25;
    const maxvalue = Math.max(0, total, ren, nren);
    const minvalue = Math.min(0, total, ren, nren);
    const maxlimit = Math.max(steps[1], steps.find(v => v >= maxvalue) || maxvalue);
    const minlimit = Math.min(0, -steps.find(v => -v <= minvalue) || minvalue);
    const textw = 70; // text area width
    const paddingw = 10; // left and right padding width
    // View size
    // const vbw = 2 * paddingw + textw + (maxlimit - minlimit);
    const vbh = 4 * barheight;
    // Plot area size
    const plotw = svgwidth - textw - 2 * paddingw; // plot area width
    // Cambia de dominio, de [minlimit, maxlimit] a [0, plotw]
    const x = x0 => (x0 - minlimit) / (maxlimit - minlimit) * (plotw);

    const LimitAxis = [minlimit, 0, maxlimit].map((v, i) => (
      <g key={ `limitaxis_${ i }` }>
        <line x1={ x(v) } y1="0" x2={ x(v) } y2="75" strokeWidth="1" stroke="#333" />
        <text x={ x(v) } y="90" textAnchor="middle" fill="#333">{ v.toFixed(0) }</text>
      </g>
    ));

    const gridstep = Math.max(maxlimit / 10, -minlimit / 10, 25);
    const gridposmax = Array.from(Array(9), (v, i) => (i + 1) * gridstep).filter(v => v < maxlimit);
    const gridposmin = Array.from(Array(9), (v, i) => -(i + 1) * gridstep).filter(v => v > minlimit);
    const GridLines = gridposmin.concat(gridposmax).map((v, i) => (
      <g key={ `gridline_${ i }` }>
        <line x1={ x(v) } y1="0" x2={ x(v) } y2="75"
          strokeWidth="0.5" stroke="#333" strokeDasharray="2,3" />
        <text x={ x(v) } y="90"
          textAnchor="middle" fill="#555" fontSize="10px">{ v.toFixed(0) }</text>
      </g>
    ));

    const Bars = [
      { label: "EP_total", value: total, color: "blue" },
      { label: "EP_nren", value: nren, color: "red" },
      { label: "EP_ren", value: ren, color: "green" }
    ].map((el, i) => (
      <g className="bar" height={ barheight } key={`${ el.label }_bar`}>
        <rect width={ x(Math.abs(el.value)) - x(0) } height={ barheight - 3 }
          x={ x(Math.min(0, el.value)) } y={ i * barheight }
          fill={ el.color } fillOpacity="0.7" />
        <text x={ -textw + paddingw } y={ (i + 0.5) * barheight }
          dominantBaseline="middle" fill="#555">{ el.label }</text>
        <text x={ x(Math.min(0, el.value) + 5) } y={ (i + 0.5) * barheight }
          dominantBaseline="middle" fill="white" fontWeight="bold">
          { (el.value).toFixed(2) }</text>
        <title>{ el.label }: { (el.value).toFixed(2) } kWh/m²·año</title>
      </g>
    ));

    return (
      <div width={ width } height={ height }
        ref={ (svgElement) => this.divElement = svgElement }
        style={{
          backgroundColor: "rgb(70, 130, 180, 0.3)",
          textAlign: "center", font: "14px sans-serif", fontWeight: "normal"
        }}>
        <p style={{ fontSize: "16px", fontWeight: "bold", fill: "#444" }}>
          Consumo de energía primaria [kWh/m²·año]
        </p>
        <p>(k_exp: { kexp.toFixed(2) }, RER: { rer.toFixed(2) }, RER<sub>ACS;nrb</sub>: { rer_acs_nrb.toFixed(2) })</p>
        <svg width={ svgwidth } height={ 4 * barheight } className={ className }
          preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${ svgwidth } ${ vbh }`}
          style={{ display, padding, font: "12px sans-serif" }}>
          <title id="title" fill="black">
            Consumo de energía primaria (k_exp: { kexp.toFixed(2) }, RER: { rer.toFixed(2) })
          </title>
          <desc id="desc">EP_total: { total.toFixed(2) }, EP_nren: { nren.toFixed(2) }, EP_ren: { ren.toFixed(2) }</desc>
          <g transform={`translate(${ textw },0)`}>
            { LimitAxis }
            { GridLines }
            { Bars }
          </g>
        </svg>
      </div>
    )
  }
}
  