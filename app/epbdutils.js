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
