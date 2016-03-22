import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import 'd3';
import dimple from 'dimple-js/dist/dimple.latest.js';


export default class Graphics extends React.Component {

  componentDidMount () {
    this.updateChart();
  }

  shouldComponentUpdate() {
      this.updateChart();
  }

  updateChart(node) {
    var data = [
      { "Mes":"Hello", "Energía":2000 },
      { "Mes":"World", "Energía":3000 }
    ];

    const svg = dimple.newSvg(this.refs.chartbox, "100%", "100%");

    svg.append("text")
       .attr("x","50%")
       .attr("y","10%")
       .style("fill","black")
       .style("font-family","serif")
       .style("font-size","15px")
       .text("Bars and Lines!");

    const chart = new dimple.chart(svg, data)
                            .setMargins("20px", "20px",
                                        "20px", "20px");
    chart.addCategoryAxis("x", "Mes");
    chart.addMeasureAxis("y", "Energía");
    chart.addSeries("mySerie", dimple.plot.bar);
    chart.draw();

    return chart;
  }

  render() {
    var styles = {width: this.props.width || "100%",
                  height: this.props.height || "200px"};
    return <div ref="chartbox" style={styles} />;
  }

}

export class ComponentChart extends React.Component {

  chart = null
  yaxis = null

  state = {
    data: this.props.values.map(
      (value, i) => { return {"Mes": i, "Valor": value};}
    )
  }

  componentDidMount() {
    let node = ReactDOM.findDOMNode(this);
    const svg = dimple.newSvg(node, "100%", "100%");
    const chart = new dimple.chart(svg, this.state.data).setMargins("1", "1", "1", "1");
    const x = chart.addCategoryAxis("x", "Mes");
    x.hidden = true;
    this.yaxis = chart.addMeasureAxis("y", "Valor");
    this.yaxis.hidden = true;
    this.yaxis.overrideMax = this.props.maxvalue;
    chart.addSeries(null,dimple.plot.bar).barGap = 0;
    chart.defaultColors = [
      this.props.type === 'Suministro' ? new dimple.color("red") : new dimple.color("green")
    ];
    chart.draw();
    this.chart = chart;
  }

  componentDidUpdate() {
    this.chart.data = this.state.data;
    this.yaxis.overrideMax = this.props.maxvalue;
    this.chart.draw();
  }

  render() {
    var styles = {width: "200px",
                  height: "20px"};
    return <div style={styles} />;
  }

}
