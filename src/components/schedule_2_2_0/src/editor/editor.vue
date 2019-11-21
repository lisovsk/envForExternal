<template>
  <div>
    <div class="error-text" v-if="showError">At least 1 event should be created</div>
    <schedule-events
      :schedule-events.sync="scheduleEventsComp"
      :step="step"
      :stepId="stepId"
      :$v="$v"
      :readonly="readonly"
      @new-copy-schedule-event-data="newCopyScheduleEventData"
      :class="{disabled: readonly}"
    ></schedule-events>
  </div>
</template>
<script>
import moment from "moment";

import ScheduleEvents from "./ScheduleEvents/ScheduleEvents.vue";
import valdationsReccurin from "./validation/validationReccuring.js";
import defaultValues from "./Constants/DefaultValues.js";
import { required } from "vuelidate/lib/validators";

export const validator = template => {
  return {
    scheduleEvents: {
      custom(newScheduleEvents, schema) {
        return _.get(newScheduleEvents, "length") > 0;
      }
    }
  };
};

export const data = template => ({
  scheduleEvents: []
});

export default {
  props: {
    template: null,
    schema: {
      type: Object,
      default: () => ({})
    },
    step: null,
    stepId: null,
    steps: null,
    readonly: {
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    scheduleEventsComp: {
      get() {
        return _.get(this.schema, "scheduleEvents", null) || [];
      },
      set(newValue) {
        _.set(this.schema, "scheduleEvents", newValue);
      }
    },
    showError() {
      return this.scheduleEventsComp.length < 1 && !this.isNew;
    }
  },
  watch: {
    $v: {
      handler(newValue) {
        this.$emit("step-validation", newValue);
      },
      deep: true
    },
    "schema.scheduleEvents": {
      handler(newScheduleEvents) {
        if (this.schema.multipleLegs) {
          this.doMultipleLegs(newScheduleEvents);
        } else {
          this.doSingleLag();
        }
      }
    },
    "schema.multipleLegs": {
      handler(newMultipleLegs) {
        if (newMultipleLegs) {
          this.doMultipleLegs(this.schema.scheduleEvents);
        } else {
          this.doSingleLag();
        }
      }
    }
  },
  methods: {
    doMultipleLegs(newScheduleEvents) {
      const firstEvent = _.get(newScheduleEvents[0], "scheduleEventData");

      if (firstEvent) {
        this.mapDefaultLeg(firstEvent.eventName || "No name", firstEvent.id);
      }

      const newExits = newScheduleEvents.map(item => {
        return {
          id: item.scheduleEventData.id,
          label: item.scheduleEventData.eventName || "No name",
          stepId: "",
          dynamic: true
        };
      });

      this.deleteExitsIfEvetsDeleted(newExits, this.schema.exits);
      this.addExitsIfEvetsDeleted(newExits, this.schema.exits);
      this.mapLabelForlegs(newExits, this.schema.exits);

      if (!this.schema.exits.length) {
        this.schema.exits.push({
          id: "next",
          label: "next",
          stepId: "",
          dynamic: true
        });
      }
    },
    doSingleLag(newMultipleLegs) {
      if (this.schema.scheduleEvents.length && this.schema.exits.length) {
        this.schema.exits.splice(1);
        this.schema.exits[0].label = "next";
        this.schema.exits[0].id = "next";
      }
    },
    mapDefaultLeg(newLabel, newId) {
      _.each(this.schema.exits, item => {
        if (item.id === "next") {
          item.label = newLabel;
          item.id = newId;
        }
      });
    },
    mapLabelForlegs(newLabel, currentExits) {
      _.each(currentExits, itemFromCurr => {
        const itemFromNewLabel = newLabel.find(
          itemFromNew => itemFromNew.id === itemFromCurr.id
        );
        if (itemFromNewLabel) {
          itemFromCurr.label = itemFromNewLabel.label;
        }
      });
    },
    deleteExitsIfEvetsDeleted(newExits, currentExits) {
      const newExitsIds = newExits.map(item => item.id);
      _.each(currentExits, (item, index) => {
        if (item && !_.includes(newExitsIds, item.id)) {
          currentExits.splice(index, 1);
        }
      });
    },
    addExitsIfEvetsDeleted(newExits, currentExits) {
      const currentExitsIds = currentExits.map(item => item.id);
      const diffNewExitsCurrentExits = newExits.filter(
        item => !_.includes(currentExitsIds, item.id)
      );

      _.each(diffNewExitsCurrentExits, item => {
        currentExits.push(item);
      });
    },
    newCopyScheduleEventData(newValue) {
      if (this.validationCopyScheduleEventData) {
        this.validationCopyScheduleEventData = newValue;
      }
    }
  },
  components: { ScheduleEvents },
  validations: {
    validationCopyScheduleEventData: {
      eventName: {},
      startExpression: {
        required,
        date: {
          required
        }
      },
      endExpression: {
        required,
        date: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, "validationCopyScheduleEventData.isReccuring") &&
              !_.get(this, "validationCopyScheduleEventData.isEndTime")
            ) {
              valid =
                !!value &&
                moment(
                  this.validationCopyScheduleEventData.startExpression.date
                ).isSameOrBefore(moment(value));
            }
            return valid;
          }
        }
      },

      timeZone: {
        value: {
          required
        }
      },
      times: {
        $each: {
          start: {
            custom(value, state) {
              let valid = true;
              if (state) {
                valid =
                  !!_.get(value, "HH", false) && !!_.get(value, "mm", false);
              } else {
                return true;
              }
              return valid;
            }
          },
          end: {
            custom(value, state) {
              let valid = true;
              if (state) {
                if (_.get(state, "endTime", false)) {
                  valid =
                    !!_.get(value, "HH", false) &&
                    !!_.get(value, "mm", false) &&
                    new Date(`1970/01/01 ${value.HH}:${value.mm}`) -
                      new Date(
                        `1970/01/01 ${state.start.HH}:${state.start.mm}`
                      ) >
                      0;
                }
              } else {
                return true;
              }
              return valid;
            }
          },
          endTime: {},
          every: {
            custom(value, state) {
              let valid = true;
              if (state) {
                const val = _.get(value, "val", 0);
                const valInt = parseInt(val, 10);
                valid = val && valInt > 0;
                if (state.every.units === "mm") {
                  valid = valid && valInt <= 1440;
                } else if (state.every.units === "hh") {
                  valid = valid && valInt <= 23;
                }
              } else {
                return true;
              }
              return valid;
            }
          }
        }
      },
      savedAccordionSlotName: {
        custom(value) {
          let valid = true;
          if (_.get(this, "validationCopyScheduleEventData.isReccuring"))
            valid = !!value;
          return valid;
        }
      },
      daily: {
        period: {
          custom(stateCurr, stateAbove) {
            let valid = true;
            if (
              _.get(this, "validationCopyScheduleEventData.isReccuring") &&
              _.get(
                this,
                "validationCopyScheduleEventData.savedAccordionSlotName"
              ) === "item1"
            ) {
              valid =
                _.get(stateAbove, "periodMode") !== "everyDay"
                  ? true
                  : stateCurr && stateCurr > 0 && stateCurr <= 31;
            }
            return valid;
          }
        }
      },
      weekly: {
        period: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, "validationCopyScheduleEventData.isReccuring") &&
              _.get(
                this,
                "validationCopyScheduleEventData.savedAccordionSlotName"
              ) === "item2" &&
              (!value || value < 1 || value > 6)
            ) {
              valid = false;
            }
            return valid;
          }
        },
        weekDays: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, "validationCopyScheduleEventData.isReccuring") &&
              _.get(
                this,
                "validationCopyScheduleEventData.savedAccordionSlotName"
              ) === "item2" &&
              !value.length
            ) {
              valid = false;
            }
            return valid;
          }
        }
      },

      monthly: {
        selectedMonths: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, "validationCopyScheduleEventData.isReccuring") &&
              _.get(
                this,
                "validationCopyScheduleEventData.savedAccordionSlotName"
              ) === "item3" &&
              !value.length
            ) {
              valid = false;
            }
            return valid;
          }
        },
        selectedDays: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, "validationCopyScheduleEventData.isReccuring") &&
              _.get(
                this,
                "validationCopyScheduleEventData.savedAccordionSlotName"
              ) === "item3" &&
              (_.get(this, "validationCopyScheduleEventData.monthly.mode") ===
                "each" &&
                !value.length)
            ) {
              valid = false;
            }
            return valid;
          }
        }
      },
      yearly: {
        period: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, "validationCopyScheduleEventData.isReccuring") &&
              _.get(
                this,
                "validationCopyScheduleEventData.savedAccordionSlotName"
              ) === "item4" &&
              (!value || value < 1)
            ) {
              valid = false;
            }
            return valid;
          }
        },
        selectedMonths: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, "validationCopyScheduleEventData.isReccuring") &&
              _.get(
                this,
                "validationCopyScheduleEventData.savedAccordionSlotName"
              ) === "item4" &&
              !value.length
            ) {
              valid = false;
            }
            return valid;
          }
        }
      }
    }
  },
  created() {
    _.set(
      this.schema,
      "scheduleEvents",
      _.get(this.schema, "scheduleEvents", []) || []
    );
  },
  data() {
    return {
      validationCopyScheduleEventData: {}
    };
  }
};

export const toJSON = ({ schema, inputData, context }) => {
  return {
    scheduleEvents: JSON.stringify(schema.scheduleEvents)
  };
};

export const meta = {
  name: "schedule-component",
  type: "onereach-studio-form-editor",
  version: "0.5.0"
};
</script>

<style lang="scss" scoped>
.error-text {
  font-size: 14px;
  color: #f95d5d;
}
.disabled {
  pointer-events: none;
}
</style>
