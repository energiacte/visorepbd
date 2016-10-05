import React, { PropTypes } from 'react';

import ActionsPanel from 'components/ActionsPanel';
import EnergyComponentChart from 'components/EnergyComponentChart';
import { getValues, CURVENAMES } from '../epbdutils';
import { VALIDDATA } from '../energycalculations';

import _ from 'lodash';

export default class EnergyComponentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { commentOnEdit: false, totalenergyOnEdit: false };
  }

  render() {
    const { selectedkey, components } = this.props;
    const { carrier, ctype, originoruse, values, comment } = components[selectedkey];
    const ctypevalues = _.keys(VALIDDATA);
    const originorusevalues = _.keys(VALIDDATA[ctype]);
    const carriervalues = VALIDDATA[ctype][originoruse];
    const data = values.map((value, imes) => { return { Mes: imes, Valor: value }; });

    const currenttotalenergy = _.sum(values);

    return (
      <div id="energycomponenteditor" className="panel-body bg-info" key={ 'selected' + selectedkey } >
        <form className="form-horizontal"
              onSubmit={ e => e.preventDefault() }>
          <fieldset>
            <div className="form-group">

              <label className="col-md-1 control-label"
                     htmlFor="selectctype">Tipo</label>
              <div className="col-md-3">
                <select ref="selectctype"
                        name="selectctype" className="form-control"
                        onChange={ e => this.handleChange(e) }
                        value={ ctype } >
                  { ctypevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>

              <label className="col-md-1 control-label"
                     htmlFor="selectoriginoruse">Origen/Uso</label>
              <div className="col-md-3">
                <select ref="selectoriginoruse"
                        name="selectoriginoruse" className="form-control"
                        onChange={ e => this.handleChange(e) }
                        value={ originoruse } >
                  { originorusevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>

              <label className="col-md-1 control-label"
                     htmlFor="selectcarrier">Vector</label>
              <div className="col-md-3">
                <select ref="selectcarrier"
                        name="selectcarrier" className="form-control"
                        onChange={ e => this.handleChange(e) }
                        value={ carrier }>
                  { carriervalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
              </div>

            </div>

            <div className="form-group">

              <label className="col-md-1 control-label"
                     htmlFor="selectcurve">Curva</label>
              <div className="col-md-3">
                <select ref={ ref => this.CurveSelect = ref }
                        name="selectcurve" className="form-control"
                        style={{width:'50%', display:'inline-block', verticalAlign:'top'}}
                        defaultValue={ CURVENAMES[0] }
                        onChange={ e => this.updateValues() }>
                  { CURVENAMES.map(val => <option key={ val } value={ val }>{ val }</option>) }
                </select>
                <EnergyComponentChart ctype={ ctype }
                                      maxvalue={ _.max(values) }
                                      data={ data }
                                      className="form-control"
                                      width="50%" height="34px" />
              </div>

              <label className="col-md-1 control-label"
                     htmlFor="rangecontrol">E.Total</label>
              <div className="col-md-3">
                <input className="form-control col-md-2"
                       ref={ ref => this.totalEnergyRange = ref }
                       name="totalenergyrange"
                       type="range"
                       min="0"
                       max={ Math.max(10, 10 + 1.5 * Math.round(currenttotalenergy / 5) * 5) }
                       step="5"
                       style={{width:'50%'}}
                       defaultValue={ currenttotalenergy }
                       onChange={ e => this.handleChangeTotalEnergyRange(e) } />
                <input className="form-control col-md-1"
                       ref={ ref => this.totalEnergyEntry = ref }
                       name="totalenergyentry"
                       type="text"
                       style={ { width:'50%', background: this.state.totalenergyOnEdit ? '#fcf8c3': '' } }
                       defaultValue={ currenttotalenergy.toFixed(2) }
                       onKeyDown={ e => this.handleChangeTotalEnergyEntry(e) }/>
              </div>
              <div className="col-md-4 control-label">
                <ActionsPanel
                    onAdd={() => this.handleAdd(selectedkey)}
                    onRemove={() => this.handleRemove(selectedkey)}
                    onRestore={() => this.handleRestore()}
                    onLoad={ this.props.onLoad }
                    getEnergyString={ this.props.getEnergyString }
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-1 control-label"
                     htmlFor="commentinput">Comentario</label>
              <div className="col-md-11">
                <input className={ "form-control" }
                       name="commentinput"
                       type="text"
                       style={ { width:'100%', backgroundColor: this.state.commentOnEdit ? '#fcf8c3': '' } }
                       defaultValue={ comment || '' }
                       onKeyDown={ e => this.handleChangeComment(e) }
                />
              </div>
            </div>

          </fieldset>
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

  // Handle changes in ctype, originoruse and carrier select boxes
  // It tries to keep coherent values
  handleChange(e) {
    const { selectedkey, components, onEdit } = this.props;
    let prop = e.target.name.replace(/^select/, '');
    let value = e.target.value;
    let currentcomponent = { ...components[selectedkey] };

    if (currentcomponent[prop] === value) { return; }

    if (prop === 'ctype') {
      const originorusekey0 = Object.keys(VALIDDATA[value])[0];
      currentcomponent.ctype = value;
      currentcomponent.originoruse = originorusekey0;
      if (!_.includes(
        VALIDDATA[value][originorusekey0],
        currentcomponent.carrier)) {
          currentcomponent.carrier = VALIDDATA[value][originorusekey0][0];
      }
    }

    if (prop === 'originoruse') {
      const currctype = currentcomponent.ctype;
      currentcomponent.originoruse = value;
      if (!_.includes(
        VALIDDATA[currctype][value],
        currentcomponent.carrier)) {
          currentcomponent.carrier = VALIDDATA[currctype][value][0];
      }
    }

    if (prop === 'carrier') {
      currentcomponent.carrier = value;
    }

    onEdit(selectedkey, currentcomponent);
  }

  parseTotalEnergyValue(value) {
    const PLAINNUMBERREGEX = /^[+-]?([0-9]*[.])?[0-9]+$/;
    const SIMPLEEXPRESSIONREGEX = /^((?:[0-9]*[.])?[0-9]+)([\/*+-])((?:[0-9]*[.])?[0-9]+)$/;

    let newvalue = value.replace(/,/g, '.');
    if (PLAINNUMBERREGEX.test(newvalue)) {
      newvalue = Math.abs(parseFloat(newvalue));
    } else if (SIMPLEEXPRESSIONREGEX.test(newvalue)) {
      let [ expr, val1, op, val2 ] = newvalue.match(SIMPLEEXPRESSIONREGEX);
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
      newvalue = isNaN(newvalue)? null: newvalue;
    } else {
      newvalue = null;
    }

    if (newvalue === null) {
      return null;
    } else {
      return newvalue.toFixed(2);
    }
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

  // Add component to component list
  handleAdd(selectedkey, event) {
    let currentcomponent = (selectedkey !== null) ?
                           { ...this.props.components[selectedkey] } :
                           {
                             active: true,
                             ctype: 'PRODUCCION',
                             originoruse: 'INSITU',
                             carrier: 'ELECTRICIDAD',
                             values: [10] * 12,
                             comment:'Comentario'
                           }

    this.props.onAdd(currentcomponent);
  }

  // Remove current component to component list
  handleRemove(selectedkey, event) {
    this.props.onRemove(selectedkey);
  }

  // Restore current component to stored state
  handleRestore(event) {
    const { selectedkey, storedcomponent, onEdit } = this.props;
    const currenttotalenergy = _.sum(storedcomponent.values);

    this.CurveSelect.value = CURVENAMES[0];
    this.totalEnergyRange.max = Math.max(10, 10 + 2 * Math.round(currenttotalenergy / 100) * 100);
    this.totalEnergyRange.value = currenttotalenergy.toFixed(2);
    this.totalEnergyEntry.value = currenttotalenergy.toFixed(2);
    storedcomponent.active = true;

    onEdit(selectedkey, storedcomponent);
  }

}
