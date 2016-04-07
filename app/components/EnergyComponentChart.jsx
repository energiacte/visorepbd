import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import 'd3';
import dimple from 'dimple';

export default class EnergyComponentChart extends React.Component {

  static propTypes = {
    ctype: React.PropTypes.string.isRequired,
    maxvalue: React.PropTypes.number.isRequired,
    data: React.PropTypes.array.isRequired
  }

  static defaultProps =  {width: "200px",
                          height: "20px"}

  drawChart(node, props) {
    const { data, maxvalue, ctype } = props;

    d3.select(node).select("svg").remove();
    var svg = d3.select(node).append('svg')
                .attr("width", "100%")
                .attr("height", "100%")
                .style("overflow", "visible");
    const c = new dimple.chart(svg, data)
                        .setMargins("1", "1", "1", "1");

    const csum = new dimple.color("gray");
    const cprod = new dimple.color("blue");
    c.defaultColors = [ctype === 'SUMINISTRO' ?  csum : cprod];

    const xaxis = c.addCategoryAxis("x", "Mes");
    const yaxis = c.addMeasureAxis("y", "Valor");
    xaxis.hidden = true;
    yaxis.hidden = true;
    yaxis.overrideMax = maxvalue;

    const mySeries = c.addSeries(null, dimple.plot.bar);
    mySeries.barGap = 0;
    mySeries.getTooltipText = (e) => [e.yValue];

    c.ease = "linear";
    c.draw(200);
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.drawChart(node, this.props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.data != this.props.data |
        nextProps.maxvalue != this.props.maxvalue) {
          const node = ReactDOM.findDOMNode(this);
          this.drawChart(node, nextProps);
    }
    return false;
  }

  render() {
    return <div style={ {width: this.props.width,
                         height: this.props.height} }></div>;
  }

}
