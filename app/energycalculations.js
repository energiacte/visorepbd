/* -*- coding: utf-8 -*-

Copyright (c) 2016 Ministerio de Fomento
                   Instituto de Ciencias de la Construcción Eduardo Torroja (IETcc-CSIC)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Author(s): Rafael Villar Burke <pachi@ietcc.csic.es>,
           Daniel Jiménez González <dani@ietcc.csic.es>
*/

/* ENERGYCALCULATIONS - Implementation of the ISO EN 52000-1 standard

  Energy performance of buildings - Overarching EPB assessment - General framework and procedures

  This implementation has used the following assumptions:
  - weighting factors are constant for all timesteps
  - no priority is set for energy production (average step A weighting factor f_we_el_stepA)
  - all on-site produced energy from non cogeneration sources is considered as delivered
  - the load matching factor is constant and equal to 1.0

  TODO:
  - allow other values of load matching factor (or functions) (formula 32, B.32)
  - get results by use items (service), maybe using the reverse method E.3 (E.3.6, E.3.7)
  - make the input sanitizer (weighting factors) smarter
*/

import { VALIDDATA } from './constants.js';
import {
  vecsum,
  veckmul,
  veclistsum,
  vecvecsum, vecvecdif, vecvecmul, vecvecmin } from './vecutils.js';

// Custom exception
function UserException(message) {
  this.message = message;
  this.name = 'UserException';
}

const FLOAT_REGEX = /^[+-]?([0-9]+([.,][0-9]*)?|[.,][0-9]+)$/;
const TAG_REGEX = /[A-Za-z]+[0-9]*/;
const LEGACY_SERVICE_TAG_REGEX = /^[ ]*(WATERSYSTEMS|HEATING|COOLING|FANS)/;

// -----------------------------------------------------------------------------------
// Input/Output functions
// -----------------------------------------------------------------------------------

// Input parsing functions -----------------------------------------------------------

