import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import d3 from 'd3';
import dimple from 'dimple';

export default class EnergyComponentChart extends React.Component {

  static propTypes = {
    ctype: React.PropTypes.string.isRequired,
    maxvalue: React.PropTypes.number.isRequired,
    data: React.PropTypes.array.isRequired
  }

  static defaultProps = { width: '200px',
                          height: '20px',
                          display:'inline-block',
                          padding:'0 0 0 12px',
                          className:'' }

  drawChart(node, props) {
    const { data, maxvalue, ctype } = props;

    d3.select(node).select('svg').remove();
    const svg = d3.select(node).append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .style('overflow', 'visible');
    const c = new dimple.chart(svg, data)
                        .setMargins('1', '1', '1', '1');

    const csum = new dimple.color('blue');
    const cprod = new dimple.color('gray');
    c.defaultColors = [ctype === 'CONSUMO' ? csum : cprod];

    const xaxis = c.addCategoryAxis('x', 'Mes');
    const yaxis = c.addMeasureAxis('y', 'Valor');
    xaxis.hidden = true;
    yaxis.hidden = true;
    yaxis.overrideMax = maxvalue;

    const mySeries = c.addSeries(null, dimple.plot.bar);
    mySeries.barGap = 0;
    mySeries.getTooltipText = (e) => [e.yValue];

    c.ease = 'linear';
    c.draw(400);

    this.chart = c;
  }

  updateChart(props) {
    //const node = ReactDOM.findDOMNode(this);
    this.chart.data = props.data;
    this.chart.axes[1].overrideMax = props.maxvalue;
    this.chart.draw(400);
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.drawChart(node, this.props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.data !== this.props.data ||
        nextProps.maxvalue !== this.props.maxvalue) {
          this.updateChart(nextProps);
    }
    return false;
  }

  render() {
    return (<div style={ { width: this.props.width,
                           height: this.props.height,
                           display: this.props.display,
                           padding: this.props.padding,
                           className: this.props.className } }></div>);
  }

}
