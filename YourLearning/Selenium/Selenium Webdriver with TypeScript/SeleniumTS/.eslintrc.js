module.exports = {
    root: true,
    plugins: [
        "@typescript-eslint",
        "prettier"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    rules: {
        "@typescript-eslint/no-use-before-define": ["error", { "functions": false, "classes": true }],
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-as-const": "error",
        // "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/typedef": [
            "error",
            {
                "arrowParameter": true,
                "variableDeclaration": false
            }
        ],
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "semi": "off",
        "@typescript-eslint/semi": ["error"],

    },
    parserOptions: {
        "ecmaVersion": 2017
    },
    env: {
        "node": true,
        "es6": true,
        "jasmine": true
    }
};