// Read energy input data from string and return a carrier data object { components,  meta }
//
// # Input format:
//
// #META Area_ref: 100.5
// ELECTRICIDAD,CONSUMO,EPB,16.39,13.11,8.20,7.38,4.10,4.92,6.56,5.74,4.10,6.56,9.84,13.11
// ELECTRICIDAD,PRODUCCION,INSITU,8.20,6.56,4.10,3.69,2.05,2.46,3.28,2.87,2.05,3.28,4.92,6.56
//
// # Output format:
//
// The carrier list has objects with 'CARRIER' and 'META' type
//
// [ { type: 'CARRIER', carrier: carrier1, ctype: ctype1, csubtype: csubtype1, values: [...values1], comment: comment1 },
//   { type: 'CARRIER', carrier: carrier2, ctype: ctype2, csubtype: csubtype2, values: [...values2], comment: comment2 },
//   ...
//   { type: 'META', key: key1, value: value1 },
//   { type: 'META', key: key2, value: value2 },
//   ...
//   {}
// ]
//
// * objects with type 'CARRIER' represent an energy carrier component:
//   - carrier is the carrier name
//   - ctype is either 'PRODUCCION' or 'CONSUMO' por produced or used energy
//   - csubtype defines:
//     - the energy origin for produced energy (INSITU or COGENERACION)
//     - the energy end use (EPB or NEPB) for delivered energy
//   - values is a list of energy values, one for each timestep
//   - comment is a comment string for the carrier
//
// * objects with type 'META' represent metadata
//   - key is the metadata name
//   - value is the metadata value
export function string_to_carrier_list(datastring) {
  const datalines = datastring.replace('\n\r', '\n').split('\n')
        .map(l => l.trim())
        .filter(l => !(l === '' || l.startsWith('vector')))
        .filter(v => v !== null);

  const components = datalines
    .filter(line => !line.startsWith('#'))
    .map(line => {
      const [fieldsstring, comment = ''] = line.split('#', 2).map(pp => pp.trim());
      const fieldslist = fieldsstring.split(',').map(ff => ff.trim());
      let [ carrier, ctype, csubtype, ...values ] = fieldslist;
      if (fieldslist.lenght < 4) {
        throw new UserException(`Invalid number of items in: ${ fieldsstring }`);
      }

      validate_carrier(carrier, ctype, csubtype, fieldsstring);

      // Try to find service tag or use generic tag
      let service;
      const maybeservice = values[0];
      if (maybeservice.match(TAG_REGEX) || maybeservice === '') {
        service = maybeservice === '' ? 'NODEFINIDO' : maybeservice;
        values = values.splice(1);
      } else {
        const legacy_service = comment.match(LEGACY_SERVICE_TAG_REGEX);
        service = legacy_service ? legacy_service[0] : 'NODEFINIDO';
      }

      values = values.map(Number);
      return { type: 'CARRIER', carrier, ctype, csubtype, service, values, comment };
    });

  if (components.length === 0) {
    const EMPTYCOMPONENT = {
      type: 'CARRIER',
      carrier: 'ELECTRICIDAD',
      ctype: 'CONSUMO',
      csubtype: 'EPB',
      values: [0.0],
      comment: ''
    };
    components.push(EMPTYCOMPONENT);
  }

  const lengths = components.map(datum => datum.values.length);
  const numSteps = Math.max(...lengths);
  const errLengths = lengths.filter(v => v < numSteps);

  if (errLengths.length !== 0) {
    throw new UserException(`All input must have the same number of timesteps.
${ errLengths.length } lines with less than ${ numSteps } values.`);
  }

  const floatRegex = /^[+-]?([0-9]+([.,][0-9]*)?|[.,][0-9]+)$/;
  const meta = datalines
    .filter(line => line.startsWith('#META') || line.startsWith('#CTE_'))
    .map(line => line.slice('#META'.length)) // strips #CTE_ too
    .map(line => {
      const [key, svalue] = line.split(':', 2).map(l => l.trim());
      const value = svalue.match(floatRegex) ? parseFloat(svalue) : svalue;
      return { type: 'META', key, value };
    });

  return [ ...components, ...meta ];
}

// Convert energy data as carrierlist to string
export function carrier_list_to_string(carrierlist) {
  const metas = carrierlist
    .filter(e => e.type === 'META')
    .map(m => `#META ${ m.key }: ${ m.value }`);
  const carriers = carrierlist
    .filter(e => e.type === 'CARRIER')
    .map(cc => {
      const { carrier, ctype, csubtype, values, comment } = cc;
      const valuelist = values.map(v=> v.toFixed(2)).join(',');
      return `${ carrier }, ${ ctype }, ${ csubtype }, ${ valuelist } #${ comment }`;
    });
  return [...metas, ...carriers].join('\n');
}

// Read energy weighting factors data from string
//
// Input format:
//
// String composed of metadata or factor lines.
//
// Space only lines, lines starting with 'vector,' (backcompat)
// and lines starting with '#' which are not metadata lines are ignored
//
// Metadata lines:
//  - start with #META key: value
//  - are stored as objects with keys in [type, key, value]:
//    { type: META, key: string, value: string }
// Factor lines:
//  - Composed of 6 comma separated fields and an optional comment
//  - Any content after a '#' is considered a comment
//  - are stored as objects with keys in [ type, carrier, source, use, step, ren, nren, comment]
//    { type: FACTOR, carrier: string, source: string, use: string: step: string, ren: float, nren: float, comment: string }
//
// Returns: list of objects representing metadata and factor data.
//
export function string_to_weighting_factors(factorsstring) {
  const contentlines = factorsstring.replace('\n\r', '\n')
    .split('\n').map(l => l.trim()).filter(l => l !== '' && !l.startsWith('vector,'));

  const metas = contentlines.filter(l => l.startsWith('#META'))
    .map(l => l.substr('#META'.length).split(':', 2).map(e => e.trim()))
    .map(([key, value = '']) => ({ type: 'META', key, value }));


  const factors = contentlines.filter(l => !l.startsWith('#'))
    .map(l => l.split('#', 2).map(e => e.trim())) // [fields, str | undefined]
    .map(([fieldsstring, comment = '']) => {
      const fieldslist = fieldsstring.split(',').map(e => e.trim());
      if (fieldslist.length !== 6) {
        throw new UserException(`WeightingFactorParsing: Wrong number of fields in ${ fieldsstring }`);
      }
      const [ carrier, source, use, step, sren, snren ] = fieldslist;
      try {
        const ren = parseFloat(sren);
        const nren = parseFloat(snren);
        return { type: 'FACTOR', carrier, source, use, step, ren, nren, comment };
      } catch (err) {
        throw new UserException(`WeightingFactorsParsing: ren (${ sren }) or nren (${ snren }) can't be converted to float`);
      }
    });
  return [ ...metas, ...factors ];
}

