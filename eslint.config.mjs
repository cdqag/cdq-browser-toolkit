import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginStylistic from "@stylistic/eslint-plugin-js"


export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"]
  },
  {
    ignores: [
      "webpack.*",
      "*.scss"
    ]
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      '@stylistic/js': pluginStylistic
    }
  },
  {
    settings: {
      react: {
        version: 16
      }
    },
    rules: {
      "curly": ["error", "all"],
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "no-prototype-builtins": "off",

      "react/no-deprecated": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/no-find-dom-node": "off",
      "react/no-string-refs": "off",

      "@stylistic/js/array-bracket-newline": ["error", "consistent"],
      "@stylistic/js/array-element-newline": ["error", "consistent"],
      "@stylistic/js/block-spacing": "error"
    }
  }
];
