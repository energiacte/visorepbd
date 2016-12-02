import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import d3 from 'd3';
import dimple from 'dimple';

function buildDataA(values) {
  return [
    { Componente: 'EP_total', 'kWh/m²·año': values.EPAtotal, Order: 1 },
    { Componente: 'EP_nren', 'kWh/m²·año': values.EPAnren, Order: 2 },
    { Componente: 'EP_ren', 'kWh/m²·año': values.EPAren, Order: 3 }
  ];
}

// Indicators Chart for step A
export class IChartA extends React.Component {

  static defaultProps = { width: '50%', height: '100%' }

  static chart = null

  createChart() {
    const svg = d3.select(ReactDOM.findDOMNode(this.refs.chartsvg));
    const c = new dimple.chart(svg, buildDataA(this.props.data));
    this.chart = c;

    c.setMargins('50px', '50px', '20px', '45px'); // left, top, right, bottom
    c.addCategoryAxis('x', 'Componente')
     .addOrderRule('Order');
    c.addMeasureAxis('y', 'kWh/m²·año');
    c.addSeries('Componente', dimple.plot.bar)
     .addOrderRule(['EP_ren', 'EP_nren', 'EP_total']);
    c.assignColor('EP_total', 'blue');
    c.assignColor('EP_nren', 'red');
    c.assignColor('EP_ren', 'green');
    c.ease = 'linear';
  }

  drawChart(props) {
    const { kexp, krdel, data } = props;

    const cData = buildDataA(data);

    const chart = this.chart;
    const x = chart.axes[0];
    const y = chart.axes[1];
    const svg = chart.svg;

    y.overrideMax = props.max;
    y.overrideMin = props.min;

    // Subtitle
    svg.select('text#subtitle')
       .text('kexp: ' + kexp.toFixed(1) +
             ', krdel: ' + krdel.toFixed(1));
    // Subsubtitle
    svg.select('text#subsubtitle')
       .html('RER(A): ' + data.EPArer.toFixed(2));

    // Draw so geometry properties are available to compute tooltips
    this.chart.data = cData;
    chart.draw(100);

    // Tooltips
    svg.selectAll('text.ylabel').remove();
    const s = chart.series[0];
    s.shapes.each(function(d) {
      const rect = this; // Get the shape as a d3 selection
      const rx = parseFloat(rect.x.animVal.value);
      const rwidth = parseFloat(rect.width.animVal.value);
      const posx = x._scale(d.x) + (1 + d.xOffset) * rwidth + d.xOffset * rwidth * s.barGap / 2;
      const yoffset = d.yValue > 0 ? -6 : 16;
      const posy = y._scale(d.yValue) + yoffset;
      // Add a text label for the value
      svg.append("text")
         .attr("class", "ylabel")
         .attr("x", posx)
         .attr("y", posy)
         .style("text-anchor", "middle")
         .style("font-size", "10px")
         .style("font-family", "sans-serif")
         .style("opacity", 0.7)
         .text(d3.format(",.2f")(d.yValue));
    });

  }

  componentDidMount() {
    this.createChart();
    this.drawChart(this.props);
  }

  shouldComponentUpdate(nextProps) {
    this.drawChart(nextProps);
    return false;
  }

  render() {
    return (
      <svg ref='chartsvg'
           width={ this.props.width }
           height={ this.props.height }
           style={ {overflow: 'visible'} }>
        <text id='title' x='50%' y='15px'
              fill='black' textAnchor='middle' fontSize='15px'>
          Consumo de energía primaria (Paso A)
        </text>
        <text id='subtitle' x='50%' y='30px'
              fill='black' textAnchor='middle' fontSize='12px' />
        <text id='subsubtitle' x='50%' y='45px'
              fill='black' textAnchor='middle' fontSize='12px' />
</svg>);
  }
}

function buildDataAB(values) {
  return [
    { Componente: 'EP_total', 'kWh/m²·año': values.EPtotal, Order: 1 },
    { Componente: 'EP_nren', 'kWh/m²·año': values.EPnren, Order: 2 },
    { Componente: 'EP_ren', 'kWh/m²·año': values.EPren, Order: 3 }
  ];
}

// Indicators Chart for step A+B
export class IChartAB extends React.Component {

  static defaultProps = { width: '50%', height: '100%' }

  static chart = null

  createChart() {
    const svg = d3.select(ReactDOM.findDOMNode(this.refs.chartsvg));
    const c = new dimple.chart(svg, buildDataAB(this.props.data));
    this.chart = c;

    c.setMargins('50px', '50px', '20px', '45px') // left, top, right, bottom
    c.addCategoryAxis('x', 'Componente')
     .addOrderRule('Order');
    c.addMeasureAxis('y', 'kWh/m²·año');
    c.addSeries('Componente', dimple.plot.bar)
     .addOrderRule(['EP_ren', 'EP_nren', 'EP_total']);
    c.assignColor('EP_total', 'blue');
    c.assignColor('EP_nren', 'red');
    c.assignColor('EP_ren', 'green');
    c.ease = 'linear';
  }

  drawChart(props) {
    const { kexp, krdel, data } = props;

    const cData = buildDataAB(data);

    const chart = this.chart;
    const x = chart.axes[0];
    const y = chart.axes[1];
    const svg = chart.svg;

    y.overrideMax = props.max;
    y.overrideMin = props.min;

    // Subtitle
    svg.select('text#subtitle')
       .text('kexp: ' + kexp.toFixed(1) +
             ', krdel: ' + krdel.toFixed(1));
    // Subsubtitle
    svg.select('text#subsubtitle')
       .html('RER(A+B): ' + data.EPrer.toFixed(2));

    // Draw so geometry properties are available to compute tooltips
    this.chart.data = cData;
    chart.draw(100);

    // Tooltips
    svg.selectAll('text.ylabel').remove();
    const s = chart.series[0];
    s.shapes.each(function(d) {
      const rect = this; // Get the shape as a d3 selection
      const rx = parseFloat(rect.x.animVal.value);
      const rwidth = parseFloat(rect.width.animVal.value);
      const posx = x._scale(d.x) + (1 + d.xOffset) * rwidth + d.xOffset * rwidth * s.barGap / 2;
      const yoffset = d.yValue > 0 ? -6 : 16;
      const posy = y._scale(d.yValue) + yoffset;
      // Add a text label for the value
      svg.append("text")
         .attr("class", "ylabel")
         .attr("x", posx)
         .attr("y", posy)
         .style("text-anchor", "middle")
         .style("font-size", "10px")
         .style("font-family", "sans-serif")
         .style("opacity", 0.7)
         .text(d3.format(",.2f")(d.yValue));
    });

  }

  componentDidMount() {
    this.createChart();
    this.drawChart(this.props);
  }

  shouldComponentUpdate(nextProps) {
    this.drawChart(nextProps);
    return false;
  }

  render() {
    return (
      <svg ref='chartsvg'
      width={ this.props.width }
      height={ this.props.height }
      style={ {overflow: 'visible'} }>
      <text id='title' x='50%' y='15px'
            fill='black' textAnchor='middle' fontSize='15px'>
        Consumo de energía primaria (Paso A+B)
      </text>
      <text id='subtitle' x='50%' y='30px'
            fill='black' textAnchor='middle' fontSize='12px' />
      <text id='subsubtitle' x='50%' y='45px'
            fill='black' textAnchor='middle' fontSize='12px' />
      </svg>);
  }
}


