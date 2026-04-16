import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: [".next/**", "dist/**", "node_modules/**"]
  },
  {
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-prototype-builtins": "off",
      "no-constant-condition": "off",
      "no-useless-escape": "off",
      "no-constant-binary-expression": "off",
      "no-empty": "off",
      "no-useless-assignment": "off",
      "no-cond-assign": "off",
      "no-redeclare": "off",
      "no-case-declarations": "off",
      "no-fallthrough": "off",
      "no-unsafe-finally": "off",
      "no-control-regex": "off",
      "no-misleading-character-class": "off",
      "no-func-assign": "off",
      "no-unassigned-vars": "off",
      "preserve-caught-error": "off",
      "getter-return": "off",
      "no-unused-private-class-members": "off",
      "no-extra-boolean-cast": "off",
      "no-sparse-arrays": "off"
    }
  }
];
