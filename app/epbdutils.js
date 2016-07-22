import _ from 'lodash';

const VALIDDATA = {
  CONSUMO: {
    EPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
          //'COGENERACION',
          'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
          'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
          'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE', 'RED1', 'RED2'],
    NEPB: ['BIOCARBURANTE', 'BIOMASA', 'BIOMASADENSIFICADA', 'CARBON',
           //'COGENERACION',
           'ELECTRICIDAD', 'ELECTRICIDADBALEARES',
           'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA', 'FUELOIL',
           'GASNATURAL', 'GASOLEO', 'GLP', 'MEDIOAMBIENTE', 'RED1', 'RED2']
  },
  PRODUCCION: {
    INSITU: ['ELECTRICIDAD', 'ELECTRICIDADBALEARES',
             'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA',
             'MEDIOAMBIENTE'],
    COGENERACION: ['ELECTRICIDAD', 'ELECTRICIDADBALEARES',
                   'ELECTRICIDADCANARIAS', 'ELECTRICIDADCEUTAMELILLA']
  }
};

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

  const areanorm = _.sum(coefs);
  coefs = coefs.map((coef) => coef / areanorm);

  return coefs;
}

// get new timestep values using curvename, newtotalenergy and currentvalues
function getValues(curvename, newtotalenergy, currentvalues) {
  let values = [];
  let scale = newtotalenergy;
  const currenttotalenergy = _.sum(currentvalues);
  const numsteps = currentvalues.length;

  if (currenttotalenergy === 0) {
    const val = newtotalenergy / numsteps;
    values = currentvalues.map(value => val);
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

// Create components array from text data (loaded from file)
// return null if conversion fails
function getComponents(data) {
  // check if line is blank, a comment (#) or a header
  const isDataLine = (elem, index) => {
    let e = elem.trim();
    return !(e === '' || /* whiteline */
             (e.startsWith('vector') && index === 0) || /* header */
             e.startsWith('#') /* comment */
            );
  };

  // Create component object from data line
  const vectorLineToComponent = elem => {
    elem = elem.split('#')[0];
    let [carrier, ctype, originoruse, ...values] = elem.split(',').map(e => e.trim());
    // Basic validation
    if (_.indexOf(_.keys(VALIDDATA), ctype) > -1 &&
        _.indexOf(_.keys(VALIDDATA[ctype]), originoruse) > -1 &&
        _.indexOf(VALIDDATA[ctype][originoruse], carrier) > -1) {
      return { active: true,
               carrier,
               ctype,
               originoruse,
               values: values.map(Number) };
    }
    return null;
  };

  // Build component list
  let dlist = data
      .split('\n')
      .filter(isDataLine)
      .map(vectorLineToComponent)
      .filter(e => e !== null);

  return dlist.length === 0 ? null : dlist;
}

export { VALIDDATA, CURVENAMES, getComponents, getValues };
