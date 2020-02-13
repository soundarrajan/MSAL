module.exports = {
    "env": {
        "browser": true,
        "es6": false,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module",
        "ecmaVersion": 6,
        "ecmaFeatures": {
          "modules": true
        }
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/explicit-member-accessibility": [
            "off",
            {
                "accessibility": "explicit"
            }
        ],
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/unified-signatures": "error",
        "arrow-body-style": "error",
        "camelcase": "off",
        "constructor-super": "error",
        "dot-notation": "off",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "id-blacklist": "off",
        "id-match": "off",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-console": [
            "error",
            {
                "allow": [
                    "log",
                    "warn",
                    "dir",
                    "timeLog",
                    "assert",
                    "clear",
                    "count",
                    "countReset",
                    "group",
                    "groupEnd",
                    "table",
                    "dirxml",
                    "error",
                    "groupCollapsed",
                    "Console",
                    "profile",
                    "profileEnd",
                    "timeStamp",
                    "context"
                ]
            }
        ],
        "no-debugger": "error",
        "no-empty": "off",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-new-wrappers": "error",
        "no-restricted-imports": [
            "error",
            "rxjs/Rx"
        ],
        "no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "off",
        "no-unused-expressions": "error",
        "no-var": "error",
        "prefer-const": "error",
        "radix": "error",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    // "component-class-suffix": true,
                    // "component-selector": [
                    //     true,
                    //     "element",
                    //     "app",
                    //     "kebab-case"
                    // ],
                    // "directive-class-suffix": true,
                    // "directive-selector": [
                    //     true,
                    //     "attribute",
                    //     "app",
                    //     "camelCase"
                    // ],
                    // "no-input-rename": true,
                    // "no-output-on-prefix": true,
                    // "no-output-rename": true,
                    // "nx-enforce-module-boundaries": [
                    //     true,
                    //     {
                    //         "allow": [],
                    //         "depConstraints": [
                    //             {
                    //                 "sourceTag": "*",
                    //                 "onlyDependOnLibsWithTags": [
                    //                     "*"
                    //                 ]
                    //             }
                    //         ]
                    //     }
                    // ],
                    "typedef": [
                        true,
                        "call-signature",
                        "property-declaration",
                        "parameter"
                    ],
                    // "use-host-property-decorator": true,
                    // "use-input-property-decorator": true,
                    // "use-life-cycle-interface": true,
                    // "use-output-property-decorator": true,
                    // "use-pipe-transform-interface": true
                }
            }
        ]
    }
};