// TODO: const fP = sanitize_weighting_factors(fp);
// TODO: Podría avisar si no existe un factor: ['MEDIOAMBIENTE', 'RED', 'input', 'A', 1.000, 0.000]
// TODO: podría considerar que to_nEPB es igual a to_grid si no se define
// TODO: podría considerar que to_grid es igual a input si no se define

// Utility output functions ---------------------------------------------------

// Format energy efficiency indicators as string from primary energy data
export function ep2string(EP, area = 1.0) {
  const areafactor = 1.0 / area;

  const eparen = areafactor * EP.EP.A.ren;
  const epanren = areafactor * EP.EP.A.nren;
  const epatotal = eparen + epanren;
  const eparer = epatotal ? eparen / epatotal : 0.0;

  const epren = areafactor * EP.EP.B.ren;
  const epnren = areafactor * EP.EP.B.nren;
  const eptotal = epren + epnren;
  const eprer = eptotal ? epren / eptotal : 0.0;

  return 'EP(step A)  , ren =' + eparen.toFixed(1) + ', nren=' + epanren.toFixed(1) + ', '
    + 'tot =' + epatotal.toFixed(1) + ', RER =' + eparer.toFixed(2) + '\n'
    + 'EP(step A+B), ren =' + epren.toFixed(1) + ', nren=' + epnren.toFixed(1) + ', '
    + 'tot =' + eptotal.toFixed(1) + ', RER =' + eprer.toFixed(2) + '\n';
}

// Convert EP object to epdict
export function ep2dict(EP, area = 1.0) {
  const areafactor = 1.0 / area;
  const EPAren = areafactor * EP.EP.A.ren;
  const EPAnren = areafactor * EP.EP.A.nren;
  const EPAtotal = EPAren + EPAnren;
  const EPArer = (EPAtotal === 0) ? 0 : EPAren / EPAtotal;
  const EPren = areafactor * EP.EP.B.ren;
  const EPnren = areafactor * EP.EP.B.nren;
  const EPtotal = EPren + EPnren;
  const EPrer = (EPtotal === 0) ? 0 : EPren / EPtotal;
  return { EPAren, EPAnren, EPAtotal, EPArer, EPren, EPnren, EPtotal, EPrer };
}

// --------------------------------------------------------------------
// Energy calculation functions
// --------------------------------------------------------------------

// ///////////// ByCarrier timestep and annual computations ////////////

