<template>
  <div class="condition-group">
    <div class="condition-rules">
      <or-list
        v-model="rules"
        :readonly="readonly"
        :steps="steps"
        :step-id="stepId"
        :is-single-exit="isSingleExit"
        :condition-rule-has-data-out="conditionRuleHasDataOut"
        :can-remove-last-item="false"
        :new-item-method="newRule"
        ref="rulesList"
        class="rules-list"
      >
        <template scope="item">
          <rule-item
            :rule.sync="item.item"
            :readonly="readonly"
            :steps="steps"
            :step-id="stepId"
            :is-single-exit="isSingleExit"
            :rules="rules"
            :condition-groups="conditionGroups"
            :condition-rule-has-data-out="conditionRuleHasDataOut"
            @removeRule="onRemoveRule(item.item)"
          ></rule-item>
        </template>
        <div slot="footer">
          <or-button
            class="condition-rules__add-button flat"
            type="secondary"
            color="primary"
            icon="add"
            :disabled="readonly"
            @click.stop.prevent="$refs.rulesList.addItem"
            disableRipple
          >Add rule</or-button>
        </div>
      </or-list>
    </div>

    <div v-if="conditionRuleHasDataOut" class="condition-data-out">
      <or-text-expression
        v-model="dataOut"
        ref="dataOut"
        :steps="steps"
        :step-id="stepId"
        :readonly="readonly"
        label="Data to output"
        :invalid="isInvalidDataOutValue"
        @input="$v.$touch()"
        :error="errorDataOutText"
        @mode-changed="handleDataOutModeChange"
      ></or-text-expression>
      <!-- :invalid="$v.dataOut.$invalid" -->
    </div>
  </div>
</template>
<script>
import RuleItem from "./rule_item.vue";

let validators;

try {
  validators = require("_validators");
} catch (error) {
  validators = require("../../../../helpers/validators/validators.js");
}

const { jsExpressionNonEmptyString, jsExpression } = validators.validators;

