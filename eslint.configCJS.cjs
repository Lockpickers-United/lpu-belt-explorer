const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const _import = require("eslint-plugin-import");

const fileURLToPath = require("node:url")

const {
    fixupPluginRules,
    fixupConfigRules,
    includeIgnoreFile,
} = require("@eslint/compat");

const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));


module.exports = defineConfig([{
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".json"],
            },
        },
        "react": {
            "version": "detect"
        }
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: ["jsx"],
        },
    },

    plugins: {
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        import: fixupPluginRules(_import),
    },

    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/recommended",
    )),

    rules: {
        "react/prop-types": "off",

        "no-unused-vars": ["warn", {
            "ignoreRestSiblings": true,
        }],

        "react-hooks/exhaustive-deps": "warn",

        "quotes": ["warn", "single", {
            "avoidEscape": true,
        }],

        "eqeqeq": ["warn", "always"],
        "semi": ["warn", "never"],

        "import/extensions": [
            "warn",
            "ignorePackages",
            {
                js:    "always",
                jsx:   "always",
                json:  "always",
            },
        ],

        "import/no-unresolved": "off",
        "import/namespace": "off",
    },
}, globalIgnores([
    "**/*.md",
    "**/*.png",
    "**/*.gif",
    "**/*.csv",
    "**/*.html",
    "**/*.json",
    "**/*.css",
])]);
