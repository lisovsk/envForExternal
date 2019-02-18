<template>
  <div class="rule-item">
    <div class="rule-header">
      <or-select
        v-model="valueType"
        :options="valueTypeOptions"
        :disabled="readonly || (ruleLocal.valueType === 'other' && refsLoaded && !canStringifyValues)"
        class="ui-select--no-style select-value-type"
      ></or-select>
    </div>
    <div class="rule-wrapper">
      <div
        v-if="valueType === 'number' || valueType === 'string'"
        :class="['rule-values', {'rule-values--single': ($parent.value.length < 2)}]"
      >
        <or-text-expression
          v-model="firstValue"
          :steps="steps"
          :step-id="stepId"
          :readonly="readonly"
          :invalid="isInvalidFirstValue"
          :error="firstValueErrorText"
        ></or-text-expression>
        <or-select
          v-model="ruleType"
          :options="displayRuleTypeOptions"
          :disabled="readonly"
          :class="['ui-select--no-style', {'single-value' : isDisabledSecondValue}]"
        ></or-select>
        <or-text-expression
          v-if="!isDisabledSecondValue"
          v-model="secondValue"
          :steps="steps"
          :step-id="stepId"
          :readonly="readonly"
          :invalid="isInvalidSecondValue"
          :error="secondValueErrorText"
        ></or-text-expression>
      </div>
      <div
        v-else-if="valueType === 'other'"
        :class="['rule-values', 'rule-code-values', {'rule-values--single': ($parent.value.length < 2)}]"
      >
        <or-code
          v-model="firstValue"
          :steps="steps"
          :step-id="stepId"
          :readonly="readonly"
          :invalid="isInvalidFirstValue"
          :error="firstValueErrorText"
          label="First value"
        ></or-code>
        <or-select
          v-model="ruleType"
          :options="displayRuleTypeOptions"
          :disabled="readonly"
          :class="['ui-select--no-style', {'rule-type-same': ruleTypeSame}, {'rule-type-not-same': ruleTypeNotSame}, {'single-value' : isDisabledSecondValue}]"
        ></or-select>
        <or-code
          v-if="!isDisabledSecondValue"
          v-model="secondValue"
          :steps="steps"
          :step-id="stepId"
          :readonly="readonly"
          :invalid="isInvalidSecondValue"
          :error="secondValueErrorText"
          label="Second value"
        ></or-code>
      </div>
      <div
        v-else
        :class="['rule-values', 'rule-code-mode', {'rule-values--single': ($parent.value.length < 2)}]"
      >
        <or-code
          v-model="codeValue"
          :steps="steps"
          :step-id="stepId"
          :readonly="readonly"
          :invalid="isInvalidCodeValue"
          :error="codeValueErrorText"
          label="Advanced"
        ></or-code>
      </div>
      <or-icon-button
        v-if="$parent.value.length > 1"
        @click="$emit('removeRule')"
        type="secondary"
        icon="delete_forever"
        :disabled="readonly"
        class="rule-values__remove-button"
        disableRipple
      ></or-icon-button>
    </div>

    <!-- This text expression created for using method of or-text-expression which is called "isStringExpression()" -->
    <or-text-expression
      value="``"
      class="hidden-text-expression"
      :steps="steps"
      :step-id="stepId"
      :readonly="readonly"
      ref="textExpression"
    ></or-text-expression>
  </div>
</template>
<script>
let validators;

try {
  validators = require("_validators");
} catch (error) {
  validators = require("../../../../helpers/validators/validators.js");
}

const { jsExpressionNonEmptyString, jsExpression } = validators.validators;

