import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import d3 from 'd3';
import dimple from 'dimple';
import $ from 'jquery';
import _ from 'lodash';
import numeral from 'numeral';

function buildCData(values) {
    let v = (values === null) ? { EPAnren: 0, EPAren: 0, EPAtotal: 0,
                                  EPnren: 0, EPren: 0, EPtotal: 0 } : values;
    return [
      { Paso: 'A', Componente: 'EP_nren', 'kWh/m²·año': v.EPAnren },
      { Paso: 'A', Componente: 'EP_ren', 'kWh/m²·año': v.EPAren },
      { Paso: 'A', Componente: 'EP_total', 'kWh/m²·año': v.EPAtotal },
      { Paso: 'A+B', Componente: 'EP_nren', 'kWh/m²·año': v.EPnren },
      { Paso: 'A+B', Componente: 'EP_ren', 'kWh/m²·año': v.EPren },
      { Paso: 'A+B', Componente: 'EP_total', 'kWh/m²·año': v.EPtotal }
    ];
}

class IndicatorsChart extends React.Component {

  static defaultProps = { width: '50%', height: '200px' }

  static chart = null

  constructor() {
    super();
    this.state = { data: null };
  }

  loadData(props) {
    const { kexp, krdel, components } = props;
    const activecomponents = components.filter(
      (component) => { return component.active; }
    );

    $.ajax({
      // document.location.host = host + port
      url: 'http://' + document.location.host + __EPBDURLPREFIX__ + '/epindicators',
      method: 'POST', // http method
      dataType: 'json',
      data: JSON.stringify({ kexp: kexp, krdel: krdel, components: activecomponents }),
      crossDomain: false // needed so request.is_ajax works
    })
     .done((json) => this.setState({ data: json }))
     .fail((xhr, errmsg, err) => {
       console.log(xhr.status + ': ' + xhr.responseText);
       this.setState({ data: null });
     })
     .always(() => {
       const cData = buildCData(this.state.data);
       // TODO: Crear componentes que reciben this.state.data como prop, junto con kexp, krdel, etc...
       // y ya no hay que hacer esto y lo podemos separar todo mejor
       // pensar cómo es el redibujado
       this.chart.data = cData;
       this.redrawChart(cData);
     }
     );
  }

  createChart() {
    const svg = d3.select(ReactDOM.findDOMNode(this.refs.chartsvg));

    svg.append('text').attr('x', '50%').attr('y', '15px')
       .attr('text-anchor', 'middle')
       .style('fill', 'black').style('font-size', '15px')
       .text('Consumo de energía primaria');

    const c = new dimple.chart(svg, buildCData(null));
    c.setMargins('50px', '50px', '20px', '45px'); // left, top, right, bottom
    this.chart = c;

    c.defaultColors = [new dimple.color('blue'),
                       new dimple.color('red'),
                       new dimple.color('green')];

    c.addCategoryAxis('x', ['Paso', 'Componente']);
    c.addMeasureAxis('y', 'kWh/m²·año');
    const s = c.addSeries('Componente', dimple.plot.bar);
    s.addOrderRule(['EP_total', 'EP_nren', 'EP_ren']);
    c.addLegend('0%', '90%', '100%', '50%', 'right');
    c.ease = 'linear';
  }

  redrawChart(data) {
    const { kexp, krdel } = this.props;

    let EPArer = 0,
        EPrer = 0,
        error = true;
    if (this.state.data !== null) {
      EPArer = this.state.data.EPArer,
      EPrer = this.state.data.EPrer,
      error = false;
    }

    const chart = this.chart;
    const x = chart.axes[0];
    const y = chart.axes[1];
    const svg = this.chart.svg;
    const values = _.map(data, 'kWh/m²·año');

    const max = _.max(values);
    const step = (Math.abs(max) > 100) ? 100 : 10;

    y.overrideMax = (1 + Math.round(max / step)) * step;
    y.overrideMin = Math.min(0.0, _.min(values));

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

    // Draw so geometry properties are available to compute tooltips
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
    this.loadData(this.props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.components !== this.props.components |
        nextProps.krdel !== this.props.krdel |
        nextProps.kexp !== this.props.kexp) {
          this.loadData(nextProps);
    }
    return false;
  }

  render() {
    return (
      <div style={ { width: this.props.width,
                     height: this.props.height } }>
        <svg ref='chartsvg' width='100%' height='100%' style={ {overflow: 'visible'} } />
      </div>);
  }

}

export default IndicatorsChart = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel,
    components: state.components
  };
})(IndicatorsChart);

