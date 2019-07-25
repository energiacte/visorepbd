import React from "react";

const RE_NUMBER = /^[+-]?((\.\d+)|(\d+(\.\d+)?))\s*$/;
const RE_INCOMPLETE_NUMBER = /^([+-]|\.0*|[+-]\.0*|[+-]?\d+\.)?$/;

// Control que permite la entrada de un valor numérico con formato
function inrangevalue(text, min, max, precision) {
  let n = Math.min(Math.max(Number(text), min), max);
  let q = Math.pow(10, precision === null ? 10 : precision);
  return Math.round(n * q) / q;
}

// Componente para entrada numérica controlada y con formato
export class NumInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      status: ""
    };
  }
  static defaultProps = {
    id: "numinput - " + Math.random().toString(4), // ID del elemento
    precision: 3, // Precisión numérica de entrada y salida
    min: Number.MIN_VALUE, // Valor mínimo
    max: Number.MAX_VALUE, // Valor máximo
    onValueChange: () => {}, // Retrollamada para cambio de valor
    className: "", // Clases adicionales del elemento input
    labelClassName: "", // Clases adicionales del elemento label
    groupClassName: "", // Clases adicionbales del elemento group
    hasFeedback: true, // Usa controles con feedback
    hasErrorMessage: false // Muestra mensaje de error
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      // new value from the parent - copy it to state
      this.setState({ value: nextProps.value });
    }
  }

  // Valida y actualiza estado
  onValueChanged(e) {
    const { value } = e.target;
    let status;
    if (RE_NUMBER.test(value)) {
      status = "OK";
    } else if (RE_INCOMPLETE_NUMBER.test(value)) {
      status = "INCOMPLETE";
    } else {
      status = "ERROR";
    }
    this.setState({ value, status });
  }

  // Envía el último valor válido en la entrada
  sendNewValue() {
    const { value } = this.userInput;
    const { min, max, precision } = this.props;
    if (this.state.status === "OK") {
      const vv = inrangevalue(value, min, max, precision);
      this.setState({ value: String(vv), status: "" }, () =>
        this.props.onValueChange(vv)
      );
    } else {
      this.setState({ value: String(this.props.value), status: "" });
    }
  }

  render() {
    const {
      children,
      className,
      labelClassName,
      groupClassName,
      hasFeedback,
      hasErrorMessage,
      id,
      // propiedades eliminadas para no interferir con rest
      // (p.e. "min" convierte la entrada en entrada de valores enteros)
      // eslint-disable-next-line no-unused-vars
      precision,
      // eslint-disable-next-line no-unused-vars
      min,
      // eslint-disable-next-line no-unused-vars
      max,
      // eslint-disable-next-line no-unused-vars
      onValueChange,
      // eslint-disable-next-line no-unused-vars
      value,
      // Resto de valores para hacer bypass
      ...rest
    } = this.props;
    const { status } = this.state;

    let feedback = "";
    if (hasFeedback) {
      if (status == "ERROR") {
        feedback = "is-invalid";
      } else if (status === "OK") {
        feedback = "is-valid";
      } else if (status == "INCOMPLETE") {
        feedback = "";
      } else {
        feedback = "";
      }
    }

    let errorMessage = null;
    if (hasErrorMessage) {
      if (status == "OK") {
        errorMessage = <div>Error con valor {this.state.value}</div>;
      } else {
        errorMessage = null
      }
    }

    return (
      <div className={`form-group ${feedback} ${groupClassName}`}>
        {children ? (
          <label htmlFor={id} className={`control-label ${labelClassName}`}>
            {children}
          </label>
        ) : null}
        <input
          type="text"
          id={id}
          className={`form-control ${feedback} ${className}`}
          ref={ref => (this.userInput = ref)}
          onChange={e => this.onValueChanged(e)}
          onBlur={_ => this.sendNewValue()}
          onKeyDown={e => (e.key == "Enter" ? this.sendNewValue() : null)}
          value={this.state.value}
          {...rest}
        />
        {errorMessage}
      </div>
    );
  }
}

export default NumInput;
