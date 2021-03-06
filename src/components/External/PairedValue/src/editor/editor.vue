<template>
  <div>
    <div class="paired-component-wrapper">
      <div v-if="template.isHeader">
        <h4 style="padding-left: 10px;padding-top:6px;">{{template.title}}</h4>
        <div v-if="!variables||!variables.length" class="empty-list">Your variables list is empty.</div>
        <or-list
          style="margin: 10px;"
          v-model="variables"
          ref="variablesOrList"
          :steps="steps"
          :step-id="stepId"
          :readonly="readonly"
          :new-item-method="newVariable"
          :add-button-label="template.btn_label"
          class="variables-list"
          dragMode="false"
          :can-remove-last-item="false"
        >
          <template slot-scope="item">
            <item
              @remove-item="removeItem(item.index)"
              :variable-name.sync="item.item.name"
              :variable-value.sync="item.item.value"
              :value-type.sync="item.item.type"
              :variable-code.sync="item.item.code"
              :variable-is-code.sync="item.item.isCode"
              :steps="item.steps"
              :step-id="item.stepId"
              :readonly="item.readonly"
              :$v="$v.schema.variables.$each[item.index]"
            ></item>
          </template>
        </or-list>
      </div>

      <or-collapsible
        :invalid="$v.schema.variables.$error"
        v-else
        :title="template.title||'Header'"
      >
        <div v-if="!variables||!variables.length" class="empty-list">Your variables list is empty.</div>
        <or-list
          v-model="variables"
          ref="variablesOrList"
          :steps="steps"
          :step-id="stepId"
          :readonly="readonly"
          :new-item-method="newVariable"
          :add-button-label="template.btn_label"
          class="variables-list"
          dragMode="false"
          :can-remove-last-item="false"
        >
          <template slot-scope="item">
            <item
              @remove-item="removeItem(item.index)"
              :variable-name.sync="item.item.name"
              :variable-value.sync="item.item.value"
              :value-type.sync="item.item.type"
              :variable-code.sync="item.item.code"
              :variable-is-code.sync="item.item.isCode"
              :steps="item.steps"
              :step-id="item.stepId"
              :readonly="item.readonly"
              :$v="$v.schema.variables.$each[item.index]"
            ></item>
          </template>
        </or-list>
      </or-collapsible>
    </div>
  </div>
</template>
<script>
import * as _ from "lodash";
let validators;

try {
  validators = require("_validators");
} catch (error) {
  validators = require("../../../../helpers/validators/validators.js");
}

import item from "./item.vue";

const { required, generateValidators, minValue } = validators;

export const validator = template => {
  return {
    variables: {
      $each: {
        name: {
          custom(value, ctx) {
            return validators.jsExpressionNonEmptyString(value);
          }
        },
        value: {
          custom(value, ctx) {
            return ctx.isCode || validators.jsExpressionNonEmptyString(value);
          }
        },
        code: {
          custom(value, ctx) {
            return !ctx.isCode || validators.jsExpression(value);
          }
        }
      }
    }
  };
};
export const data = template => ({
  variables: []
});

export default {
  props: {
    template: {
      type: Object,
      default: () => ({})
    },
    schema: {
      type: Object,
      default: () => ({})
    },
    step: null,
    stepId: null,
    steps: null,
    readonly: null
  },
  computed: {},
  watch: {
    variables: {
      handler(newValue) {
        this.schema.variables = _.map(newValue, el => {
          delete el.vforkey;
          return el;
        });
      },
      deep: true
    }
    // $v: {
    //   handler(newValue) {
    //     this.$emit("step-validation", newValue);
    //   },
    //   deep: true
    // }
  },
  methods: {
    removeItem(index) {
      this.$refs.variablesOrList.removeItem(index);
    },
    newVariable() {
      return {
        name: "``",
        value: "``",
        type: "string",
        isCode: false,
        code: "{}"
      };
    }
  },
  components: { item },
  validations() {
    return { schema: validator(this.template) };
  },
  mounted() {
    this.variables = _.cloneDeep(this.schema.variables);
  },
  data() {
    return {
      variables: []
    };
  }
};

export const meta = {
  name: "test-external-component",
  type: "onereach-studio-form-editor",
  version: "1.0"
};
</script>
<style lang="scss" rel="stylesheet/scss">
@import "../scss/colors.scss";

