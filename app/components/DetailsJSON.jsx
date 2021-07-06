import React from "react";

// Vista de detalle del JSON del balance
const DetailsJSON = props => {
  const { balance } = props;

  if (balance.ep === undefined) return null;

  return (
    <div className="row">
      <div className="col-lg-6">
        <h3>Energía primaria y emisiones:</h3>
        <pre>{JSON.stringify(balance.ep, undefined, 2)}</pre>
      </div>
    </div>
  );
};

export default DetailsJSON;
