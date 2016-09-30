import React, { PropTypes } from 'react';

import ActionsPanel from 'components/ActionsPanel';
import EnergyComponentChart from 'components/EnergyComponentChart';
import { getValues, CURVENAMES } from '../epbdutils';
import { VALIDDATA } from '../energycalculations';

import _ from 'lodash';

export default class EnergyComponentEditor extends React.Component {

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
                       onChange={ e => this.handleChangeTotalEnergy(e) } />
                <input className="form-control col-md-1"
                       ref={ ref => this.totalEnergyEntry = ref }
                       name="totalenergyentry"
                       type="text"
                       style={ { width:'50%' } }
                       defaultValue={ currenttotalenergy.toFixed(2) }
                       onChange={ e => this.handleChangeTotalEnergy(e) }/>
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
                <input className="form-control"
                       name="commentinput"
                       type="text"
                       style={ { width:'100%' } }
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
    if (e.keyCode !== 13) return;
    const { selectedkey, components, onEdit } = this.props;
    let newComment = e.target.value;
    let currentcomponent = { ...components[selectedkey] };
    currentcomponent.comment = newComment;
    console.log(newComment);
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
    const sanitizedValue = value.replace(',', '.');
    return Math.abs(parseFloat(sanitizedValue)).toFixed(2);
  }

  // Handle changes in total energy through UI
  handleChangeTotalEnergy(e) {
    let newvalue;
    if (!/^[+-]?([0-9]*[.])?[0-9]+$/.test(e.target.value)) {
      if (e.target.value.endsWith('=')) {
        newvalue = e.target.value.replace(/,/g, '.');
        let [ expr, val1, op, val2 ] = newvalue.match(/^((?:[0-9]*[.])?[0-9]+)([\/*+-])((?:[0-9]*[.])?[0-9]+)=$/);
        val1 = parseFloat(val1);
        val2 = parseFloat(val2);
        if (op === '+') {
          newvalue = (val1 + val2).toFixed(2);
        } else if (op === '-') {
          newvalue = Math.max((val1 - val2), 0.0).toFixed(2);
        } else if (op === '*') {
          newvalue = (val1 * val2).toFixed(2);
        } else if (op === '/') {
          newvalue = (val1 / val2).toFixed(2);
        }
      } else {
        return;
      }
    } else {
      newvalue = this.parseTotalEnergyValue(e.target.value);
    }

    if (isNaN(newvalue)) return;

    if (e.target.name === 'totalenergyrange') {
      if (this.totalEnergyEntry.value === newvalue) { return; }
      this.totalEnergyEntry.value = newvalue;
    }

    if (e.target.name === 'totalenergyentry') {
      const currentValue = parseFloat(this.totalEnergyEntry.value);
      if ( currentValue === newvalue) { return; }

      let rangemax = this.totalEnergyRange.max;
      if (rangemax <= newvalue) {
        this.totalEnergyRange.max = rangemax * 2;
      }
      this.totalEnergyRange.value = newvalue;
      this.totalEnergyEntry.value = newvalue;
    }
    this.updateValues();
  }

  // Update current energycomponent values using editor UI state
  updateValues() {
    const { selectedkey, components, onEdit } = this.props;
    let currentcomponent = { ...components[selectedkey] };
    let currentvalues = currentcomponent.values;
    let newvalues = getValues(this.CurveSelect.value,
                              this.parseTotalEnergyValue(this.totalEnergyEntry.value),
                              currentvalues);
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
                             values: [10] * 12
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
