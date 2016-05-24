import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import d3 from 'd3';
import dimple from 'dimple';
import $ from 'jquery';
import _ from 'lodash';
import numeral from 'numeral';

function buildDataA(values) {
  return [
    { Componente: 'EP_nren', 'kWh/m²·año': values.EPnren },
    { Componente: 'EP_ren', 'kWh/m²·año': values.EPren },
    { Componente: 'EP_total', 'kWh/m²·año': values.EPtotal },
  ];
}

// Indicators Chart for step A
export class IChartA extends React.Component {

  static defaultProps = { width: '50%', height: '100%' }

  static chart = null

  createChart() {
    const svg = d3.select(ReactDOM.findDOMNode(this.refs.chartsvg));

    svg.append('text').attr('x', '50%').attr('y', '15px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black').style('font-size', '15px')
       .text('Consumo de energía primaria (Paso A)');

    const c = new dimple.chart(svg, buildDataA(this.props.data));
    c.setMargins('50px', '50px', '20px', '45px'); // left, top, right, bottom
    this.chart = c;

    c.defaultColors = [new dimple.color('blue'),
                       new dimple.color('red'),
                       new dimple.color('green')];

    c.addCategoryAxis('x', 'Componente');
    c.addMeasureAxis('y', 'kWh/m²·año');
    const s = c.addSeries('Componente', dimple.plot.bar);
    s.addOrderRule(['EP_total', 'EP_nren', 'EP_ren']);
    c.addLegend('0%', '90%', '100%', '50%', 'right');
    c.ease = 'linear';
  }

  drawChart(props) {
    const { kexp, krdel, data } = props;

    const cData = buildDataA(data);

    const chart = this.chart;
    const x = chart.axes[0];
    const y = chart.axes[1];
    const svg = this.chart.svg;

    y.overrideMax = props.max;
    y.overrideMin = props.min;

    // Subtitle
    svg.select('#subtitle').remove();
    svg.append('text')
       .attr('id', 'subtitle')
       .attr('x', '50%').attr('y', '30px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black')
       .style('font-size', '12px')
       .text('kexp: ' + numeral(kexp).format('0.0') +
             ', krdel: ' + numeral(krdel).format('0.0'));
    // Subsubtitle
    svg.select('#subsubtitle').remove();
    svg.append('text')
       .attr('id', 'subsubtitle')
       .attr('x', '50%').attr('y', '45px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black')
       .style('font-size', '12px')
       .html('RER(A): ' + numeral(this.props.rer).format('0.00'));

    // Draw so geometry properties are available to compute tooltips
    this.chart.data = cData;
    chart.draw(100);

    // Tooltips
    const chartheight = parseInt(chart.svg.style("height"), 10);
    const chartwidth = parseInt(chart.svg.style("width"), 10);
    const charty = parseInt(chart.y, 10);

    svg.selectAll('text.ylabel').remove();
    const s = chart.series[0];
    s.shapes.each(function(d) {
      const rect = this; // Get the shape as a d3 selection
      const rx = parseFloat(rect.x.animVal.value);
      const rwidth = parseFloat(rect.width.animVal.value);
      const posx = x._scale(d.x) + (1 + d.xOffset) * rwidth + d.xOffset * rwidth * s.barGap / 2;
      const posy = y._scale(d.yValue) - 6;
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
  }

  render() {
    return (<svg ref='chartsvg'
                 width={ this.props.width }
                 height={ this.props.height }
                 style={ {overflow: 'visible'} } />);
  }
}

function buildDataAB(values) {
  return [
    { Componente: 'EP_nren', 'kWh/m²·año': values.EPnren },
    { Componente: 'EP_ren', 'kWh/m²·año': values.EPren },
    { Componente: 'EP_total', 'kWh/m²·año': values.EPtotal },
  ];
}

// Indicators Chart for step A+B
export class IChartAB extends React.Component {

  static defaultProps = { width: '50%', height: '100%' }

  static chart = null

  createChart() {
    const svg = d3.select(ReactDOM.findDOMNode(this.refs.chartsvg));

    svg.append('text').attr('x', '50%').attr('y', '15px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black').style('font-size', '15px')
       .text('Consumo de energía primaria (Paso A+B)');

    const c = new dimple.chart(svg, buildDataAB(this.props.data));
    c.setMargins('50px', '50px', '20px', '45px'); // left, top, right, bottom
    this.chart = c;

    c.defaultColors = [new dimple.color('blue'),
                       new dimple.color('red'),
                       new dimple.color('green')];

    c.addCategoryAxis('x', 'Componente');
    c.addMeasureAxis('y', 'kWh/m²·año');
    const s = c.addSeries('Componente', dimple.plot.bar);
    s.addOrderRule(['EP_total', 'EP_nren', 'EP_ren']);
    c.addLegend('0%', '90%', '100%', '50%', 'right');
    c.ease = 'linear';
  }

  drawChart(props) {
    const { kexp, krdel, data } = props;

    const cData = buildDataAB(data);

    const chart = this.chart;
    const x = chart.axes[0];
    const y = chart.axes[1];
    const svg = this.chart.svg;

    y.overrideMax = props.max;
    y.overrideMin = props.min;

    // Subtitle
    svg.select('#subtitle').remove();
    svg.append('text')
       .attr('id', 'subtitle')
       .attr('x', '50%').attr('y', '30px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black')
       .style('font-size', '12px')
       .text('kexp: ' + numeral(kexp).format('0.0') +
             ', krdel: ' + numeral(krdel).format('0.0'));
    // Subsubtitle
    svg.select('#subsubtitle').remove();
    svg.append('text')
       .attr('id', 'subsubtitle')
       .attr('x', '50%').attr('y', '45px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black')
       .style('font-size', '12px')
       .html('RER(A+B): ' + numeral(this.props.rer).format('0.00'));

    // Draw so geometry properties are available to compute tooltips
    this.chart.data = cData;
    chart.draw(100);

    // Tooltips
    const chartheight = parseInt(chart.svg.style("height"), 10);
    const chartwidth = parseInt(chart.svg.style("width"), 10);
    const charty = parseInt(chart.y, 10);

    svg.selectAll('text.ylabel').remove();
    const s = chart.series[0];
    s.shapes.each(function(d) {
      const rect = this; // Get the shape as a d3 selection
      const rx = parseFloat(rect.x.animVal.value);
      const rwidth = parseFloat(rect.width.animVal.value);
      const posx = x._scale(d.x) + (1 + d.xOffset) * rwidth + d.xOffset * rwidth * s.barGap / 2;
      const posy = y._scale(d.yValue) - 6;
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
  }

  render() {
    return (<svg ref='chartsvg'
                 width={ this.props.width }
                 height={ this.props.height }
                 style={ {overflow: 'visible'} } />);
  }
}


