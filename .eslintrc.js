module.exports = {
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "plugins": ["babel", "react", "sorting"],
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "impliedStrict": true,
      "jsx": true
    },
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": [1, { "vars": "local", "args": "after-used", "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }], // disallow declaration of variables that are not used in the code
    "react/prop-types": 0,
    "no-console": "warn"
  }
}
