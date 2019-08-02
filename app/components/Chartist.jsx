// Minimal wrapper based on code by xvfeng with The MIT License (MIT)
// See https://github.com/fraserxu/react-chartist/blob/master/LICENSE

import React, { Component, cloneElement, Children } from 'react';
import PropTypes from 'prop-types'
import * as Chartist from 'chartist';

class ChartistGraph extends Component {

  componentWillReceiveProps(newProps) {
    this.updateChart(newProps);
  }

  componentWillUnmount() {
    if (this.chartist) {
      try {
        this.chartist.detach();
      } catch (err) {
        throw new Error('Internal chartist error', err);
      }
    }
  }

  componentDidMount() {
    this.updateChart(this.props);
  }

  updateChart(config) {
    let { type, data } = config;
    let options = config.options || {};
    let responsiveOptions = config.responsiveOptions || [];
    let event;

    if (this.chartist) {
      this.chartist.update(data, options, responsiveOptions);
    } else {
      this.chartist = new Chartist[type](this.chart, data, options, responsiveOptions);

      if (config.listener) {
        for (event in config.listener) {
          if (event in config.listener) {
            this.chartist.on(event, config.listener[event]);
          }
        }
      }
    }

    return this.chartist;
  }

  render() {
    const { className, style, children, data, type } = this.props;
    const childrenWithProps = children && Children.map(children, (child) => (
      cloneElement(child, {
        type,
        data
      })
    ));
    return (
      <div className={`ct-chart ${className || ''}`} ref={(ref) => this.chart = ref } style={style}>
         {childrenWithProps}
      </div>
    )
  }
}

ChartistGraph.propTypes = {
  type: PropTypes.oneOf(['Line', 'Bar', 'Pie']).isRequired,
  data: PropTypes.object.isRequired,
  className: PropTypes.string,
  options: PropTypes.object,
  responsiveOptions: PropTypes.array,
  style: PropTypes.object
}

export default ChartistGraph;