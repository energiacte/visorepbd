import React, { PropTypes } from 'react';

import numeral from 'numeral';

const GlobalVarsControl = (props) => {
  return (
    <div>
      <div id="kexp">
        <span>k<sub>exp</sub> </span>
        <input type="range" min="0" max="1" step="0.1"
               defaultValue={props.kexp}
               onChange={props.onChangeKexp} />
        <span>&nbsp;&nbsp;</span>
        <input type="text" readOnly maxLength="3" size="3"
               value={numeral(props.kexp).format('0.0')} />
      </div>
      <div id="krdel">
        <span>k<sub>rdel</sub> </span>
        <input type="range" min="0" max="1" step="0.1"
               defaultValue={props.krdel}
               onChange={props.onChangeKrdel} />
        <span>&nbsp;&nbsp;</span>
        <input type="text" readOnly maxLength="3" size="3"
               value={numeral(props.krdel).format('0.0')} />
      </div>
    </div>
  );
};

export default GlobalVarsControl;
