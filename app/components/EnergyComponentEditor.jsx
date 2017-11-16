import React from 'react';

import EnergyComponentChart from 'components/EnergyComponentChart';
import { cte } from 'epbdjs';
const { CTE_VALIDDATA } = cte;

const CURVENAMES = ['ACTUAL', 'CONSTANTE', 'CONCAVA', 'CONVEXA', 'CRECIENTE', 'DECRECIENTE'];

// Calculate a list of numsteps coefficients with a shape defined by curvename
function getcoefs(curvename, numsteps) {
  let coefs = new Array(numsteps).fill(0);

  switch (curvename) {
  case 'CONCAVA':
    coefs = coefs.map((coef, i) => {
      return (4
              - 12 * (i + 0.5) / numsteps
              + 12 * (i + 0.5) * (i + 0.5) / (numsteps * numsteps));
    });
    break;
  case 'CONVEXA':
    coefs = coefs.map((coef, i) => {
      return (1
              + 12 * (i + 0.5) / numsteps
              - 12 * (i + 0.5) * (i + 0.5) / (numsteps * numsteps));
    });
    break;
  case 'CRECIENTE':
    coefs = coefs.map((coef, i) => { return i; });
    break;
  case 'DECRECIENTE':
    coefs = coefs.map((coef, i) => { return numsteps - 1 - i; });
    break;
  default: // CONSTANTE y otros
    coefs = coefs.map(() => { return 1.0; });
  }

  const areanorm = coefs.reduce((a, b) => a + b, 0);
  coefs = coefs.map((coef) => coef / areanorm);

  return coefs;
}

// get new timestep values using curvename, newtotalenergy and currentvalues
function getValues(curvename, newtotalenergy, currentvalues) {
  let values = [];
  let scale = newtotalenergy;
  const currenttotalenergy = currentvalues.reduce((a, b) => a + b, 0);
  const numsteps = currentvalues.length;

  if (currenttotalenergy === 0) {
    const val = newtotalenergy / numsteps;
    values = currentvalues.map(_ => val);
  } else if (curvename === 'ACTUAL') {
    if (currenttotalenergy !== newtotalenergy) {
      scale = (newtotalenergy === 0) ? 0 : newtotalenergy / currenttotalenergy;
    } else {
      return currentvalues;
    }
    values = currentvalues.map(value => value * scale);
  } else {
    let coefs = getcoefs(curvename, numsteps);
    values = coefs.map(value => value * scale);
  }
  return values;
}

