import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import numeral from 'numeral';
import d3 from 'd3';
import dimple from 'dimple';

class IndicatorsChart extends React.Component {

  static defaultProps = {
    width: "100%",
    height: "200px"
  }

  static chart = null

  getData(props) {
    const { kexp, krdel, components } = props;

    var data = [
      {Paso: "A", Componente: "no renovable", "kWh/m²·año": 12.0 * kexp},
      {Paso: "A", Componente: "renovable", "kWh/m²·año": 23.0 * krdel},
      {Paso: "A+B", Componente: "no renovable", "kWh/m²·año": 10.0 + 3 * components.length},
      {Paso: "A+B", Componente: "renovable", "kWh/m²·año": 23.0},
    ];
    return data;
  }

  drawSubtitle(props) {
    const { kexp, krdel } = props;
    const svg = this.chart.svg;

    svg.select("#subtitle").remove();
    svg.append("text")
       .attr("id", "subtitle")
       .attr("x","50%").attr("y","10%")
       .attr("text-anchor", "middle")
       .style("fill","black")
       .style("font-size","12px")
       .text('kexp: '+ numeral(kexp).format('0.0') +
             ', krdel: ' + numeral(krdel).format('0.0') );
  }

  drawChart(node, props) {
    const svg = d3.select(node).append('svg')
                  .attr("width", "100%")
                  .attr("height", "100%")
                  .style("overflow", "visible");

    svg.append("text").attr("x","50%").attr("y","0%")
       .attr("text-anchor", "middle")
       .style("fill","black").style("font-size","15px")
       .text("Consumo de energía primaria");

    const c = new dimple.chart(svg, this.getData(props))
                        .setMargins("20px", "30px",
                                    "20px", "45px");
    this.chart = c;
    this.drawSubtitle(props);

    c.defaultColors = [new dimple.color("green"),
                       new dimple.color("red")];

    c.addCategoryAxis("x", "Paso");
    c.addMeasureAxis("y", "kWh/m²·año");
    c.addSeries("Componente", dimple.plot.bar)
     .addOrderRule(["no renovable", "renovable"]);
    c.addLegend('0%', '100%', '100%', '50%', "right");

    c.ease = "linear";
    c.draw(800);
  }

  componentDidMount () {
    var node = ReactDOM.findDOMNode(this);
    this.drawChart(node, this.props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.components != this.props.components |
        nextProps.krdel != this.props.krdel |
        nextProps.kexp != this.props.kexp) {
          var data = this.getData(nextProps);
          this.chart.data = data;
          this.chart.draw(800);
          this.drawSubtitle(nextProps);
    }
    return false;
  }

  render() {
    return <div style={ {width: this.props.width,
                         height: this.props.height} } />;
  }

}

export default IndicatorsChart = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel,
    components: state.components
  }
})(IndicatorsChart);

