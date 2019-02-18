<template>
  <div class="condition-exit">
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
            :condition-rule-has-data-out="conditionRuleHasDataOut"
            :rules="rules"
            :condition-exits="conditionExits"
            :class="[{'is-single-exit': isSingleExit}]"
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
  </div>
</template>
<script>
import RuleItem from "./rule_item.vue";

export default {
  components: {
    RuleItem
  },

  props: {
    conditionExit: {
      type: Object,
      default() {
        return {};
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
        return this.conditionExitLocal.label;
      },

      set(newValue) {
        this.conditionExitLocal.label = newValue;
      }
    },

    trueValue: {
      get() {
        return this.conditionExitLocal.trueValue;
      },

      set(newValue) {
        this.conditionExitLocal.trueValue = newValue;
      }
    },

    isEditableHeader: {
      get() {
        return this.conditionExitLocal.isEditableHeader;
      },

      set(newValue) {
        this.conditionExitLocal.isEditableHeader = newValue;
      }
    }
  },

  data() {
    return {
      conditionExitLocal: this.conditionExit,
      rules: this.conditionExit.rules,
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
    conditionExitLocal: {
      handler(newValue) {
        this.$emit("update:conditionExit", newValue);
      },
      deep: true
    },

    rules: {
      handler(newValue) {
        this.$set(this.conditionExitLocal, "rules", newValue);
      },
      deep: true
    }
  },

  mounted() {
    if (_.isEmpty(this.rules)) {
      this.$refs["rulesList"].addItem();
    }
  },

  methods: {
    onRemoveRule(rule) {
      if (this.rules.length > 1) {
        this.rules = _.reject(this.rules, currRule => currRule === rule);
      }
    }
  }
};
</script>

<style  lang="scss" rel="stylesheet/scss">
.condition-exit {
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
        //padding-right: 15px;
        padding-left: 15px;
      }
    }
  }

  .condition-header,
  .condition-exit-settings {
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
    }

    &.ui-select:hover:not(.is-disabled):not(.dropdown-shown)
      .ui-select__content
      .ui-select__label
      .ui-select__display:hover {
      background-color: transparent;
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

  .condition-exit-settings {
    flex-direction: column;
  }
}
</style>