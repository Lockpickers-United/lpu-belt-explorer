const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "commonjs",
      globals: {
        ...globals.es2017,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "arrow-parens": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "eol-last": ["error", "always"],
      indent: ["error", 2, {
        CallExpression: {arguments: 2},
        FunctionDeclaration: {
          body: 1,
          parameters: 2,
        },
        FunctionExpression: {
          body: 1,
          parameters: 2,
        },
        MemberExpression: 2,
        ObjectExpression: 1,
        SwitchCase: 1,
        ignoredNodes: ["ConditionalExpression"],
      }],
      "max-len": ["error", {
        code: 80,
        comments: 80,
        ignoreUrls: true,
      }],
      "no-restricted-globals": ["error", "name", "length"],
      "no-trailing-spaces": "error",
      "no-unused-vars": ["error", {args: "none"}],
      "object-curly-spacing": ["error", "never"],
      "prefer-arrow-callback": "error",
      quotes: ["error", "double", {allowTemplateLiterals: true}],
      semi: ["error", "always"],
      "space-before-function-paren": ["error", {
        anonymous: "never",
        asyncArrow: "always",
        named: "never",
      }],
    },
  },
  {
    files: ["**/*.spec.js", "**/*.test.js"],
    languageOptions: {
      globals: globals.mocha,
    },
  },
];
