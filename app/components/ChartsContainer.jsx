import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import d3 from 'd3';
import dimple from 'dimple';
import $ from 'jquery';
import _ from 'lodash';
import numeral from 'numeral';

import { IChartA, IChartAB } from 'components/IndicatorsChart';

function datalimits(data) {
  const values = _.values(_.pick(data, ['EPAnren', 'EPAren', 'EPAtotal',
                                        'EPnren', 'EPren', 'EPtotal']));
  const maxvalue = _.max(values);
  const step = (Math.abs(maxvalue) > 100) ? 100 : 10;
  const max = (1 + Math.round(maxvalue / step)) * step;
  const min = Math.min(0.0, _.min(values));
  return {min, max};
}

class ChartsContainer extends React.Component {

  static defaultProps = { width: '50%', height: '200px' }

  render() {
    const { width, height, kexp, krdel, data } = this.props;
    const { min, max } = datalimits(data);
    return (
      <div style={ { width: width,
                     height: height } }>
        <IChartA kexp={ kexp }
                 krdel={ krdel }
                 data={ data }
                 max={ max } min={ min } />
        <IChartAB kexp={ kexp }
                  krdel={ krdel }
                  data={ data }
                  max={ max } min={ min } />
      </div>);
  }

}

export default ChartsContainer = connect(state => {
  return {
    data: state.data,
    kexp: state.kexp,
    krdel: state.krdel,
    components: state.components,
  };
})(ChartsContainer);


