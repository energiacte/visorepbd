import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ActionsPanel from 'components/ActionsPanel';
import EnergyComponentChart from 'components/EnergyComponentChart';
import GlobalVarsControl from 'components/GlobalVarsControl';

import _ from 'lodash';
import numeral from 'numeral';

import { selectEnergyComponent,
         addEnergyComponent,
         removeEnergyComponent,
         editEnergyComponent,
         changeKexp,
         changeKrdel } from 'actions/actions.js';

const validData = {
  SUMINISTRO: {
    EPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
          'COGENERACION', 'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
          'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
          'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE'],
    NEPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
           'COGENERACION', 'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
           'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
           'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE']
  },
  PRODUCCION: {
    INSITU: ['ELECTRICIDAD', 'ELECTRICIDADBALEARES',
             'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA',
             'MEDIOAMBIENTE'],
    COGENERACION: ['ELECTRICIDAD', 'ELECTRICIDADBALEARES',
                   'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA']
  }
};

class EnergyComponentEditor extends React.Component {

  static state = {}

  render() {
    const { kexp, krdel, selectedkey, components } = this.props;
    const { ctype, originoruse, carrier, values } = components[selectedkey];

    const ctypevalues = _.keys(validData);
    const originorusevalues = _.keys(validData[ctype]);
    const carriervalues = validData[ctype][originoruse];
    const data = values.map((value, imes) => { return { Mes: imes, Valor: value }; });

    return (
      <div>
        <GlobalVarsControl
            kexp={kexp}
            krdel={krdel}
            onChangeKexp={(ev) => this.handleChangeKexp(ev)}
            onChangeKrdel={(ev) => this.handleChangeKrdel(ev)} />
        <div className="panel-body bg-info">

          <div>
            <form className="form-horizontal">
              <fieldset>
                <div className="form-group">

                  <label className="col-md-1 control-label"
                         htmlFor="selectctype">Tipo</label>
                  <div className="col-md-3">
                    <select ref="selectctype"
                            name="selectctype" className="form-control"
                            onChange={ (e) => this.handleChange(e) }
                            value={ ctype } >
                      { ctypevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                    </select>
                  </div>

                  <label className="col-md-1 control-label"
                         htmlFor="selectoriginoruse">Origen/Uso</label>
                  <div className="col-md-3">
                    <select ref="selectoriginoruse"
                            name="selectoriginoruse" className="form-control"
                            onChange={ (e) => this.handleChange(e) }
                            value={ originoruse } >
                      { originorusevalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                    </select>
                  </div>

                  <label className="col-md-1 control-label"
                         htmlFor="selectcarrier">Vector</label>
                  <div className="col-md-3">
                    <select ref="selectcarrier"
                            name="selectcarrier" className="form-control"
                            onChange={ (e) => this.handleChange(e) }
                            value={ carrier }>
                      { carriervalues.map(val => <option key={ val } value={ val }>{ val }</option>) }
                    </select>
                  </div>

                </div>

                <div className="form-group">
                  <div className="col-md-4" />
                  <div className="col-md-4" />
                  <div className="col-md-4">
                  <EnergyComponentChart ctype={ ctype }
                                        maxvalue={ _.max(values) }
                                        data={ data }
                                        width="100%" height="40px" />
                  </div>
                </div>

              </fieldset>
            </form>

          </div>

          <ActionsPanel
              onAdd={() => this.handleAdd(selectedkey)}
              onRemove={() => this.handleRemove(selectedkey)}
              onRestore={() => this.handleRestore()} />
        </div>
      </div>
    );
  }

  // Handle changes in the kexp slider
  handleChangeKexp(e) {
    this.props.dispatch(changeKexp(e.target.value));
  }

  // Handle changes in the krdel slider
  handleChangeKrdel(e) {
    this.props.dispatch(changeKrdel(e.target.value));
  }

  // Handle changes in ctype, originoruse and carrier select boxes
  // It tries to keep coherent values
  handleChange(e) {
    const { selectedkey, components } = this.props;
    let prop = e.target.name.replace(/^select/, '');
    let value = e.target.value;
    let currentcomponent = { ...components[selectedkey] };

    if (currentcomponent[prop] === value) { return; }

    if (prop === 'ctype') {
      const originorusekey0 = Object.keys(validData[value])[0];
      currentcomponent.ctype = value;
      currentcomponent.originoruse = originorusekey0;
      currentcomponent.carrier = validData[value][originorusekey0][0];
    }

    if (prop === 'originoruse') {
      const currctype = currentcomponent.ctype;
      currentcomponent.originoruse = value;
      currentcomponent.carrier = validData[currctype][value][0];
    }

    if (prop === 'carrier') {
      currentcomponent.carrier = value;
    }

    this.props.dispatch(
      editEnergyComponent(selectedkey, currentcomponent));
  }

  // Add component to component list
  handleAdd(selectedkey, event) {
    this.props.dispatch(
      addEnergyComponent(
        { active: true,
          ctype: 'PRODUCCION',
          originoruse: 'INSITU',
          carrier: 'ELECTRICIDAD',
          values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
    }));
  }

  // Remove current component to component list
  handleRemove(selectedkey, event) {
    this.props.dispatch(removeEnergyComponent(selectedkey));
  }

  // Restore current component to stored state
  handleRestore(event) {
    this.props.dispatch(
      editEnergyComponent(
        this.props.selectedkey,
        this.props.storedcomponent
        ));
  }

}

export default EnergyComponentEditor = connect(state => {
  return {
    kexp: state.kexp,
    krdel: state.krdel,
    storedcomponent: state.storedcomponent,
    selectedkey: state.selectedkey,
    components: state.components
  };
})(EnergyComponentEditor);

