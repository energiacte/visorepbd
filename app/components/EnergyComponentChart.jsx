import React from "react";

const EnergyComponentChart = props => {
  const {
    width = "200px",
    height = "20px",
    bgcolor = "none",
    maxvalue,
    className,
    ctype,
    data
  } = props;

  const fillcolor = ctype === "CONSUMO" ? "blue" : "gray";
  const barWidth = 12 / data.length;
  const bars = data
    ? data.map(elem => {
        return (
          <rect
            key={`Mes_${elem.Mes}`}
            x={elem.Mes * barWidth}
            y={maxvalue - elem.Valor}
            width={0.9 * barWidth}
            height={elem.Valor}
            fill={fillcolor}
          >
            <title>{`Mes: ${elem.Mes}, Valor: ${elem.Valor}`}</title>
          </rect>
        );
      })
    : null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`-1 -2 14 ${maxvalue + 4}`}
      preserveAspectRatio="none"
      className={className}
      style={{
        display: props.display || "inline-block",
        padding: props.padding || 0
      }}
    >
      <path
        d={`M -1 -2 H 14 V ${maxvalue + 4} H -1 V -2`}
        fill={bgcolor}
        fillOpacity="0.5"
      />
      {bars}
    </svg>
  );
};
export default EnergyComponentChart;
