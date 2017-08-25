import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export default class GlobalVarsControl extends React.Component {

  render() {
    const { kexp, area, onChangeKexp, onChangeArea } = this.props;

    return (
      <div id="globalvarscontrol" className="form-horizontal bg-primary col-md-12">
        <div id="kexp" className="form-group col-md-3">
          <label className="control-label" htmlFor="kexprange">k<sub>exp</sub> </label>
          <input type="range" min="0" max="1" step="0.1"
                 name="kexprange"
                 className="form-control"
                 defaultValue={ kexp }
                 onChange={ e => onChangeKexp(e.target.value) } />
          <input type="text" readOnly maxLength="3" size="3"
                 value={ kexp.toFixed(1) } />
        </div>
        <div className="form-group col-md-3" />
        <div id="area" className="form-group col-md-3">
          <label className="control-label" htmlFor="areaentry">Area<sub>ref</sub> (m²) </label>
          <input type="number" lang="es" min="1" step="1"
                 name="areaentry"
                 className="form-control"
                 value={ area.toFixed(0) }
                 onChange={ e => onChangeArea(e.target.value) } />
        </div>
      </div>
    );
  }

}