export default class EnergyComponentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { commentOnEdit: false, totalenergyOnEdit: false };
  }

  render() {
    const { selectedkey, components } = this.props;
    const { carrier, ctype, csubtype, values, comment } = components[selectedkey];
    const ctypevalues = Object.keys(CTE_VALIDDATA);
    const csubtypevalues = Object.keys(CTE_VALIDDATA[ctype]);
    const carriervalues = CTE_VALIDDATA[ctype][csubtype];
    const data = values.map((value, imes) => { return { Mes: imes, Valor: value }; });

    const currenttotalenergy = values.reduce((a, b) => a + b, 0);

    return (
      <div id="energycomponenteditor" className="panel-body" key={ 'selected' + selectedkey } >
        <form className="form-horizontal" onSubmit={ e => e.preventDefault() }>
            <div className="form-group">
              <label className="col-md-2 control-label"
                     htmlFor="selectctype">Tipo</label>
              <div className="col-md-10">
                <select id="selectctype"
                        name="selectctype" className="form-control"
                        onChange={ e => this.handleChange(e) }
                        value={ ctype } >
                  { ctypevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-2 control-label"
                     htmlFor="selectcsubtype">Subtipo</label>
              <div className="col-md-10">
                <select id="selectcsubtype"
                        name="selectcsubtype" className="form-control"
                        onChange={ e => this.handleChange(e) }
                        value={ csubtype } >
                  { csubtypevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-2 control-label"
                     htmlFor="selectcarrier">Vector</label>
              <div className="col-md-10">
                <select id="selectcarrier"
                        name="selectcarrier" className="form-control"
                        onChange={ e => this.handleChange(e) }
                        value={ carrier }>
                  { carriervalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-2 control-label"
                     htmlFor="selectcurve">Curva</label>
              <div className="col-md-10">
                <select ref={ ref => this.CurveSelect = ref }
                        name="selectcurve" className="form-control"
                        style={{ width: '50%', display: 'inline-block', verticalAlign: 'top' }}
                        defaultValue={ CURVENAMES[0] }
                        onChange={ _e => this.updateValues() }>
                  { CURVENAMES.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
                <EnergyComponentChart ctype={ ctype }
                                      maxvalue={ Math.max(...values) }
                                      data={ data }
                                      width="50%" height="34px" />
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-2 control-label"
                     htmlFor="totalenergyrange">E.Total</label>
              <div className="col-md-10">
                <input className="form-control col-md-5"
                       ref={ ref => this.totalEnergyRange = ref }
                       name="totalenergyrange"
                       type="range"
                       min="0"
                       max={ Math.max(10, 10 + 1.5 * Math.round(currenttotalenergy / 5) * 5) }
                       step="5"
                       style={{ width:'50%' }}
                       defaultValue={ currenttotalenergy }
                       onChange={ e => this.handleChangeTotalEnergyRange(e) } />
                <input className="form-control col-md-5"
                       ref={ ref => this.totalEnergyEntry = ref }
                       name="totalenergyentry"
                       type="text"
                       style={ { width: '50%', background: this.state.totalenergyOnEdit ? '#fcf8c3' : '' } }
                       defaultValue={ currenttotalenergy.toFixed(2) }
                       onKeyDown={ e => this.handleChangeTotalEnergyEntry(e) }/>
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-2 control-label"
                     htmlFor="commentinput">Comentario</label>
              <div className="col-md-10">
                <input className={ "form-control" }
                       name="commentinput"
                       type="text"
                       style={ { width: '100%', backgroundColor: this.state.commentOnEdit ? '#fcf8c3' : '' } }
                       defaultValue={ comment || '' }
                       onKeyDown={ e => this.handleChangeComment(e) }
                />
              </div>
            </div>
            <button className="col-md-4 btn btn-info pull-right" id="modify" type="button"
                  onClick={() => this.handleRestore()}>
                  <span className="glyphicon glyphicon-repeat"/> Restaurar a valores iniciales
            </button>
        </form>

      </div>
    );
  }

  handleChangeComment(e) {
    const { selectedkey, components, onEdit } = this.props;
    let newComment = e.target.value;
    let currentcomponent = { ...components[selectedkey] };

    if (e.keyCode !== 13) {
      if (newComment !== currentcomponent.comment) this.setState({ commentOnEdit: true });
      return;
    }
    this.setState({ commentOnEdit: false });
    currentcomponent.comment = newComment;
    onEdit(selectedkey, currentcomponent);
  }

  // Handle changes in ctype, csubtype and carrier select boxes
  // It tries to keep coherent values
  handleChange(e) {
    const { selectedkey, components, onEdit } = this.props;
    let prop = e.target.name.replace(/^select/, '');
    let value = e.target.value;
    let currentcomponent = { ...components[selectedkey] };

    if (currentcomponent[prop] === value) { return; }

    if (prop === 'ctype') {
      const csubtypekey0 = Object.keys(CTE_VALIDDATA[value])[0];
      currentcomponent.ctype = value;
      currentcomponent.csubtype = csubtypekey0;
      if (!CTE_VALIDDATA[value][csubtypekey0].includes(currentcomponent.carrier)) {
          currentcomponent.carrier = CTE_VALIDDATA[value][csubtypekey0][0];
      }
    }

    if (prop === 'csubtype') {
      const currctype = currentcomponent.ctype;
      currentcomponent.csubtype = value;
      if (!CTE_VALIDDATA[currctype][value].includes(currentcomponent.carrier)) {
        currentcomponent.carrier = CTE_VALIDDATA[currctype][value][0];
      }
    }

    if (prop === 'carrier') {
      currentcomponent.carrier = value;
    }

    onEdit(selectedkey, currentcomponent);
  }

  parseTotalEnergyValue(value) {
    const PLAINNUMBERREGEX = /^[+-]?([0-9]*[.])?[0-9]+$/;
    const SIMPLEEXPRESSIONREGEX = /^((?:[0-9]*[.])?[0-9]+)([/*+-])((?:[0-9]*[.])?[0-9]+)$/;

    let newvalue = value.replace(/,/g, '.');
    if (PLAINNUMBERREGEX.test(newvalue)) {
      newvalue = Math.abs(parseFloat(newvalue));
    } else if (SIMPLEEXPRESSIONREGEX.test(newvalue)) {
      let [ _expr, val1, op, val2 ] = newvalue.match(SIMPLEEXPRESSIONREGEX);
      val1 = parseFloat(val1);
      val2 = parseFloat(val2);
      if (op === '+') {
        newvalue = (val1 + val2);
      } else if (op === '-') {
        newvalue = Math.max((val1 - val2), 0.0);
      } else if (op === '*') {
        newvalue = (val1 * val2);
      } else if (op === '/') {
        newvalue = (val1 / val2);
      }
      newvalue = isNaN(newvalue) ? null : newvalue;
    } else {
      newvalue = null;
    }

    if (newvalue === null) {
      return null;
    }
    return newvalue.toFixed(2);
  }

  // Handle changes in total energy entry through UI
  handleChangeTotalEnergyEntry(e) {
    if (e.keyCode !== 13) {
      this.setState({ totalenergyOnEdit: true });
      return;
    }
    this.setState({ totalenergyOnEdit: false });
    let newvalue = this.parseTotalEnergyValue(e.target.value);
    if (newvalue === null || this.totalEnergyEntry.value === newvalue) return;

    this.totalEnergyEntry.value = newvalue;
    this.totalEnergyRange.value = newvalue;
    if (this.totalEnergyRange.max <= newvalue) { this.totalEnergyRange.max = this.totalEnergyRange.max * 2; }
    this.updateValues();
  }

  // Handle changes in total energy range through UI
  handleChangeTotalEnergyRange(e) {
    this.totalEnergyEntry.value = parseFloat(e.target.value.replace(',', '.')).toFixed(2);
    this.updateValues();
  }

  // Update current energycomponent values using editor UI state
  updateValues() {
    const { selectedkey, components, onEdit } = this.props;
    let currentcomponent = { ...components[selectedkey] };
    let newvalues = getValues(this.CurveSelect.value,
                              parseFloat(this.totalEnergyEntry.value.replace(',', '.')),
                              currentcomponent.values);
    currentcomponent.values = newvalues;
    onEdit(selectedkey, currentcomponent);
  }

  // Restore current component to stored state
  handleRestore(_event) {
    const { selectedkey, storedcomponent, onEdit } = this.props;
    const currenttotalenergy = storedcomponent.values.reduce((a, b) => a + b, 0);

    this.CurveSelect.value = CURVENAMES[0];
    this.totalEnergyRange.max = Math.max(10, 10 + 2 * Math.round(currenttotalenergy / 100) * 100);
    this.totalEnergyRange.value = currenttotalenergy.toFixed(2);
    this.totalEnergyEntry.value = currenttotalenergy.toFixed(2);
    storedcomponent.active = true;

    onEdit(selectedkey, storedcomponent);
  }

}
