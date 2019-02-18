<template>
  <div class="condition-builder-scope">
    <!-- && isSingleExit !== undefined -->
    <or-list
      v-if="(!isSingleExit && isSingleExit !== undefined) || (!schema.isSingleExit && schema.isSingleExit !== undefined)"
      v-model="conditionExits"
      :new-item-method="newCondition"
      :can-remove-last-item="false"
      :readonly="readonly"
      :steps="steps"
      :step-id="stepId"
      @data-change="updateExits"
      ref="conditionExits"
      class="conditions-list"
    >
      <template scope="item">
        <or-collapsible
          :title="item.item.label"
          :class="['group-collapsible', { 'is-invalid': !item.item.rules.every(rule => rule.isValid) }]"
          :open="item.item.isNotCollapsed"
          @open="() => (item.item.isNotCollapsed = true)"
          @close="() => (item.item.isNotCollapsed = false)"
          :style="setGroupWidth"
          disableRipple
        >
          <div slot="header">
            <div class="header__body">
              <div @click.stop class="header__name-wrapper">
                <or-text-expression
                  v-model="item.item.label"
                  :ref="'header-input-' + item.index"
                  :readonly="readonly"
                  class="header__input"
                  @blur="changeHeaderState(item, 'New Exit')"
                  @focus="changeHeaderState(item, 'New Exit')"
                ></or-text-expression>
              </div>
              <div @click.stop class="header__dropdown-wrapper">
                <or-select
                  v-model="item.item.trueValue"
                  :options="trueValueOptions"
                  :disabled="readonly"
                  label="Match type:"
                  class="ui-select--no-style header__dropdown"
                ></or-select>
              </div>
              <or-button
                v-if="schema.conditionExits.length > 1"
                class="header__close-button flat"
                type="secondary"
                color="default"
                icon="clear"
                :disabled="readonly"
                @click.stop.prevent="$refs.conditionExits.removeItem(item.index)"
                disableRipple
              ></or-button>
            </div>
            <div
              class="header__description"
              v-if="(item.item.isNotCollapsed && !readonly) || (!item.item.isNotCollapsed && item.item.description.length > 2) || (readonly && item.item.description.length > 2)"
            >
              <div @click.stop class="header__description-wrapper">
                <or-text-expression
                  v-model="item.item.description"
                  :ref="'header-description-input-' + item.index"
                  :readonly="readonly"
                  class="header__input header__description-input"
                  placeholder="Add condition description"
                  multiLine
                ></or-text-expression>
              </div>
            </div>
          </div>
          <condition-exit
            :condition-exit.sync="item.item"
            :condition-exits="conditionExits"
            :readonly="item.readonly"
            condition-rule-has-data-out="false"
            :steps="item.steps"
            :step-id="item.stepId"
            :$v="$v.schema.conditionExits.$each[item.index]"
          ></condition-exit>
        </or-collapsible>
      </template>
      <div slot="footer">
        <or-button
          class="conditions-list__add-button flat"
          type="secondary"
          color="primary"
          icon="add"
          :style="addButtonStyle"
          :disabled="readonly"
          @click.stop.prevent="$refs.conditionExits.addItem"
          disableRipple
        >Add new exit</or-button>
      </div>
    </or-list>
    <!-- && isSingleExit !== undefined -->
    <or-list
      v-if="isSingleExit || schema.isSingleExit"
      v-model="conditionGroups"
      :new-item-method="newGroup"
      :can-remove-last-item="false"
      :readonly="readonly"
      :steps="steps"
      :step-id="stepId"
      @data-change="updateConditionGroups"
      ref="conditionGroups"
      class="conditions-list conditions-list--single-exit"
    >
      <template scope="item">
        <div v-if="item.index !== 0" class="separator">
          <div>
            <span>or</span>
          </div>
        </div>
        <or-collapsible
          :title="item.item.label"
          :class="['group-collapsible', { 'is-invalid': !item.item.rules.every(rule => rule.isValid) || item.item.isInvalidDataOutValue }]"
          :open="item.item.isNotCollapsed"
          @open="() => (item.item.isNotCollapsed = true)"
          @close="() => (item.item.isNotCollapsed = false)"
          :style="setGroupWidth"
          disableRipple
        >
          <div slot="header">
            <div class="header__body">
              <div @click.stop class="header__name-wrapper">
                <or-text-expression
                  v-model="item.item.label"
                  :ref="'header-name-input-' + item.index"
                  :readonly="readonly"
                  class="header__input header__name-input"
                  @blur="changeHeaderState(item, 'New Group')"
                  @focus="changeHeaderState(item, 'New Group')"
                ></or-text-expression>
              </div>
              <div @click.stop class="header__dropdown-wrapper">
                <or-select
                  v-model="item.item.trueValue"
                  :options="trueValueOptions"
                  :disabled="readonly"
                  label="Match type:"
                  class="ui-select--no-style header__dropdown"
                ></or-select>
              </div>
              <or-button
                v-if="schema.conditionGroups.length > 1"
                class="header__close-button flat"
                type="secondary"
                color="default"
                icon="clear"
                :disabled="readonly"
                @click.stop.prevent="$refs.conditionGroups.removeItem(item.index)"
                disableRipple
              ></or-button>
            </div>
            <div
              class="header__description"
              v-if="(item.item.isNotCollapsed && !readonly) || (!item.item.isNotCollapsed && item.item.description.length > 2) || (readonly && item.item.description.length > 2)"
            >
              <div @click.stop class="header__description-wrapper">
                <or-text-expression
                  v-model="item.item.description"
                  :ref="'header-description-input-' + item.index"
                  :readonly="readonly"
                  class="header__input header__description-input"
                  placeholder="Add condition description"
                  multiLine
                ></or-text-expression>
              </div>
            </div>
          </div>
          <condition-group
            :condition-group.sync="item.item"
            :condition-groups="conditionGroups"
            :readonly="item.readonly"
            :condition-rule-has-data-out="conditionRuleHasDataOut"
            :steps="item.steps"
            :step-id="item.stepId"
            :$v="$v.schema.conditionGroups.$each[item.index]"
          ></condition-group>
        </or-collapsible>
      </template>
      <div slot="footer">
        <or-button
          class="conditions-list__add-button flat"
          type="secondary"
          color="primary"
          icon="add"
          :disabled="readonly"
          :style="addButtonStyle"
          @click.stop.prevent="$refs.conditionGroups.addItem"
          disableRipple="true"
        >Add new group</or-button>
      </div>
    </or-list>

    <div
      v-if="(isSingleExit || schema.isSingleExit) && (conditionRuleHasDataOut || schema.conditionRuleHasDataOut) && (hasNoConditionDataOut || schema.hasNoConditionDataOut)"
      :class="['data-block', 'no-condition-data-out', { 'is-invalid': isInvalidNoConditionDataOutValue}]"
    >
      <div class="data-block__header">If no condition is met</div>
      <div class="data-block__body">
        <or-text-expression
          v-model="noConditionDataOutValue"
          ref="noConditionDataOutValue"
          :steps="steps"
          :step-id="stepId"
          :readonly="readonly"
          label="Data to output"
          placeholder="Enter your value"
          :invalid="isInvalidNoConditionDataOutValue"
          :error="noConditionDataOutValueErrorText"
          @mode-changed="handleNoConditionDataOutModeChange"
        ></or-text-expression>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from "lodash";
