import React from 'react';
//import { connect } from 'react-redux';

import { IChartA, IChartAB } from 'components/IndicatorsChart';

function datalimits(data) {
  const { EPAnren, EPAren, EPAtotal, EPnren, EPren, EPtotal } = data;
  const values = [EPAnren, EPAren, EPAtotal, EPnren, EPren, EPtotal];
  const maxvalue = Math.max(...values);
  const step = (Math.abs(maxvalue) > 100) ? 100 : 10;
  return { min: Math.min(0.0, Math.min(...values)),
           max: (1 + Math.round(maxvalue / step)) * step };
}

export default class ChartsContainer extends React.Component {

  static defaultProps = { width: '50%', height: '200px' }

  render() {
    const { width, height, kexp, data } = this.props;
    const { min, max } = datalimits(data);
    return (
      <div style={ { width: width,
                     height: height } }>
        <IChartA kexp={ kexp }
                 data={ data }
                 max={ max } min={ min } />
        <IChartAB kexp={ kexp }
                  data={ data }
                  max={ max } min={ min } />
      </div>);
  }

}
