import React from "react";

const RE_NUMBER = /^\s*[+-]?((\.\d+)|(\d+(\.\d+)?))\s*$/;
const RE_INCOMPLETE_NUMBER = /^\s*([+-]|\.0*|[+-]\.0*|[+-]?\d+\.)?\s*$/;

// Control que permite la entrada de un valor numérico con formato
function inrangevalue(text, min, max, precision) {
  let n = Math.min(Math.max(Number(text), min), max);
  let q = Math.pow(10, precision === null ? 10 : precision);
  return Math.round(n * q) / q;
}

// Componente para entrada numérica controlada y con formato
export default class NumInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.value.toFixed(props.precision),
      lastoknumber: props.value,
      status: "OK"
    };
  }
  static defaultProps = {
    id: "numinput - " + Math.random().toString(4), // ID del elemento
    precision: 3, // Precisión numérica de entrada y salida
    min: Number.MIN_VALUE, // Valor mínimo
    max: Number.MAX_VALUE, // Valor máximo
    className: "", // Clases adicionales del elemento input
    labelClassName: "", // Clases adicionales del elemento label
    groupClassName: "", // Clases adicionbales del elemento group
    hasFeedback: false // Usa controles con feedback
  };

  // Controla necesidad de actualización
  static getDerivedStateFromProps(props, state) {
    const { precision, value } = props;
    const text = precision ? value.toFixed(precision) : String(value);
    if (state.lastoknumber !== value) {
      return { text, lastoknumber: value, status: "OK" };
    }
    // Return null to indicate no change to state.
    return null;
  }

  // Valida y actualiza estado
  handleChange(e) {
    e.preventDefault();
    const text = this.userInput.value;
    const { min, max, precision } = this.props;
    if (RE_NUMBER.test(text)) {
      let lastoknumber = inrangevalue(text, min, max, precision);
      this.setState({
        lastoknumber,
        text: String(lastoknumber),
        status: "OK"
      });
      this.props.onNumberChange(lastoknumber);
    } else if (RE_INCOMPLETE_NUMBER.test(text)) {
      this.setState({ text, status: "INCOMPLETE" });
    } else {
      this.setState({ text: this.state.lastoknumber, status: "RESET" });
    }
  }

  // Muestra el último valor válido en la entrada
  showLast() {
    this.userInput.value = Number(this.state.lastoknumber).toFixed(
      this.props.precision
    );
  }

  render() {
    const {
      children,
      className,
      labelClassName,
      groupClassName,
      hasFeedback,
      id,
      ...rest
    } = this.props;
    const { text, status } = this.state;

    let feedback = "";
    if (hasFeedback) {
      switch (status) {
        case "OK":
          feedback = "is-valid";
          break;
        case "INCOMPLETE":
          feedback = "";
          break;
        default:
          feedback = "is-invalid";
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
          onChange={e => this.handleChange(e)}
          onBlur={_ => this.showLast()}
          onKeyDown={e => (e.key === "Enter" ? this.showLast() : null)}
          value={text}
          {...rest}
        />
      </div>
    );
  }
}