// Calculate energy balance for carrier
//
//    cr_i_list: list of components for carrier_i
//     [ {carrier: carrier_i, ctype: ctype1, csubtype: csubtype1, values: [...values1], comment: comment1},
//       {carrier: carrier_i, ctype: ctype2, csubtype: csubtype2, values: [...values2], comment: comment2},
//       ...
//     ]
//
//    k_exp: exported energy factor [0, 1]
//
//    fp_cr: weighting factors for carrier
//
//    This follows the ISO EN 52000-1 procedure for calculation of delivered,
//    exported and weighted energy balance.
//
function balance_cr(cr_i_list, fp_cr, k_exp) {
  // ------------ Delivered and exported energy
  const numSteps = cr_i_list[0].values.length;
  const EMPTYVALUES = Array(numSteps).fill(0.0);

  // * Energy used by technical systems for EPB services, for each time step
  const E_EPus_cr_t = cr_i_list
    .filter(e => e.ctype === 'CONSUMO')
    .filter(e => e.csubtype === 'EPB')
    .reduce(
      (acc, e) => vecvecsum(acc, e.values),
      [ ...EMPTYVALUES ]
    );

  // * Energy used by technical systems for non-EPB services, for each time step
  const E_nEPus_cr_t = cr_i_list
    .filter(e => e.ctype === 'CONSUMO')
    .filter(e => e.csubtype === 'NEPB')
    .reduce(
      (acc, e) => vecvecsum(acc, e.values),
      [ ...EMPTYVALUES ]
    );

  // * Produced on-site energy and inside the assessment boundary, by generator i (origin i)
  const E_pr_cr_pr_i_t = cr_i_list
  .filter(e => e.ctype === 'PRODUCCION')
  .reduce(
    (acc, e) => ({
      ...acc,
      [e.csubtype]: vecvecsum(acc[e.csubtype] || [ ...EMPTYVALUES ], e.values)
    }),
    {}
  );

  // Annually produced on-site energy from generator i (origin i)
  const E_pr_cr_pr_i_an = Object.keys(E_pr_cr_pr_i_t).reduce((obj, gen) =>
  ({ ...obj, [gen]: vecsum(E_pr_cr_pr_i_t[gen]) }),
  {});

  // PRODUCED ENERGY GENERATORS (ORIGINS)
  const pr_generators = Object.keys(E_pr_cr_pr_i_t); // INSITU, COGENERACION

  // * Energy produced on-site and inside the assessment boundary (formula 30)
  const E_pr_cr_t = (pr_generators.length ?
    veclistsum(pr_generators.map(gen => E_pr_cr_pr_i_t[gen])) : [ ...EMPTYVALUES ]);
  const E_pr_cr_an = vecsum(E_pr_cr_t);

  // * Produced energy from all origins for EPB services for each time step (formula 31)
  // TODO: f_match_t constante para electricidad (formula 32)
  // let f_match_t = fmatch(E_pr_cr_t / E_EPus_cr_t)
  const f_match_t = E_EPus_cr_t.map(x => 1.0);

  const E_pr_cr_used_EPus_t = vecvecmul(f_match_t, vecvecmin(E_EPus_cr_t, E_pr_cr_t));

  // * Exported energy for each time step (produced energy not consumed in EPB uses) (formula 33)
  // E_pr_cr_t = E_pr_cr_used_EPus_t + E_exp_cr_used_nEPus_t + E_exp_cr_grid_t
  // E_exp_cr_t = E_exp_cr_used_nEPus_t + E_exp_cr_grid_t
  const E_exp_cr_t = vecvecdif(E_pr_cr_t, E_pr_cr_used_EPus_t);

  // * Exported energy used for non-EPB uses for each time step (formula 34)
  const E_exp_cr_used_nEPus_t = vecvecmin(E_exp_cr_t, E_nEPus_cr_t);

  // * Annualy exported energy used for non-EPB uses for carrier
  const E_exp_cr_used_nEPus_an = vecsum(E_exp_cr_used_nEPus_t);

  // * Energy exported to the grid for each interval (formula 35)
  const E_exp_cr_grid_t = vecvecdif(E_exp_cr_t, E_exp_cr_used_nEPus_t);

  // * Annualy exported energy to the grid for carrier (formula 36)
  const E_exp_cr_grid_an = vecsum(E_exp_cr_grid_t);

  // * Delivered energy (by the grid) for EP uses for each interval (formula 37)
  const E_del_cr_t = vecvecdif(E_EPus_cr_t, E_pr_cr_used_EPus_t);

  // * Annualy delivered energy (by the grid) for EP uses for carrier (formula 38)
  const E_del_cr_an = vecsum(E_del_cr_t);

  // ** Weighting depending on energy generator **

  // Exported energy by generator i i (origin) (9.6.6.2)
  // Implementation WITHOUT priorities on energy use

  // * Fraction of produced energy tipe i (origin from generator i) (formula 14)
  const f_pr_cr_i = pr_generators.reduce((obj, gen) =>
    ({ ...obj, [gen]: (E_pr_cr_an < 1e-3) ? 0 : E_pr_cr_pr_i_an[gen] / E_pr_cr_an }),
    {});

  // * Energy used for produced carrier energy type i (origin from generator i) (formula 15)
  const E_pr_cr_i_used_EPus_t = pr_generators.reduce((obj, gen) =>
    ({ ...obj, [gen]: veckmul(E_pr_cr_used_EPus_t, f_pr_cr_i[gen]) }),
    {});

  // * Exported energy from generator i (origin i) (formula 16)
  const E_exp_cr_pr_i_t = pr_generators.reduce((obj, gen) =>
    ({ ...obj, [gen]: vecvecdif(E_pr_cr_pr_i_t[gen], E_pr_cr_i_used_EPus_t[gen]) }),
    {});

  // * Annually exported energy from generator i (origin i)
  const E_exp_cr_pr_i_an = Object.keys(E_exp_cr_pr_i_t).reduce((obj, gen) =>
    ({ ...obj, [gen]: vecsum(E_exp_cr_pr_i_t[gen]) }),
    {});


  // -------- Weighted delivered and exported energy (11.6.2.1, 11.6.2.2, 11.6.2.3 + eq 2, 3)
  // NOTE: All weighting factors have been considered constant through all timesteps
  // NOTE: This allows using annual quantities and not timestep expressions

  // * Weighted energy for delivered energy: the cost of producing that energy

  // 1) Delivered energy from the grid
  // NOTE: grid delivered energy is energy which is used but not produced (on-site or nearby)
  const fpA_grid = fp_cr.find(fp =>
    fp.use === 'input'
    && fp.step === 'A'
    && fp.source === 'RED'
  );
  const E_we_del_cr_grid_an = {
    ren: E_del_cr_an * fpA_grid.ren,
    nren: E_del_cr_an * fpA_grid.nren
  }; // formula 19, 39

  // 2) Delivered energy from non cogeneration sources
  const delivery_sources = Object.keys(E_pr_cr_pr_i_an).filter(s => s !== 'RED' && s !== 'COGENERACION');
  const E_we_del_cr_pr_an = delivery_sources.reduce(
    (obj, gen) => {
      const fpA_pr_i = fp_cr.find(fp => fp.use === 'input' && fp.step === 'A' && fp.source === gen);
      const E_pr_i = E_pr_cr_pr_i_an[gen];
      if (E_pr_i === 0) { return obj; }
      return {
        ren: obj.ren + E_pr_i * fpA_pr_i.ren,
        nren: obj.nren + E_pr_i * fpA_pr_i.nren
      };
    },
    { ren: 0, nren: 0 }
  );

  // 3) Total delivered energy: grid + all non cogeneration
  const E_we_del_cr_an = {
    ren: E_we_del_cr_grid_an.ren + E_we_del_cr_pr_an.ren,
    nren: E_we_del_cr_grid_an.nren + E_we_del_cr_pr_an.nren
  }; // formula 19, 39


  // * Weighted energy for exported energy: depends on step A or B

  let E_we_exp_cr_an_A;
  let E_we_exp_cr_an_AB;
  let E_we_exp_cr_an;
  let E_we_exp_cr_used_nEPus_an_AB;
  let E_we_exp_cr_grid_an_AB;

  const E_exp_cr_an = E_exp_cr_used_nEPus_an + E_exp_cr_grid_an;
  if (E_exp_cr_an === 0) {
    // There's no exportation, either because the carrier cannot be exported
    // or there's no effective exportation
    E_we_exp_cr_an_A = { ren: 0.0, nren: 0.0 };
    E_we_exp_cr_an_AB = { ren: 0.0, nren: 0.0 };
    E_we_exp_cr_an = { ren: 0.0, nren: 0.0 };
    E_we_exp_cr_used_nEPus_an_AB = { ren: 0.0, nren: 0.0 };
    E_we_exp_cr_grid_an_AB = { ren: 0.0, nren: 0.0 };
  } else {
    // * Step A: weighting depends on exported energy generation (origin generator)
    // Factors are averaged weighting by production for each origin (no priority, 9.6.6.2.4)

     // * Fraction of produced energy tipe i (origin from generator i) that is exported (formula 14)
    // NOTE: simplified for annual computations (not valid for timestep calculation)
    const F_pr_i = pr_generators.reduce((obj, gen) => {
      if (E_exp_cr_pr_i_an[gen] === 0) { return obj; } // Don't store generators without generation
      return { ...obj, [gen]: vecsum(E_exp_cr_pr_i_t[gen]) / E_exp_cr_pr_i_an[gen] };
    },
    {});
    const exp_generators = Object.keys(F_pr_i);

    // Weighting factors for energy exported to nEP uses (step A) (~formula 24)
    let f_we_exp_cr_stepA_nEPus;
    if (E_exp_cr_used_nEPus_an === 0) { // No energy exported to nEP uses
      f_we_exp_cr_stepA_nEPus = { ren: 0, nren: 0 };
    } else {
      const fpA_nEPus_i = fp_cr.filter(fp => fp.use === 'to_nEPB' && fp.step === 'A');
      f_we_exp_cr_stepA_nEPus = exp_generators
        .reduce((acc, gen) => {
          const F_g = F_pr_i[gen];
          const fpA_g = fpA_nEPus_i.find(fp => fp.source === gen);
          return { ren: acc.ren + F_g * fpA_g.ren, nren: acc.nren + F_g * fpA_g.nren };
        },
        { ren: 0.0, nren: 0.0 }
      ); // suma de todos los i: fpA_nEPus_i * F_pr_i[gen]
    }

    // Weighting factors for energy exported to the grid (step A) (~formula 25)
    let f_we_exp_cr_stepA_grid;
    if (E_exp_cr_grid_an === 0) { // No energy exported to grid
      f_we_exp_cr_stepA_grid = { ren: 0, nren: 0 };
    } else {
      const fpA_grid_i = fp_cr.filter(fp => fp.use === 'to_grid' && fp.step === 'A');
      f_we_exp_cr_stepA_grid = exp_generators
        .reduce((acc, gen) => {
          const F_g = F_pr_i[gen];
          const fpA_g = fpA_grid_i.find(fp => fp.source === gen);
          return { ren: acc.ren + F_g * fpA_g.ren, nren: acc.nren + F_g * fpA_g.nren };
        },
        { ren: 0.0, nren: 0.0 }
      ); // suma de todos los i: fpA_grid_i * F_pr_i[gen];
    }

    // Weighted exported energy according to resources used to generate that energy (formula 23)
    E_we_exp_cr_an_A = {
      ren: E_exp_cr_used_nEPus_an * f_we_exp_cr_stepA_nEPus.ren // formula 24
           + E_exp_cr_grid_an * f_we_exp_cr_stepA_grid.ren, // formula 25
      nren: E_exp_cr_used_nEPus_an * f_we_exp_cr_stepA_nEPus.nren // formula 24
            + E_exp_cr_grid_an * f_we_exp_cr_stepA_grid.nren // formula 25
    };

    // * Step B: weighting depends on exported energy generation and avoided resources on the grid

    // Factors of contribution for energy exported to nEP uses (step B)
    let f_we_exp_cr_used_nEPus;
    if (E_exp_cr_used_nEPus_an === 0) { // No energy exported to nEP uses
      f_we_exp_cr_used_nEPus = { ren: 0, nren: 0 };
    } else {
      const fpB_nEPus_i = fp_cr.filter(fp => fp.use === 'to_nEPB' && fp.step === 'B');
      f_we_exp_cr_used_nEPus = exp_generators
        .reduce((acc, gen) => {
          const F_g = F_pr_i[gen];
          const fpB_g = fpB_nEPus_i.find(fp => fp.source === gen);
          return { ren: acc.ren + F_g * fpB_g.ren, nren: acc.nren + F_g * fpB_g.nren };
        },
        { ren: 0.0, nren: 0.0 }
      ); // suma de todos los i: fpB_nEPus_i * F_pr_i[gen]
    }

    // Weighting factors for energy exported to the grid (step B)
    let f_we_exp_cr_grid;
    if (E_exp_cr_grid_an === 0) { // No energy exported to grid
      f_we_exp_cr_grid = { ren: 0, nren: 0 };
    } else {
      const fpB_grid_i = fp_cr.filter(fp => fp.use === 'to_grid' && fp.step === 'B');
      f_we_exp_cr_grid = exp_generators
        .reduce((acc, gen) => {
          const F_g = F_pr_i[gen];
          const fpB_g = fpB_grid_i.find(fp => fp.source === gen);
          return { ren: acc.ren + F_g * fpB_g.ren, nren: acc.nren + F_g * fpB_g.nren };
        },
        { ren: 0.0, nren: 0.0 }
      ); // suma de todos los i: fpB_grid_i * F_pr_i[gen];
    }

    // Effect of exported energy on weighted energy performance (step B) (formula 26)

    E_we_exp_cr_used_nEPus_an_AB = {
      ren: E_exp_cr_used_nEPus_an * (f_we_exp_cr_used_nEPus.ren - f_we_exp_cr_stepA_nEPus.ren),
      nren: E_exp_cr_used_nEPus_an * (f_we_exp_cr_used_nEPus.nren - f_we_exp_cr_stepA_nEPus.nren)
    };

    E_we_exp_cr_grid_an_AB = {
      ren: E_exp_cr_grid_an * (f_we_exp_cr_grid.ren - f_we_exp_cr_stepA_grid.ren),
      nren: E_exp_cr_grid_an * (f_we_exp_cr_grid.nren - f_we_exp_cr_stepA_grid.nren)
    };

    E_we_exp_cr_an_AB = {
      ren: E_we_exp_cr_used_nEPus_an_AB.ren + E_we_exp_cr_grid_an_AB.ren,
      nren: E_we_exp_cr_used_nEPus_an_AB.nren + E_we_exp_cr_grid_an_AB.nren
    };

    // Contribution of exported energy to the annual weighted energy performance
    // 11.6.2.1, 11.6.2.2, 11.6.2.3
    E_we_exp_cr_an = {
      ren: E_we_exp_cr_an_A.ren + k_exp * E_we_exp_cr_an_AB.ren,
      nren: E_we_exp_cr_an_A.nren + k_exp * E_we_exp_cr_an_AB.nren
    }; // (formula 20)
  }

  // * Total result for step A
  const E_we_cr_an_A = {
    ren: E_we_del_cr_an.ren - E_we_exp_cr_an_A.ren,
    nren: E_we_del_cr_an.nren - E_we_exp_cr_an_A.nren
  }; // Partial result for carrier (formula 2)

  // * Total result for step B
  const E_we_cr_an = {
    ren: E_we_del_cr_an.ren - E_we_exp_cr_an.ren,
    nren: E_we_del_cr_an.nren - E_we_exp_cr_an.nren
  }; // Partial result for carrier (formula 2)

  const balance = {
    used_EPB: E_EPus_cr_t,
    used_nEPB: E_nEPus_cr_t,
    produced_bygen: E_pr_cr_pr_i_t,
    produced_bygen_an: E_pr_cr_pr_i_an,
    produced: E_pr_cr_t,
    produced_an: E_pr_cr_an,
    f_match: f_match_t, // load matching factor
    exported: E_exp_cr_t, // exp_used_nEPus + exp_grid
    exported_an: E_exp_cr_an,
    exported_byorigin: E_exp_cr_pr_i_t,
    exported_byorigin_an: E_exp_cr_pr_i_an,
    exported_grid: E_exp_cr_grid_t,
    exported_grid_an: E_exp_cr_grid_an,
    exported_nEPB: E_exp_cr_used_nEPus_t,
    exported_nEPB_an: E_exp_cr_used_nEPus_an,
    delivered_grid: E_del_cr_t,
    delivered_grid_an: E_del_cr_an,
    // Weighted energy: { ren, nren }
    we_delivered_grid_an: E_we_del_cr_grid_an,
    we_delivered_prod_an: E_we_del_cr_pr_an,
    we_delivered_an: E_we_del_cr_an,
    we_exported_an_A: E_we_exp_cr_an_A,
    we_exported_nEPB_an_AB: E_we_exp_cr_used_nEPus_an_AB,
    we_exported_grid_and_AB: E_we_exp_cr_grid_an_AB,
    we_exported_an_AB: E_we_exp_cr_an_AB,
    we_exported_an: E_we_exp_cr_an,
    we_an_A: E_we_cr_an_A,
    we_an: E_we_cr_an
  };

  return balance;
}

