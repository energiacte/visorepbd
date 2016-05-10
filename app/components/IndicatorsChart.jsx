import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import d3 from 'd3';
import dimple from 'dimple';
import $ from 'jquery';
import _ from 'lodash';
import numeral from 'numeral';

function buildData(values) {
    let v = (values === null) ? { EPAnren: 0, EPAren: 0, EPAtotal: 0,
                                  EPnren: 0, EPren: 0, EPtotal: 0 } : values;
    return [
      { Paso: 'A', Componente: 'EP_nren', 'kWh/m²·año': v.EPAnren },
      { Paso: 'A', Componente: 'EP_ren', 'kWh/m²·año': v.EPAren },
      { Paso: 'A', Componente: 'EP_total', 'kWh/m²·año': v.EPAtotal },
      { Paso: 'A+B', Componente: 'EP_nren', 'kWh/m²·año': v.EPnren },
      { Paso: 'A+B', Componente: 'EP_ren', 'kWh/m²·año': v.EPAren },
      { Paso: 'A+B', Componente: 'EP_total', 'kWh/m²·año': v.EPtotal }
    ];
}

class IndicatorsChart extends React.Component {

  static defaultProps = { width: '50%', height: '200px' }

  static chart = null

  updateChart(props) {
    const { kexp, krdel, components } = props;
    const activecomponents = components.filter(
      (component) => { return component.active; }
    );

    let data = {};
    let subtitle = {};

    $.ajax({
      // document.location.host = host + port
      url: 'http://' + document.location.host + __EPBDURLPREFIX__ + '/epindicators',
      method: 'POST', // http method
      dataType: 'json',
      data: JSON.stringify({ kexp: kexp, krdel: krdel, components: activecomponents }),
      crossDomain: false // needed so request.is_ajax works
      })
      .done((json) => {
        data = buildData(json);
        subtitle = { kexp, krdel, EPArer: json.EPArer, EPrer: json.EPrer, error: false };
        this.chart.data = data;
        this.fixscale(data);
        this.chart.draw(100);
        this.drawSubtitle(subtitle);
      })
      .fail((xhr, errmsg, err) => {
        console.log(xhr.status + ': ' + xhr.responseText);
        data = buildData(null);
        subtitle = { kexp, krdel, EPArer: 0, EPrer: 0, error: true };
        this.fixscale(data);
        this.chart.draw(100);
        this.drawSubtitle(subtitle);
      });
  }

  fixscale(data) {
    const max = _.max(_.map(data, 'kWh/m²·año'));
    const step = (Math.abs(max) > 100) ? 100 : 10;
    const y = this.chart.axes[1];

    y.overrideMax = Math.round(max / step) * step;
    y.overrideMin = 0.0;
  }

  drawSubtitle(params) {
    const { kexp, krdel, EPrer, EPArer, error } = params;
    const svg = this.chart.svg;

    svg.select('#subtitle').remove();
    svg.append('text')
       .attr('id', 'subtitle')
       .attr('x', '50%').attr('y', '30px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black')
       .style('font-size', '12px')
       .text('kexp: ' + numeral(kexp).format('0.0') +
             ', krdel: ' + numeral(krdel).format('0.0'));
    svg.select('#subsubtitle').remove();
    const errortxt = error ? ' ERROR al conectar con el servidor!' : '';
    svg.append('text')
       .attr('id', 'subsubtitle')
       .attr('x', '50%').attr('y', '45px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black')
       .style('font-size', '12px')
       .html('RER(A): ' + numeral(EPArer).format('0.00') +
             ', RER(A+B): ' + numeral(EPrer).format('0.00') +
             errortxt);
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);

    const svg = d3.select(node).append('svg')
                  .attr('width', '100%')
                  .attr('height', '100%')
                  .style('overflow', 'visible');

    svg.append('text').attr('x', '50%').attr('y', '15px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black').style('font-size', '15px')
       .text('Consumo de energía primaria');

    const c = new dimple.chart(svg, buildData(null));
    c.setMargins('50px', '50px', '20px', '45px'); // left, top, right, bottom
    this.chart = c;
    this.drawSubtitle({ krdel: 1.0, kexp: 1.0 });

    c.defaultColors = [new dimple.color('blue'),
                       new dimple.color('red'),
                       new dimple.color('green')];

    c.addCategoryAxis('x', ['Paso', 'Componente']);
    c.addMeasureAxis('y', 'kWh/m²·año');
    const s = c.addSeries('Componente', dimple.plot.bar);
    s.addOrderRule(['EP_total', 'EP_nren', 'EP_ren']);
    c.addLegend('0%', '90%', '100%', '50%', 'right');
    c.ease = 'linear';

    this.updateChart(this.props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.components !== this.props.components |
        nextProps.krdel !== this.props.krdel |
        nextProps.kexp !== this.props.kexp) {
          this.updateChart(nextProps);
    }
    return false;
  }

  render() {
    return (<div style={ { width: this.props.width,
                           height: this.props.height } } />);
  }

}

export default IndicatorsChart = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel,
    components: state.components
  };
})(IndicatorsChart);

