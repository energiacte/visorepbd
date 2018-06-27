import React from 'react';
//import { connect } from 'react-redux';
const VALUESREGEX = /\s*([0-9]+[.]?[0-9]*)\s*(,\s*([0-9]+[.]?[0-9]*)\s*)*/;

export default class ValuesEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.values.map(v => v.toFixed(2)).join(", "),
      lastvalues: props.values,
      status: 'OK'
    };
  }

  static getDerivedStateFromProps(props, state) {
    const text = props.values.map(v => v.toFixed(2)).join(", ");
    if (state.lastvalues !== props.values) {
      return { text, lastvalues: props.values, status: 'OK' };
    }
    // Return null to indicate no change to state.
    return null;
  }

  handleChange(e) {
    e.preventDefault();
    const currtext = e.target.value;
    const currvalues = currtext.split(',');
    let status = 'FAILS'
    if (VALUESREGEX.test(currtext)
      && currvalues.length === this.props.values.length
      && currvalues.every(v => !isNaN(v) && v.trim() !== '')) {
        status = 'VALIDATES';
    }
    // No update for lastvalues as they will come back on handleAccept through new props.
    this.setState({ text: e.target.value, status });
  }

  handleAccept(e) {
    e.preventDefault();
    if(['OK', 'VALIDATES'].includes(this.state.status)) {
      const newvalues = this.state.text.split(',').map(Number);
      this.props.onEdit(newvalues);
    }
  }

  render() {
    const { status, text } = this.state;
    let feedback, icon;
    switch (status) {
      case 'OK':
        feedback = "";
        icon = "glyphicon-ok";
        break;
      case 'VALIDATES':
        feedback = "has-success";
        icon = "glyphicon-ok";
        break;
      default:
        feedback = "has-warning";
        icon = "glyphicon-warning-sign";
    }

    return (
      <div className={`form-group has-feedback ${feedback}`}>
        <label className="col-md-2 control-label">Valores</label>
        <div className="col-md-10">
          <div className="input-group">
            <input type="text" className="form-control" value={text}
              ref={ref => this.userInput = ref}
              onChange={e => this.handleChange(e)}
              onBlur={e => this.handleAccept(e)}
              onKeyDown={e => e.key === "Enter" ? this.handleAccept(e) : null}
            />
            <span className="input-group-btn">
              <span className={`form-control form-control-feedback glyphicon ${icon}`} />
            </span>
          </div>
        </div>
      </div>
    );
  }

}