export default {
  props: {
    rule: {
      type: Object,
      default() {
        return {};
      }
    },
    rules: {
      type: Array,
      default() {
        return [];
      }
    },
    conditionGroups: {
      type: Array,
      default() {
        return [];
      }
    },
    conditionExits: {
      type: Array,
      default() {
        return [];
      }
    },
    isSingleExit: {
      type: Boolean,
      default: false
    },
    conditionRuleHasDataOut: {
      type: Boolean,
      default: true
    },
    stepId: "",
    steps: {
      type: Array,
      default() {
        return [];
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      ruleLocal: this.rule,
      isInvalidFirstValue: false,
      isInvalidSecondValue: false,
      isInvalidCodeValue: false,
      firstValueErrorText: "",
      secondValueErrorText: "",
      codeValueErrorText: "",
      refsLoaded: false, // flag that changes on "mounted" hook to be sure that refs are loaded. Used to control code values.
      ruleTypeSame: false,
      ruleTypeNotSame: false,
      valueTypeOptions: [
        { label: "string", value: "string" },
        { label: "number", value: "number" },
        { label: "object or array", value: "other" },
        { label: "advanced", value: "advanced" }
      ],
      ruleTypeOptions: {
        string: [
          {
            label: "contains",
            value: `function (firstValue, secondValue) {\nreturn _.includes(firstValue, secondValue);\n}`
          },
          {
            label: "doesn't contain",
            value: `function (firstValue, secondValue) {\nreturn !_.includes(firstValue, secondValue);\n}`
          },
          {
            label: "exactly matches",
            value: `function (firstValue, secondValue) {\nreturn _.isEqual(firstValue, secondValue);\n}`
          },
          {
            label: "starts with",
            value: `function (firstValue, secondValue) {\nreturn _.startsWith(firstValue, secondValue);\n}`
          },
          {
            label: "ends with",
            value: `function (firstValue, secondValue) {\nreturn _.endsWith(firstValue, secondValue);\n}`
          },
          {
            label: "is empty",
            value: `function (firstValue, secondValue) {\nreturn _.isEmpty(firstValue);\n}`
          },
          {
            label: "isn't empty",
            value: `function (firstValue, secondValue) {\nreturn !_.isEmpty(firstValue);\n}`
          }
        ],
        number: [
          {
            label: ">",
            value: `function (firstValue, secondValue) {\nreturn firstValue > secondValue;\n}`
          },
          {
            label: "<",
            value: `function (firstValue, secondValue) {\nreturn firstValue < secondValue;\n}`
          },
          {
            label: ">=",
            value: `function (firstValue, secondValue) {\nreturn firstValue >= secondValue;\n}`
          },
          {
            label: "<=",
            value: `function (firstValue, secondValue) {\nreturn firstValue <= secondValue;\n}`
          },
          {
            label: "=",
            value: `function (firstValue, secondValue) {\nreturn firstValue == secondValue;\n}`
          }
        ],
        other: [
          {
            label: "is exactly same as",
            value: `function (firstValue, secondValue) {\nreturn _.isEqual(firstValue, secondValue);\n}`
          },
          {
            label: "isn’t exactly same as",
            value: `function (firstValue, secondValue) {\nreturn !_.isEqual(firstValue, secondValue);\n}`
          },
          {
            label: "is empty",
            value: `function (firstValue, secondValue) {\nreturn _.isEmpty(firstValue);\n}`
          },
          {
            label: "isn't empty",
            value: `function (firstValue, secondValue) {\nreturn !_.isEmpty(firstValue);\n}`
          }
        ]
      }
    };
  },

  computed: {
    displayRuleTypeOptions() {
      const valueType = this.valueType || "string";
      const result = _.get(this.ruleTypeOptions, `${valueType}`);
      //this.ruleType = this.ruleLocal.ruleType || _.get(result, '[0].value');

      let inValueTypeIndex = _.findIndex(
        this.ruleTypeOptions[this.ruleLocal.valueType],
        ruleType => {
          return (
            this.ruleType === ruleType.label ||
            this.ruleType.replace(/\s/g, "") ===
              ruleType.value.replace(/\s/g, "")
          );
        }
      );

      if (inValueTypeIndex > -1) {
        this.ruleType = this.ruleTypeOptions[this.ruleLocal.valueType][
          inValueTypeIndex
        ].value;
      } else {
        this.ruleType = this.ruleTypeOptions[this.ruleLocal.valueType][0].value;
      }

      if (this.mountedFlag) this.calculatedFlag = true;

      return result;
    },

    firstValue: {
      get() {
        return this.ruleLocal.firstValue;
      },

      set(newValue) {
        if (this.calculatedFlag) this.validateValue(newValue, 1);
        this.ruleLocal.firstValue = newValue;
      }
    },

    valueType: {
      get() {
        return this.ruleLocal.valueType;
      },

      set(newValue) {
        if (newValue === "string" || newValue === "number") {
          if (this.ruleLocal.valueType === "other") {
            this.ruleLocal.firstValue = "``";
            this.ruleLocal.secondValue = "``";
          }

          this.validateValue(this.ruleLocal.firstValue, 1, newValue);
          // this.validateValue(this.ruleLocal.secondValue, 2, newValue);
        } else if (newValue === "advanced") {
          let firstValue = /\$\{this.*\}/.test(this.ruleLocal.firstValue)
            ? this.ruleLocal.firstValue.slice(3, -2)
            : this.valueType === "number"
              ? this.ruleLocal.firstValue.slice(1, -1)
              : this.ruleLocal.firstValue;

          let secondValue = /\$\{this.*\}/.test(this.ruleLocal.secondValue)
            ? this.ruleLocal.secondValue.slice(3, -2)
            : this.valueType === "number"
              ? this.ruleLocal.secondValue.slice(1, -1)
              : this.ruleLocal.secondValue;

          this.codeValue = this.ruleType
            .slice(this.ruleType.indexOf("return") + 7, -3)
            .replace("firstValue", firstValue)
            .replace("secondValue", secondValue);

          this.ruleLocal.firstValue = "``";
          this.ruleLocal.secondValue = "``";
          this.validateCodeValue(this.ruleLocal.codeValue);
        } else if (newValue === "other") {
          this.ruleLocal.firstValue = /\$\{this.*\}/.test(
            this.ruleLocal.firstValue
          )
            ? this.ruleLocal.firstValue.slice(3, -2)
            : "";
          this.ruleLocal.secondValue = /\$\{this.*\}/.test(
            this.ruleLocal.secondValue
          )
            ? this.ruleLocal.secondValue.slice(3, -2)
            : "";

          this.validateValue(this.ruleLocal.firstValue, 1, newValue);
          // this.validateValue(this.ruleLocal.secondValue, 2, newValue);
        }

        this.ruleLocal.valueType = newValue;
      }
    },

    secondValue: {
      get() {
        return this.ruleLocal.secondValue;
      },

      set(newValue) {
        // if (this.calculatedFlag) this.validateValue(newValue, 2);
        this.ruleLocal.secondValue = newValue;
      }
    },

    ruleType: {
      get() {
        return this.ruleLocal.ruleType;
      },

      set(newValue) {
        if (
          this.calculatedFlag ||
          this.conditionGroups.length > 1 ||
          this.conditionExits.length > 1 ||
          this.rules.length > 1
        ) {
          this.validateValue(this.ruleLocal.firstValue, 1);
          this.validateValue(this.ruleLocal.secondValue, 2);
          this.validateCodeValue(this.codeValue);
          this.ruleLocal.isValid = this.validateRule();
        }

        this.ruleLocal.ruleType = newValue;
      }
    },

    codeValue: {
      get() {
        return this.ruleLocal.codeValue;
      },

      set(newValue) {
        if (this.calculatedFlag) this.validateCodeValue(newValue);
        this.ruleLocal.codeValue = newValue;
      }
    },

    isDisabledSecondValue: {
      get() {
        return this.ruleLocal.isDisabledSecondValue;
      },

      set(newValue) {
        this.ruleLocal.isDisabledSecondValue = newValue;
      }
    },

    isValid: {
      get() {
        return this.ruleLocal.isValid;
      },

      set(newValue) {
        this.ruleLocal.isValid = newValue;
      }
    },

    mountedFlag: {
      get() {
        return this.ruleLocal.mountedFlag;
      },

      set(newValue) {
        this.ruleLocal.mountedFlag = newValue;
      }
    },

    calculatedFlag: {
      get() {
        return this.ruleLocal.calculatedFlag;
      },

      set(newValue) {
        this.ruleLocal.calculatedFlag = newValue;
      }
    },

    canStringifyValues() {
      return true;
      //return this.$refs.textExpression && this.$refs.textExpression.isStringExpression(this.ruleLocal.firstValue) && this.$refs.textExpression.isStringExpression(this.ruleLocal.secondValue);
    }
  },

  watch: {
    ruleLocal: {
      handler(newValue) {
        this.$emit("input", newValue);
        const isEmptyFunc = `function (firstValue, secondValue) {
                        return _.isEmpty(firstValue);
                    }`.replace(/\s/g, "");
        const isNotEmptyFunc = `function (firstValue, secondValue) {
                        return !_.isEmpty(firstValue);
                    }`.replace(/\s/g, "");
        const isSame = `function (firstValue, secondValue) {\nreturn _.isEqual(firstValue, secondValue);\n}`;
        const isNotSame = `function (firstValue, secondValue) {\nreturn !_.isEqual(firstValue, secondValue);\n}`;
        const ruleType = newValue.ruleType.toString().replace(/\s/g, "");

        this.ruleLocal.isDisabledSecondValue =
          ruleType === isEmptyFunc || ruleType === isNotEmptyFunc
            ? true
            : false;

        this.ruleLocal.isValid = this.validateRule();

        // for changing the width of the rule type select display-value
        this.ruleTypeSame =
          newValue.valueType === "other" && newValue.ruleType === isSame
            ? true
            : false;
        this.ruleTypeNotSame =
          newValue.valueType === "other" && newValue.ruleType === isNotSame
            ? true
            : false;
      },
      deep: true
    }
  },

  methods: {
    validateValue(value, valueField, valueType) {
      let isMergeField = /\$\{this.*\}/.test(value);
      let isEmptyMergeField = isMergeField
        ? _.isEmpty(_.replace(value, /^\`\$\{this\.get\(\'|\'\)\}\`$/gm, ""))
        : false;

      valueType = valueType ? valueType : this.valueType;

      if (
        valueType === "number" &&
        isNaN(value.slice(1, -1).trim()) &&
        !isMergeField
      ) {
        let errorText = "Invalid number.";

        if (valueField === 1) {
          this.isInvalidFirstValue = true;
          this.firstValueErrorText = errorText;
        } else {
          this.isInvalidSecondValue = true;
          this.secondValueErrorText = errorText;
        }
      } else if (
        valueType !== "advanced" &&
        valueType !== "other" &&
        (_.isEmpty(value.slice(1, -1).trim()) || isEmptyMergeField)
      ) {
        let errorText = "The field is required.";

        if (valueField === 1) {
          this.isInvalidFirstValue = true;
          this.firstValueErrorText = errorText;
        } else {
          this.isInvalidSecondValue = true;
          this.secondValueErrorText = errorText;
        }
      } else if (valueType === "other") {
        let errorText;

        if (
          _.isEmpty(value.trim()) ||
          !validators.jsExpressionNonEmptyString(value.trim())
        ) {
          errorText = "The field is required.";
          if (valueField === 1) {
            this.isInvalidFirstValue = true;
            this.firstValueErrorText = errorText;
          } else {
            this.isInvalidSecondValue = true;
            this.secondValueErrorText = errorText;
          }
        } else if (!validators.jsExpression(value.trim())) {
          errorText = "Please enter a valid JavaScript expression.";
          if (valueField === 1) {
            this.isInvalidFirstValue = true;
            this.firstValueErrorText = errorText;
          } else {
            this.isInvalidSecondValue = true;
            this.secondValueErrorText = errorText;
          }
        } else {
          if (valueField === 1) {
            this.isInvalidFirstValue = false;
          } else {
            this.isInvalidSecondValue = false;
          }
        }
      } else {
        if (valueField === 1) {
          this.isInvalidFirstValue = false;
        } else {
          this.isInvalidSecondValue = false;
        }
      }
    },

    validateCodeValue(value) {
      if (this.valueType === "advanced") {
        if (
          _.isEmpty(value.trim()) ||
          !validators.jsExpressionNonEmptyString(value.trim())
        ) {
          this.isInvalidCodeValue = true;
          this.ruleLocal.isValid = false;
          this.codeValueErrorText = "The field is required.";
        } else if (!validators.jsExpression(value.trim())) {
          this.isInvalidCodeValue = true;
          this.ruleLocal.isValid = false;
          this.codeValueErrorText =
            "Please enter a valid JavaScript expression.";
        } else {
          this.isInvalidCodeValue = false;
          this.ruleLocal.isValid = true;
        }
      } else {
        this.isInvalidCodeValue = false;
        this.ruleLocal.isValid = true;
      }

      this.ruleLocal.isValid = this.validateRule();
    },

    validateRule() {
      return this.ruleLocal.valueType === "advanced"
        ? !this.isInvalidCodeValue
        : !this.isInvalidFirstValue &&
            (this.isDisabledSecondValue ||
              (!this.isDisabledSecondValue && !this.isInvalidSecondValue));
    }
  },

  mounted() {
    if (
      this.calculatedFlag ||
      this.conditionGroups.length > 1 ||
      this.conditionExits.length > 1 ||
      this.rules.length > 1
    ) {
      this.validateValue(this.firstValue, 1);
      this.validateValue(this.secondValue, 2);
      this.validateCodeValue(this.codeValue);
      this.ruleLocal.isValid = this.validateRule();

      const isSame = `function (firstValue, secondValue) {\nreturn _.isEqual(firstValue, secondValue);\n}`;
      const isNotSame = `function (firstValue, secondValue) {\nreturn !_.isEqual(firstValue, secondValue);\n}`;
      this.ruleTypeSame =
        this.ruleLocal.valueType === "other" &&
        this.ruleLocal.ruleType === isSame
          ? true
          : false;
      this.ruleTypeNotSame =
        this.ruleLocal.valueType === "other" &&
        this.ruleLocal.ruleType === isNotSame
          ? true
          : false;
    }

    this.mountedFlag = true;

    if (this.$refs.textExpression) this.refsLoaded = true;
  }
};
</script>

<style  lang="scss" rel="stylesheet/scss">
@import "../scss/colors.scss";
@import "../scss/fonts.scss";

.rule-item {
  width: 100%;

  > .ui-select--no-style {
    flex-grow: 0;
  }

  &.is-single-exit {
    margin-bottom: 15px;
    padding: 0 10px 15px 10px;
    border-radius: 3px 0 0 3px;
    // background: #F6F6F6;
    border-left: 3px solid #7ed321;
    border-bottom: 1px dashed #eee;
    border-top: 1px dashed #eee;
  }

  &.code-mode-active {
    .rule-wrapper {
      margin-top: 36px;
    }
  }
  button:focus {
    outline: none;
  }

  .svg-icon-position {
    margin-top: 3px;
    use {
      fill: $default-grey-icon-button;
    }
    &:hover {
      use {
        fill: $active;
      }
    }
  }

  .rule-header {
    display: flex;
    justify-content: space-between;

    .code-mode-active & {
      justify-content: flex-end;
    }

    .ui-icon-button.code-mode {
      &:hover {
        background: none;
      }
    }

    .ui-select--no-style.ui-select,
    .ui-select--no-style.ui-select.is-disabled {
      .ui-select__content .ui-select__label .ui-select__display {
        padding-left: 0;

        .ui-select__display-value {
          color: $active;
        }

        .ui-icon {
          color: $active;
        }
      }

      .ui-select__dropdown {
        width: auto;
        min-width: auto;
      }

      &:hover
        .ui-select__content
        .ui-select__label
        .ui-select__display:hover
        .ui-select__dropdown-button {
        color: $active;
      }
    }
  }

  .rule-wrapper {
    display: flex;
    align-items: flex-start;

    .or-code.readonly {
      .ace-wrapper:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  .rule-values {
    display: flex;
    position: relative;
    // align-items: center;
    width: 100%;
    margin-right: 3px;
    // max-width: calc(100% - 1.5rem);

    &--single {
      margin-right: 7px;
    }

    .or-text-expression,
    .ui-select {
      margin-bottom: 0;
    }

    .ui-select {
      flex-grow: 0;

      &__dropdown {
        width: auto;
        min-width: auto;
      }

      &__options {
        min-width: auto;

        .ui-select-option {
          padding: 0.375rem;
          font-size: 13px;
        }
      }

      &.rule-type-same {
        min-width: 83px;
      }

      &.rule-type-not-same {
        min-width: 100px;
      }

      &.single-value {
        .ui-select__dropdown {
          right: -10px;
        }
      }

      .ui-select__content .ui-select__label .ui-select__display {
        height: 100%;
        border: 0;
        background: none;
        padding: 0 1px 0 5px;
        font-size: 13px;

        .ui-select__dropdown-button {
          font-size: 20px;
        }

        &-value {
          white-space: initial;
        }
      }
    }

    .or-text-expression {
      position: relative;
      width: 100%;
      min-width: 25%;

      .header {
        height: 0;
        min-height: 0 !important;
      }

      .js-mode-btn {
        display: none !important;
      }

      button.ui-icon-button.flat.add-variable {
        visibility: visible;
        position: absolute;
        top: 1px;
        right: 0;
        z-index: 2;
      }

      .or-editable-wrapper .editable {
        width: calc(100% - 30px);
        padding-right: 0;
        overflow: hidden;
      }

      .or-editable-wrapper.readonly .editable {
        width: 100%;
      }
    }

    &__remove-button {
      width: 24px;

      &.ui-icon-button--type-secondary.ui-icon-button--color-default:hover:not(.is-disabled) {
        background: none;
      }
    }
  }

  .rule-values_dropdown.custom-popover-content {
    padding: 0;

    .ui-menu-option__icon {
      width: 24px;
      text-align: center;
    }
  }

  .rule-code-mode,
  .rule-code-values {
    width: 100%;
    margin-bottom: -10px;

    .or-code {
      width: 100%;
      position: relative;
      min-height: 52px !important;

      > .header {
        position: absolute;
        flex-direction: column !important;
        top: 2px;
        right: 4px;
        z-index: 1;

        .label-text {
          display: none;
        }

        button.ui-icon-button {
          visibility: visible !important;
          width: 24px;
          height: 24px;
        }
      }

      > .ace-wrapper.ace_editor.ace-chrome {
        width: calc(100% - 32px);
        border: none;
        overflow: initial;

        &:after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: -32px;
          width: auto;
          z-index: 4;
          border: 1px solid #dfdfdf;
          border-radius: 3px;
          pointer-events: none;
          transition: border-color 0.5s ease-out;
        }
      }

      &.invalid > .ace-wrapper.ace_editor.ace-chrome:after {
        border-color: #f95d5d;
      }

      &:hover {
        > .ace-wrapper.ace_editor.ace-chrome {
          &:after {
            border: 1px solid #a3a9b1;
          }
        }
      }

      &.active > .ace-wrapper.ace_editor.ace-chrome:after {
        border-color: #64b2da;
      }
    }
  }

  .rule-code-values {
    .ui-select {
      margin-top: 5px;
    }
  }

  .ui-select--no-style {
    margin-bottom: 0;

    .ui-select__content {
      flex-grow: 0;
    }

    .ui-select__content .ui-select__label .ui-select__display {
      border: 0;
      background: none;
      padding: 10px 2px 10px 10px;
    }
  }

  .conditon-data-out {
    .or-text-expression {
      margin-bottom: 0;
    }
  }

  .hidden-text-expression {
    visibility: hidden;
    width: 0;
    height: 0;
    margin: 0 !important;
  }
}
</style>