.paired-component-wrapper {
  //
  margin-top: 10px;
  background-color: #f6f6f6;
  .empty-list {
    color: #91969d;
    font-size: 12px;
    line-height: 18px;
    padding-left: 20px;
  }
  .or-collapsible__description {
    display: none;
  }

  .variables-list {
    .or-list-items {
      width: 100%;
    }
    .add-button {
      margin-left: 10px;
      font-size: 12px;
    }
    > button.ui-button.ui-button--type-secondary.ui-button--color-primary {
      height: 30px;
      margin: 30px auto 0;
      border-radius: 6px;
      background-color: #64b2da;
      color: #ffffff;
      font-size: 14px;
      line-height: 14px;
    }

    &.or-list {
      .list-item {
        > .remove-button {
          display: none;
        }

        .handle,
        .sortable-handle {
          //display: none;
          align-self: flex-start;
          margin-top: 2.6rem;
        }
      }
    }
  }
  .or-text-expression__inline {
    display: flex;
    flex-direction: row-reverse;
    border-radius: 3px;
    border: 1px solid #dfdfdf;
    .header {
      width: 30px;

      .ui-icon-button.add-variable {
        display: block;
        width: 30px;
        filter: grayscale(1) opacity(100%) saturate(250%);
      }
      .ui-icon-button.js-mode-btn {
        display: none;
      }
    }

    .input-wrapper {
      width: calc(100% - 30px);

      .or-editable-wrapper {
        border: none;
      }
    }
    &.invalid,
    &.invalid-char-length {
      border-color: #f95d5d;
    }
  }
  .variable {
    border-left: 3px solid #7ed321;
    position: relative;
    margin-bottom: 10px;
    border-radius: 3px;
    padding: 10px;
    padding-right: 0;
    background-color: #fff;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &_error {
      display: flex;
      color: #f95d5d;
      font-size: 12px;
      width: 100%;

      &__name {
        width: calc(50% - 16px);
        padding-right: 3px;
      }
      &__value {
        width: calc(50% - 16px);
      }
    }
    &__code {
      margin: 0;
      position: relative;
      flex-direction: row-reverse;
      > .header {
        position: absolute;
        right: 0;
        z-index: 2;
      }
    }
    &__btn {
      margin-bottom: 3px;
    }
    &__name {
      width: calc(50% - 16px);
      padding-right: 3px;
      display: flex;
      align-items: flex-end;
      .or-text-expression {
        width: 100%;
      }
    }

    .ui-select,
    .or-text-expression,
    .ui-textbox {
      margin-bottom: 0;
    }
    .or-text-expression__inline {
      position: relative;
      margin: 0;
      flex-direction: row-reverse;
      .header {
        position: absolute;
        right: 0;
        z-index: 2;
      }
      .input-wrapper {
        width: 100%;
      }
    }
    &__value {
      width: calc(50% - 16px);
    }

    .ui-select {
      &__dropdown {
        top: 100%;
        right: 0;
        width: auto;
        min-width: auto;
      }

      &__options {
        min-width: auto;
      }
    }

    .or-text-expression.invalid .or-code .ace-wrapper {
      border-color: #f95d5d;
    }

    .ui-select__label {
      display: flex;
      justify-content: flex-end;
    }

    .ui-select .ui-select__content .ui-select__label .ui-select__display {
      width: auto;
      padding: 2px 0 2px 10px;
      border: 0;
      background: transparent;
      color: #64b2da;
    }

    .ui-select__display-value {
      flex-grow: 0;
    }

    .ui-select .ui-select__content .ui-select__label .ui-select__label-text {
      white-space: nowrap;
      font-size: 14px;
    }

    .ui-select.has-label .ui-select__dropdown-button {
      top: 0px;
      font-size: 20px;
      margin-top: 2px;
    }

    .ui-radio-group {
      &__label-text {
        display: flex;
        align-items: center;
        flex-grow: 1;
        font-size: 12px;
        line-height: 36px;
        color: rgb(145, 150, 157);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &__radio {
        &:not(:first-child) {
          margin-left: 10px;
        }
      }

      &:not(.is-disabled):not(.is-invalid):hover .ui-radio-group__label-text,
      &:not(.is-disabled):not(.is-invalid).is-active
        .ui-radio-group__label-text {
        color: #91969d;
      }
    }

    .ui-radio .ui-radio__label-text {
      font-size: 14px;
      line-height: 24px;
    }

    .ui-radio-group__radios {
      display: flex; /*  */
      position: relative;
      justify-content: space-around;
      flex-wrap: wrap;
      min-height: 38px;
      font-size: 14px;
      padding: 0 6px;
      border-radius: 3px;
      background: #f6f6f6;
      .ui-radio-group__slot-sub-item {
        display: none;
      }
      .ui-radio.ui-radio-group__radio {
        margin: 0;
      }
    }
  }

  .value-type-helper {
    display: block;
    color: rgba(0, 0, 0, 0.38);
    line-height: 1.2;
    font-size: 12px;
  }
}
</style>