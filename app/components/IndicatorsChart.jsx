import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import 'd3';
import dimple from 'dimple';


export default class IndicatorsChart extends React.Component {

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