// Compute overall energy performance aggregating results for all energy carriers
//
//
export function energy_performance(carrierlist, fp, k_exp) {
  const CARRIERS = [...new Set(carrierlist.map(e => e.carrier))];

  // Compute balance
  let balance_cr_i = {};
  CARRIERS.map(carrier => {
    const fp_cr = fp.filter(e => e.carrier === carrier);
    const cr_i_list = carrierlist.filter(e => e.carrier === carrier);
    balance_cr_i[carrier] = balance_cr(cr_i_list, fp_cr, k_exp);
  });

  const EP = Object.keys(balance_cr_i)
    .reduce(
      (acc, cr) => ({
        // E_we_an =  E_we_del_an - E_we_exp_an; // formula 2 step A
        A: { ren: acc.A.ren + balance_cr_i[cr].we_an_A.ren,
             nren: acc.A.nren + balance_cr_i[cr].we_an_A.nren },
        // E_we_an =  E_we_del_an - E_we_exp_an; // formula 2 step B
        B: { ren: acc.B.ren + balance_cr_i[cr].we_an.ren,
             nren: acc.B.nren + balance_cr_i[cr].we_an.nren },
        // Weighted energy partials
        we_del: { ren: acc.we_del.ren + balance_cr_i[cr].we_delivered_an.ren,
                  nren: acc.we_del.nren + balance_cr_i[cr].we_delivered_an.nren },
        we_exp_A: { ren: acc.we_exp_A.ren + balance_cr_i[cr].we_exported_an_A.ren,
                    nren: acc.we_exp_A.nren + balance_cr_i[cr].we_exported_an_A.nren },
        we_exp: { ren: acc.we_exp.ren + balance_cr_i[cr].we_exported_an.ren,
                  nren: acc.we_exp.nren + balance_cr_i[cr].we_exported_an.nren }
      }),
    { A: { ren: 0, nren: 0 }, B: { ren: 0, nren: 0 },
      we_del: { ren: 0, nren: 0 }, we_exp_A: { ren: 0, nren: 0 }, we_exp: { ren: 0, nren: 0 } }
    );

  return {
    carrierlist,
    k_exp,
    fp,
    balance_cr_i,
    EP
  };
}
