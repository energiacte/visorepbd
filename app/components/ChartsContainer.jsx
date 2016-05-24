import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import d3 from 'd3';
import dimple from 'dimple';
import $ from 'jquery';
import _ from 'lodash';
import numeral from 'numeral';

import { fetchData } from 'actions/actions';
import { IChartA, IChartAB } from 'components/IndicatorsChart';

class ChartsContainer extends React.Component {

  static defaultProps = { width: '50%', height: '200px' }

  render() {
    const data = this.props.data;

    var EPAvalues = {EPnren: data.EPAnren, EPren: data.EPAren, EPtotal: data.EPAtotal};
    var EPBvalues = {EPnren: data.EPnren, EPren: data.EPren, EPtotal: data.EPtotal};
    var EPArer = data.EPArer, EPBrer = data.EPrer;

    const EPvalues = _.values(EPAvalues).concat(_.values(EPBvalues));

    const maxvalue = _.max(EPvalues);
    const step = (Math.abs(maxvalue) > 100) ? 100 : 10;
    const max = (1 + Math.round(maxvalue / step)) * step;
    const min = Math.min(0.0, _.min(EPvalues));

    return (
      <div style={ { width: this.props.width,
                     height: this.props.height } }>
        <IChartA kexp={ this.props.kexp }
                 krdel={ this.props.krdel }
                 data={ EPAvalues }
                 rer={ EPArer }
                 max={ max } min={ min } />
        <IChartAB kexp={ this.props.kexp }
                 krdel={ this.props.krdel }
                  data={ EPBvalues }
                  rer={ EPBrer }
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


