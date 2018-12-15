<template>
  <div>
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
import * as _ from "lodash";
import moment from "moment";

/* eslint-disable */
import ScheduleEvents from "./ScheduleEvents/ScheduleEvents.vue";
import valdationsReccurin from "./validation/validationReccuring.js";
import defaultValues from "./Constants/DefaultValues.js";
/* eslint-enable */
import { required } from "vuelidate/lib/validators";

export const validator = template => {
  return { scheduleEvents: { required } };
};

export const data = template => ({
  scheduleEvents: _.get(this, "schema.scheduleEvents", null) || []
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
    }
  },
  computed: {
    scheduleEventsComp: {
      get() {
        return _.get(this, "schema.scheduleEvents", null) || [];
      },
      set(newValue) {
        if (_.get(this, "schema.scheduleEvents", null)) {
          this.schema.scheduleEvents = newValue;
        }
      }
    }
  },
  watch: {
    $v: {
      handler(newValue) {
        this.$emit("step-validation", newValue);
      },
      deep: true
    }
  },
  methods: {
    newCopyScheduleEventData(newValue) {
      if (this.validationCopyScheduleEventData) {
        this.validationCopyScheduleEventData = newValue;
      }
    }
  },
  components: { ScheduleEvents },
  validations: {
    validationCopyScheduleEventData: {
      eventName: { required },
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
                valid =
                  _.get(value, "val", false) &&
                  parseInt(_.get(value, "val", 0), 10) > 0;
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
                  : stateCurr && stateCurr > 0;
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
              (!value || value < 1)
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
    this.schema.scheduleEvents = this.schema.scheduleEvents || [];
  },
  data() {
    return {
      validationCopyScheduleEventData: {}
    };
  }
};

export const meta = {
  name: "schedule-component",
  type: "onereach-studio-form-editor",
  version: "0.5.0"
};
</script>

<style lang="scss" scoped>
.disabled {
  pointer-events: none;
}
</style>
