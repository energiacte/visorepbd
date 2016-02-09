/* jshint browser: true */
(function () {
    'use strict';

    require("../css/style.scss");
    var component = require('./component.js');

    document.body.appendChild(component());
}());
