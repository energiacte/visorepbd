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

export { CURVENAMES, getValues };
