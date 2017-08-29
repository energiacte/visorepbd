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

// -----------------------------------------------------------------------------------
// Vector utilities
// -----------------------------------------------------------------------------------
export const zip = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]));

// Elementwise sum res[i] = vec1[i] + vec2[i] + ... + vecj[i]
export function veclistsum(veclist) {
  return zip(...veclist).map(valsi => valsi.reduce((a, b) => a + b, 0));
}

// Elementwise minimum min res[i] = min(vec1[i], vec2[i])
export function vecvecmin(vec1, vec2) {
  return vec1.map((el, ii) => Math.min(el, vec2[ii]));
}

// Elementwise sum of arrays
export function vecvecsum(vec1, vec2) {
  return vec1.map((el, ii) => el + vec2[ii]);
}

// Elementwise difference res[i] = vec1[i] - vec2[i]
export function vecvecdif(vec1, vec2) {
  return vec1.map((el, ii) => el - vec2[ii]);
}

// Elementwise multiplication res[i] = vec1[i] * vec2[i]
export function vecvecmul(vec1, vec2) {
  return vec1.map((el, ii) => el * vec2[ii]);
}

// Multiply vector by scalar
export function veckmul(vec1, k) {
  return vec1.map(v => v * k);
}

// Sum all elements in a vector
export const vecsum = vec => vec.reduce((a, b) => a + b, 0);