export default {
  components: {
    RuleItem
  },

  props: {
    conditionGroup: {
      type: Object,
      default() {
        return {};
      }
    },
    conditionGroups: {
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
    mountedFlag: {
      type: Boolean,
      default: false
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
    },
    $v: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    label: {
      get() {
        return this.conditionGroupLocal.label;
      },

      set(newValue) {
        this.conditionGroupLocal.label = newValue;
      }
    },

    trueValue: {
      get() {
        return this.conditionGroupLocal.trueValue;
      },

      set(newValue) {
        this.conditionGroupLocal.trueValue = newValue;
      }
    },

    dataOut: {
      get() {
        return this.conditionGroupLocal.dataOut;
      },

      set(newValue) {
        if (this.mountedFlag && this.conditionRuleHasDataOut)
          this.validateDataOutValue(newValue);
        this.conditionGroupLocal.dataOut = newValue;
      }
    },

    isEditableHeader: {
      get() {
        return this.conditionGroupLocal.isEditableHeader;
      },

      set(newValue) {
        this.conditionGroupLocal.isEditableHeader = newValue;
      }
    },

    isInvalidDataOutValue: {
      get() {
        return this.conditionGroupLocal.isInvalidDataOutValue;
      },

      set(newValue) {
        this.conditionGroupLocal.isInvalidDataOutValue = newValue;
      }
    },

    mountedFlag: {
      get() {
        return this.conditionGroupLocal.mountedFlag;
      },

      set(newValue) {
        this.conditionGroupLocal.mountedFlag = newValue;
      }
    }
  },

  data() {
    return {
      conditionGroupLocal: this.conditionGroup,
      rules: this.conditionGroup.rules,
      errorDataOutText: "",
      newRule() {
        return {
          firstValue: "``",
          secondValue: "``",
          valueType: "string",
          ruleType: "contains",
          codeValue: "``",
          isDisabledSecondValue: false,
          isValid: true,
          mountedFlag: false,
          calculatedFlag: false
        };
      },
      trueValueOptions: [
        { label: "any", value: "any" },
        { label: "all", value: "all" }
      ]
    };
  },

  watch: {
    conditionGroupLocal: {
      handler(newValue) {
        this.$emit("update:conditionGroup", newValue);
      },
      deep: true
    },

    rules: {
      handler(newValue) {
        if (
          this.conditionRuleHasDataOut &&
          (this.rules.length > 1 || this.conditionGroups.length > 1)
        ) {
          this.validateDataOutValue(this.dataOut);
        }
        this.$set(this.conditionGroupLocal, "rules", newValue);
      },
      deep: true
    },

    dataOut(value) {
      const currentIndexStep = _.findIndex(
        this.steps,
        item => item.id === this.stepId
      );

      let outputValue;
      try {
        outputValue = JSON.parse(_.trim(value));
      } catch (e) {
        outputValue = value;
      }

      if (
        currentIndexStep !== -1 &&
        (_.isObject(outputValue) || _.isArray(outputValue))
      ) {
        if (_.isString(this.steps[currentIndexStep]["outputExample"].output)) {
          this.steps[currentIndexStep]["outputExample"].output = outputValue;
        } else {
          _.assign(
            this.steps[currentIndexStep]["outputExample"].output,
            outputValue
          );
        }
      }
    }
  },

  mounted() {
    if (_.isEmpty(this.rules)) {
      this.$refs["rulesList"].addItem();
    }

    if (
      this.conditionRuleHasDataOut &&
      (this.mountedFlag || this.conditionGroups.length > 1)
    ) {
      this.validateDataOutValue(this.dataOut);
    }

    this.mountedFlag = true;
  },

  methods: {
    onRemoveRule(rule) {
      if (this.rules.length > 1) {
        this.rules = _.reject(this.rules, currRule => currRule === rule);
      }
    },

    validateDataOutValue(value) {
      let isMergeField = /\$\{this.*\}/.test(value);
      let isEmptyMergeField = isMergeField
        ? _.isEmpty(_.replace(value, /^\`\$\{this\.get\(\'|\'\)\}\`$/gm, ""))
        : false;

      if (
        this.$refs.dataOut.mode == "code" &&
        !validators.jsExpression(value)
      ) {
        this.isInvalidDataOutValue = true;
        this.errorDataOutText = "Please enter a valid JavaScript expression.";
      } else if (isEmptyMergeField || !value.slice(1, -1)) {
        this.isInvalidDataOutValue = true;
        this.errorDataOutText = "The field is required.";
      } else {
        this.isInvalidDataOutValue = false;
        this.errorDataOutText = "";
      }
    },

    handleDataOutModeChange(value) {
      if (this.mountedFlag && this.conditionRuleHasDataOut)
        this.validateDataOutValue(this.dataOut);
    }
  }
};
</script>

<style  lang="scss" rel="stylesheet/scss">
.condition-group {
  button:focus {
    outline: none;
  }

  .ui-select--no-style {
    margin-bottom: 0;

    .ui-select__content {
      flex-grow: 0;
    }

    .ui-select__content .ui-select__label .ui-select__display {
      border: 0;
      background: none;
    }
  }

  .rules-list {
    &.single-item {
      > .or-list-items > .list-item.list-item {
        border-radius: 3px;
        padding-left: 10px;
      }
    }

    > .or-list-items > .list-item {
      margin-top: 0;
      background: #ffffff;
      margin-bottom: 5px;
      padding: 0 3px 10px 10px;

      &:first-child {
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
      }

      &:last-child {
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
      }

      .drag_handle,
      .remove-button {
        display: none;
      }
    }

    &.readonly {
      .list-item {
        // padding-right: 15px;
        padding-left: 15px;
      }
    }
  }

  .condition-header,
  .condition-group-settings {
    display: flex;
  }

  .condition-header {
    justify-content: space-between;

    // &__name {
    //     margin-bottom: 1rem;
    // }

    &__select {
      margin-left: auto;

      .ui-select__dropdown {
        min-width: auto;
      }

      &.ui-select:hover:not(.is-disabled):not(.dropdown-shown)
        .ui-select__content
        .ui-select__label
        .ui-select__display:hover {
        background-color: transparent;
      }
    }
  }

  .condition-rules {
    &__add-button.ui-button {
      padding: 4px 0;
      margin-bottom: 0.3rem;

      .ui-button__focus-ring {
        left: 0 !important;
        width: 100% !important;
        border-radius: 0;
      }
    }
  }

  .condition-group-settings {
    flex-direction: column;
  }

  .condition-data-out {
    background: #ffffff;
    padding: 0 10px 10px;
    margin-bottom: 16px;

    .or-text-expression {
      margin-bottom: 0;
    }
  }
}
</style>