import ConditionExit from "./condition_exit.vue";
import ConditionGroup from "./condition_group.vue";

let validators;

try {
  validators = require("_validators");
} catch (error) {
  validators = require("../../../../helpers/validators/validators.js");
}

const {
  required,
  each,
  jsExpressionNonEmptyString,
  jsExpression,
  validateIf,
  validateInput,
  generateValidators
} = validators.validators;
export default {
  components: {
    ConditionExit,
    ConditionGroup
  },

  props: {
    mountedFlag: {
      type: Boolean,
      default: false
    },
    template: {
      type: Object,
      default() {
        return {};
      }
    },
    schema: {
      type: Object,
      default() {
        return {};
      }
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
    // v: {
    //     type: Object,
    //     default() {
    //         return {}
    //     }
    // },
  },

  data() {
    return {
      conditionExits: _.get(this.schema, "conditionExits") || [],
      conditionGroups: _.get(this.schema, "conditionGroups") || [],
      newCondition() {
        return {
          label: "`New Exit " + (this.$parent.conditionExits.length + 1) + "`",
          description: "``",
          isEditableHeader: false,
          isNotCollapsed: true,
          trueValue: "any",
          rules: [
            {
              secondValue: "``",
              firstValue: "``",
              valueType: "string",
              ruleType: "contains",
              codeValue: "``",
              isDisabledSecondValue: false,
              isValid: true,
              mountedFlag: false,
              calculatedFlag: false
            }
          ]
        };
      },
      newGroup() {
        return {
          label:
            "`New Group " + (this.$parent.conditionGroups.length + 1) + "`",
          description: "``",
          isEditableHeader: false,
          isNotCollapsed: true,
          trueValue: "any",
          dataOut: "``",
          isInvalidDataOutValue: false,
          mountedFlag: false,
          rules: [
            {
              secondValue: "``",
              firstValue: "``",
              valueType: "string",
              ruleType: "contains",
              codeValue: "``",
              isDisabledSecondValue: false,
              isValid: true,
              mountedFlag: false,
              calculatedFlag: false
            }
          ]
        };
      },
      trueValueOptions: [
        { label: "any", value: "any" },
        { label: "all", value: "all" }
      ],
      isInvalidNoConditionDataOutValue: false,
      noConditionDataOutValueErrorText: ""
    };
  },

  computed: {
    isSingleExit() {
      return this.template.isSingleExit;
    },

    conditionRuleHasDataOut() {
      return this.template.conditionRuleHasDataOut;
    },

    hasNoConditionDataOut() {
      return this.template.hasNoConditionDataOut == undefined
        ? true
        : this.template.hasNoConditionDataOut;
    },

    noConditionDataOutValue: {
      get() {
        return this.mountedFlag
          ? this.schema["noConditionDataOutValue"]
          : this.template.noConditionDataOutValue;
      },
      set(newValue) {
        if (
          this.mountedFlag &&
          this.schema.conditionRuleHasDataOut &&
          this.schema.hasNoConditionDataOut
        ) {
          this.validateNoConditionDataOutValue(newValue);
        }
        this.$set(this.schema, "noConditionDataOutValue", newValue);
      }
    },

    mountedFlag: {
      get() {
        return this.schema["mountedFlag"] || this.template.mountedFlag;
      },

      set(newValue) {
        this.$set(this.schema, "mountedFlag", newValue);
      }
    },

    setGroupWidth(item) {
      let multipleGroups =
        this.conditionGroups.length > 1 || this.conditionExits.length > 1
          ? true
          : false;
      let width = multipleGroups ? "calc(100% - 24px)" : "100%";
      return {
        "max-width": width
      };
    },

    addButtonStyle(item) {
      let multipleGroups =
        this.conditionGroups.length > 1 || this.conditionExits.length > 1
          ? true
          : false;
      let margin = multipleGroups ? "25px" : "0";
      return {
        "margin-left": margin
      };
    }
  },

  watch: {
    conditionExits: {
      handler(newValue) {
        this.schema.conditionExits = newValue;
      },
      deep: true
    },

    conditionGroups: {
      handler(newValue) {
        this.checkOutputValue();
        this.schema.conditionGroups = newValue;
      },
      deep: true
    },

    noConditionDataOutValue(value) {
      const currentIndexStep = _.findIndex(
        this.steps,
        item => item.id === this.stepId
      );
      const outputValue = this.parsedOutputValue(value);

      if (currentIndexStep !== -1 && _.isObject(outputValue)) {
        if (_.isString(this.steps[currentIndexStep]["outputExample"].output)) {
          this.steps[currentIndexStep]["outputExample"].output = outputValue;
        } else {
          _.assign(
            this.steps[currentIndexStep]["outputExample"].output,
            outputValue
          );
        }
      }

      this.checkOutputValue();
    },

    schema: {
      handler(newValue) {
        // console.log('schema', newValue)
      },
      deep: true
    },

    template: {
      handler(newValue) {
        if (!newValue.isSingleExit && _.isEmpty(this.conditionExits)) {
          this.$nextTick(() => {
            this.$refs["conditionExits"].addItem();
          });
        }

        if (newValue.isSingleExit && _.isEmpty(this.conditionGroups)) {
          this.$nextTick(() => {
            this.$refs["conditionGroups"].addItem();
          });
        }
      },
      deep: true
    }
  },

  methods: {
    setHeaderStyle(item) {
      if (item.item.isEditableHeader) {
        return {
          position: "absolute",
          visibility: "hidden"
        };
      }
    },

    changeHeaderState(listItem, defaultLabel) {
      // this.$refs[`header-input-${listItem.index}`].$refs.editable.$refs.editable.style.backgroundColor = listItem.item.isEditableHeader ?
      //                                                                                                                             '#f6f6f6' :
      //                                                                                                                     'rgba(33, 150, 243, 0.12)'

      listItem.item.isEditableHeader = !listItem.item.isEditableHeader;

      if (defaultLabel && !listItem.item.label.slice(1, -1)) {
        listItem.item.label =
          "`" + defaultLabel + " " + (listItem.index + 1) + "`";
      }
    },

    calculateExitLabel(item) {
      if (_.isEmpty(item.label)) return "No Name";

      const label = item.label.slice(1, -1);
      // return label
      return `${label.length > 10 ? label.slice(0, 10) + "..." : label}`;
    },

    updateExits(params) {
      if (!_.isEmpty(this.schema.exits)) {
        if (_.isEmpty(params.oldItems) && _.isEmpty(params.newItems)) {
          // Items reordered
          const newDynamicExits = _.map(params.allItems, item => {
            const exit = _.find(this.schema.exits, { id: item.vforkey });
            return {
              id: item.vforkey,
              label: this.calculateExitLabel(item),
              stepId: exit ? exit.stepId : ""
            };
          });
          try {
            _.forEach(newDynamicExits, (item, index) => {
              const exitIndex = index;
              this.schema.exits[exitIndex].id = item.id;
              this.schema.exits[exitIndex].label = item.label;
              this.schema.exits[exitIndex].stepId = item.stepId;
            });
          } catch (e) {
            console.log(e);
          }
        } else if (_.isEmpty(params.oldItems) && !_.isEmpty(params.newItems)) {
          // Item added
          const newItem = params.newItems[0];
          const lastDynamicExitIndex = _.findLastIndex(this.schema.exits, {
            dynamic: true
          });
          const index =
            lastDynamicExitIndex === -1 ? 0 : lastDynamicExitIndex + 1;
          this.schema.exits.splice(index, 0, {
            label: this.calculateExitLabel(newItem + (index + 1)),
            id: newItem.vforkey,
            stepId: "",
            dynamic: true
          });
        } else if (!_.isEmpty(params.oldItems) && _.isEmpty(params.newItems)) {
          // Item removed
          const removedItem = params.oldItems[0];
          this.schema.exits.splice(
            _.findIndex(this.schema.exits, { id: removedItem.vforkey }),
            1
          );
        } else if (!_.isEmpty(params.oldItems) && !_.isEmpty(params.newItems)) {
          // Item updated
          const oldItemValue = params.oldItems[0];
          const newItemValue = params.newItems[0];
          const changedItemIndex = _.findIndex(this.schema.exits, {
            id: oldItemValue.vforkey
          });
          this.schema.exits[changedItemIndex].id = newItemValue.vforkey;
          this.schema.exits[changedItemIndex].label = this.calculateExitLabel(
            newItemValue
          );
        }
      }
    },

    updateConditionGroups(params) {},

    validateNoConditionDataOutValue(value) {
      let isMergeField = /\$\{this.*\}/.test(value);
      let isEmptyMergeField = isMergeField
        ? _.isEmpty(_.replace(value, /^\`\$\{this\.get\(\'|\'\)\}\`$/gm, ""))
        : false;

      if (
        _.has(this.$refs, "noConditionDataOutValue") &&
        this.$refs.noConditionDataOutValue.mode == "code" &&
        !validators.jsExpression(value)
      ) {
        this.isInvalidNoConditionDataOutValue = true;
        this.noConditionDataOutValueErrorText =
          "Please enter a valid JavaScript expression.";
      } else if (isEmptyMergeField || !value.slice(1, -1)) {
        this.isInvalidNoConditionDataOutValue = true;
        this.noConditionDataOutValueErrorText = "The field is required.";
      } else {
        this.isInvalidNoConditionDataOutValue = false;
        this.noConditionDataOutValueErrorText = "";
      }
    },

    handleNoConditionDataOutModeChange() {
      // if (this.mountedFlag) {
      //     this.validateNoConditionDataOutValue(this.noConditionDataOutValue);
      // }
    },

    checkOutputValue() {
      const currentStepIndex = _.findIndex(
        this.steps,
        item => item.id === this.stepId
      );

      if (
        currentStepIndex !== -1 &&
        this.steps[currentStepIndex]["outputExample"] &&
        _.isObject(this.steps[currentStepIndex]["outputExample"].output)
      ) {
        _.forOwn(
          this.steps[currentStepIndex]["outputExample"].output,
          (outputValue, outputKey) => {
            let hasOutputValueInNoConditionDataOutValue = _.has(
              this.parsedOutputValue(this.noConditionDataOutValue),
              outputKey
            );
            let hasOutputValueInGroups = _.some(this.conditionGroups, group =>
              _.has(this.parsedOutputValue(group.dataOut), outputKey)
            );

            if (
              !hasOutputValueInNoConditionDataOutValue &&
              !hasOutputValueInGroups
            ) {
              delete this.steps[currentStepIndex]["outputExample"].output[
                outputKey
              ];
            }
          }
        );
      }
    },

    parsedOutputValue(value) {
      let outputValue;
      try {
        outputValue = JSON.parse(_.trim(value));
      } catch (e) {
        outputValue = value;
      }
      return outputValue;
    }
  },

  mounted() {
    if (
      _.isEmpty(this.conditionExits) &&
      !this.schema.isSingleExit &&
      this.$refs["conditionExits"]
    ) {
      this.$refs["conditionExits"].addItem();
    }

    if (
      _.isEmpty(this.conditionGroups) &&
      this.schema.isSingleExit &&
      this.$refs["conditionGroups"]
    ) {
      this.$refs["conditionGroups"].addItem();
    }

    _.forEach(this.conditionExits, exit => {
      if (exit.isEditableHeader) exit.isEditableHeader = false;
    });

    _.forEach(this.conditionGroups, group => {
      if (group.isEditableHeader) group.isEditableHeader = false;
    });

    if (
      this.isSingleExit &&
      (this.mountedFlag || this.conditionGroups.length > 1) &&
      this.schema.conditionRuleHasDataOut &&
      this.schema.hasNoConditionDataOut
    ) {
      this.validateNoConditionDataOutValue(this.noConditionDataOutValue);
    }

    this.mountedFlag = true;
  },

  validations() {
    return {
      schema: validator(this.template)
    };
  }
};

export const data = template => ({
  isSingleExit: template.isSingleExit,
  conditionRuleHasDataOut: template.conditionRuleHasDataOut,
  hasNoConditionDataOut: template.hasNoConditionDataOut,
  conditionExits: template.conditionExits,
  conditionGroups: template.conditionGroups,
  noConditionDataOutValue: template.noConditionDataOutValue,
  mountedFlag: template.mountedFlag
});

export const validator = template => {
  return {
    conditionExits: generateValidators(true, {
      $each: {
        rules: {
          $each: {
            custom(rule) {
              if (rule.valueType === "advanced") {
                if (
                  _.isEmpty(rule.codeValue) ||
                  !validators.jsExpression(rule.codeValue)
                )
                  return false;

                return validators.jsExpressionNonEmptyString(rule.codeValue);
              } else {
                let isMergeField = value => /\$\{this.*\}/.test(value);
                let isEmptyMergeField = value => {
                  return isMergeField(value)
                    ? _.isEmpty(
                        _.replace(value, /^\`\$\{this\.get\(\'|\'\)\}\`$/gm, "")
                      )
                    : false;
                };

                if (
                  rule.valueType === "number" &&
                  ((isNaN(rule.firstValue.slice(1, -1).trim()) &&
                    !isMergeField(rule.firstValue)) ||
                    (isNaN(rule.secondValue.slice(1, -1).trim()) &&
                      !isMergeField(rule.secondValue)))
                ) {
                  return false;
                }

                return rule.isDisabledSecondValue
                  ? validators.jsExpressionNonEmptyString(rule.firstValue) &&
                      !isEmptyMergeField(rule.firstValue)
                  : validators.jsExpressionNonEmptyString(rule.firstValue) &&
                      validators.jsExpressionNonEmptyString(rule.secondValue) &&
                      !isEmptyMergeField(rule.firstValue) &&
                      !isEmptyMergeField(rule.secondValue);
              }
            }
          }
        }
      }
    }),
    conditionGroups: generateValidators(true, {
      $each: {
        rules: {
          $each: {
            custom(rule) {
              if (rule.valueType === "advanced") {
                if (
                  _.isEmpty(rule.codeValue.trim()) ||
                  !validators.jsExpression(rule.codeValue.trim())
                )
                  return false;
                return validators.jsExpressionNonEmptyString(
                  rule.codeValue.trim()
                );
              } else {
                let isMergeField = value => /\$\{this.*\}/.test(value);
                let isEmptyMergeField = value => {
                  return isMergeField(value)
                    ? _.isEmpty(
                        _.replace(value, /^\`\$\{this\.get\(\'|\'\)\}\`$/gm, "")
                      )
                    : false;
                };

                if (
                  rule.valueType === "number" &&
                  ((isNaN(rule.firstValue.slice(1, -1).trim()) &&
                    !isMergeField(rule.firstValue)) ||
                    (isNaN(rule.secondValue.slice(1, -1).trim()) &&
                      !isMergeField(rule.secondValue)))
                ) {
                  return false;
                }

                return rule.isDisabledSecondValue
                  ? validators.jsExpressionNonEmptyString(rule.firstValue) &&
                      !isEmptyMergeField(rule.firstValue)
                  : validators.jsExpressionNonEmptyString(rule.firstValue) &&
                      validators.jsExpressionNonEmptyString(rule.secondValue) &&
                      !isEmptyMergeField(rule.firstValue) &&
                      !isEmptyMergeField(rule.secondValue);
              }
            }
          }
        },
        dataOut: {
          custom(value) {
            let isEmptyMergeField = /\$\{this.*\}/.test(value)
              ? _.isEmpty(
                  _.replace(value, /^\`\$\{this\.get\(\'|\'\)\}\`$/gm, "")
                )
              : false;

            return this.schema.conditionRuleHasDataOut
              ? validators.jsExpressionNonEmptyString(value) &&
                  !isEmptyMergeField
              : true;
          }
        }
      }
    }),
    noConditionDataOutValue: generateValidators(true, {
      custom(value) {
        return this.schema.conditionGroups &&
          this.schema.conditionRuleHasDataOut &&
          this.schema.hasNoConditionDataOut
          ? validators.jsExpressionNonEmptyString(value)
          : true;
      }
    })
  };
};

export const meta = {
  name: "condition-builder-component",
  type: "onereach-studio-form-editor",
  version: "0.6.0"
};
</script>

<style   lang="scss" rel="stylesheet/scss">
.condition-builder-scope {
  button:focus {
    outline: none;
  }

  .conditions-list {
    min-width: 350px;

    &--single-exit > .or-list-items > .list-item:not(:first-child) {
      padding-top: 0;
    }

    > .or-list-items > .list-item {
      margin-top: 0;
      width: 100%;
      flex-wrap: wrap;

      .separator {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        order: 0;

        & > div {
          width: 27px;
          height: 27px;
          transform: rotate(45deg);
          display: flex;
          background-color: #7ed321;
          justify-content: space-around;
          align-items: center;

          & > span {
            font-size: 12px;
            line-height: 14px;
            transform: rotate(-45deg);
            text-transform: uppercase;
            color: #fff;
          }
        }
      }

      & > .sortable-handle {
        order: 1;
      }

      .header__button {
        &.header__button--editing {
          margin-left: 4px;
        }

        &:not(.header__button--editing) {
          opacity: 0;
          margin-left: 6px;
        }
      }

      .remove-button {
        display: none;
      }
    }

    .or-collapsible {
      flex-grow: 1;
      border-left: 3px solid #7ed321;
      background: #f6f6f6;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      order: 2;

      &.is-invalid {
        border-left-color: #f95d5d;
      }

      > .header {
        padding: 6px;
      }

      .body-wrapper {
        //border-top: 1px solid #dfdfdf;

        .body {
          padding: 0 10px;
          border-radius: 0 0 0 3px;
          background: #f6f6f6;
          //border-left: 3px solid #7ED321;
        }
      }
    }

    > .add-button {
      margin-top: 0.4rem;
    }

    .or-list-items > .list-item:hover {
      .header__button:not(.header__button--editing) {
        opacity: 1;
      }
    }

    &__add-button.ui-button {
      padding: 4px 0;

      .ui-button__focus-ring {
        left: 0 !important;
        width: 100% !important;
        border-radius: 0;
      }
    }

    &:not(.readonly) {
      .group-collapsible > .header {
        .header-icon {
          color: #0f232e;
        }
      }
    }
  }

  .condition-exit {
    // min-width: 340px;
  }

  .or-collapsible {
    .body {
      padding: 0 10px;
    }
  }

  .group-collapsible {
    max-width: 100%;

    &.or-collapsible > .header {
      align-items: flex-start;
      overflow: visible;

      .header-icon {
        margin-top: 10.5px;
        margin-left: 3px;
      }
    }

    &.or-collapsible .header-content {
      height: auto;
      width: 100%;
      max-width: calc(100% - 24px);
      overflow: visible;
    }

    .header {
      &__body {
        display: flex;
        justify-content: space-between;
        position: relative;
        align-items: center;
      }

      &__name {
        // max-width: 296px;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        cursor: text;
      }

      &__name-wrapper {
        display: inline-block;
        // max-width: 100%;
        overflow: hidden;
        margin-right: 10px;

        .or-text-expression {
          .editable {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 1px;
          }
        }
      }

      &__dropdown-wrapper {
        margin-left: auto;
        margin-right: 2px;
      }

      &__dropdown {
        &.ui-select {
          margin-bottom: 0;

          &.is-disabled {
            .ui-select__content .ui-select__label {
              .ui-select__label-text {
                color: rgba(0, 0, 0, 0.38);
                opacity: 0.6;
              }
            }
          }
        }

        .ui-select__content .ui-select__label {
          display: flex;

          .ui-select__label-text {
            white-space: nowrap;
            font-size: 14px;
            font-weight: 400;
            color: #0f232e;
          }

          .ui-select__display {
            padding-right: 0;
            padding-left: 5px;
            border: 0;
          }

          .ui-select__dropdown {
            top: 100%;
            right: 0px;
            min-width: 65px;
            width: auto;
          }
        }

        &.ui-select:hover:not(.is-disabled):not(.dropdown-shown)
          .ui-select__content
          .ui-select__label
          .ui-select__display:hover {
          background-color: transparent;
        }
      }

      &__close-button.ui-button {
        width: auto;
        min-width: 24px;
        height: auto;
        margin: 0;
        padding: 0;

        .ui-button__content {
          margin: 0;
        }

        .ui-button__icon {
          margin-right: 0;
        }

        &.ui-button--type-secondary.ui-button--color-default:hover:not([disabled])
          .ui-button__icon {
          color: #3e4143;
        }
      }

      &__input {
        margin-bottom: 0;

        // &.ui-textbox.is-active:not(.is-disabled) {
        //     .ui-textbox__textarea {
        //         background-color: #f6f6f6;
        //     }
        // }

        &.ui-textbox .ui-textbox__input {
          height: auto;
          min-height: auto;
          font-size: 16px;
          font-weight: 600;
          max-width: 296px;
          // background-color: rgba(33, 150, 243, 0.12);
          padding: 0;
          border-radius: 0;
          border: none;

          &:hover {
            // background-color: rgba(33, 150, 243, 0.12);
          }
        }

        &.or-text-expression {
          margin-bottom: 0;

          .header {
            display: none;
          }

          .input-wrapper {
            display: block;
          }

          .or-editable-wrapper {
            border: none;
            max-width: 100%;

            &.active,
            &:not(.readonly):hover {
              background-color: transparent;
            }
          }

          .editable {
            padding: 0;
            font-size: 15px;
            min-height: auto;
            // max-width: 120px;
            // background-color: rgba(33, 150, 243, 0.12);
            // white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;

            &:focus {
              text-overflow: initial;
            }
          }
        }
      }

      &__description-input {
        margin-top: -5px;

        .or-editable-wrapper {
          .editable {
            min-height: 22px;
            font-size: 14px;
            font-weight: 400;
            color: #a8acb3;
            word-break: break-word;
          }

          .placeholder {
            padding: 0;
            margin-top: -22px;
            font-weight: 400;
            color: #a8acb3;
          }
        }
      }

      &__description {
        margin-left: -15px;
        padding-right: 5px;
      }

      &__button {
        margin-left: 5px;
        background-color: transparent;
      }
    }
  }

  .data-block {
    flex-grow: 1;
    padding: 6px 10px 16px;
    border-left: 3px solid #7ed321;
    border-bottom: 1px solid #dfdfdf;
    background: #f6f6f6;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;

    &.is-invalid {
      border-left-color: #f95d5d;
    }

    &__header {
      padding-left: 3px;
      padding-bottom: 5px;
      font-size: 15px;
      font-weight: 600;
    }

    &__body {
      padding: 0 10px 10px;
      background: #ffffff;
      border-radius: 3px;
    }
  }
}
</style>