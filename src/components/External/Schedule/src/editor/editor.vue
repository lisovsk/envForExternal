<template>
  <div>
    <!-- {{$v}}
    33sdfdsssdsfs
    {{schema}} -->
    <!-- {{scheduleEventsComp[0].scheduleEventData.times}} -->
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
import * as _ from 'lodash';
import moment from 'moment';

/* eslint-disable */
// if (process.env.NODE_ENV === 'development') {
// import { validators } from '../../../../../validators.js';
// } else {
// import { validators } from '_validators';
// }

import ScheduleEvents from './ScheduleEvents/ScheduleEvents.vue';

import valdationsReccurin from './validation/validationReccuring.js';

import defaultValues from './Constants/DefaultValues.js';

/* eslint-enable */

// const { required, generateValidators, minValue } = validators;
import { required } from 'vuelidate/lib/validators';
// const schemaValidation = ;

export const validator = template => {
  return { scheduleEvents: { required } };
  // return {
  //   // scheduleEventsValidation: {
  //   // required,
  //   // scheduleEvents: {
  //   // required,
  //   //     $each: {
  //   //       scheduleEventData: _.cloneDeep(schemaValidation),
  //   //     },
  //   // },
  //   // },
  // };
};

export const data = template => ({
  scheduleEvents: _.get(this, 'schema.scheduleEvents', null) || [],
  // scheduleEventsValidation: _.get(this, 'schema.scheduleEvents', null) || [];
  // validationCopyScheduleEventData: {},
});

export default {
  props: {
    template: null,
    schema: {
      type: Object,
      default: () => ({}),
    },
    step: null,
    stepId: null,
    steps: null,
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    scheduleEventsComp: {
      get() {
        return _.get(this, 'schema.scheduleEvents', null) || [];
      },
      set(newValue) {
        if (_.get(this, 'schema.scheduleEvents', null)) {
          this.schema.scheduleEvents = newValue;
          // this.scheduleEventsValidation = newValue;
          // this.$set(this.scheduleEventsValidation, 'scheduleEvents', newValue);
          // if (newValue.scheduleEvents) {
          //   this.scheduleEventsValidation.scheduleEvents = this.schema.scheduleEvents;
          // }
        }
      },
    },
    // this.validationCopyScheduleEventDataComp() {
    //   return validationCopyScheduleEventData
    // }
  },
  watch: {
    // schema: {
    //   handler(newValue) {
    //     // console.log('newValue234234234', JSON.stringify(newValue));
    //     if (newValue.scheduleEvents) {
    //       this.scheduleEventsValidation.scheduleEvents =
    //         newValue.scheduleEvents;
    //     }
    //   },
    //   deep: true,
    // },
    $v: {
      handler(newValue) {
        this.$emit('step-validation', newValue);
      },
      deep: true,
    },
  },
  methods: {
    newCopyScheduleEventData(newValue) {
      // console.log(
      //   'validationCopyScheduleEventData',
      //   this.schema.validationCopyScheduleEventData,
      // );
      if (this.validationCopyScheduleEventData) {
        this.validationCopyScheduleEventData = newValue;
      }
    },
  },
  components: { ScheduleEvents },
  validations: {
    validationCopyScheduleEventData: {
      // required,
      eventName: { required },
      // custom(value) {
      //   // console.log('valuevalue', value);
      //   if (!value) {
      //     return false;
      //   }
      //   let valid = true;
      //   if (value.isReccuring) {
      //     if (!value.isEndTime && !value.endExpression.date) {
      //       valid = false;
      //     }

      //     if (!value.savedAccordionSlotName) {
      //       valid = false;
      //     }

      //     if (!valdationsReccurin.daily(value)) {
      //       valid = false;
      //     }

      //     if (!valdationsReccurin.weekly(value)) {
      //       valid = false;
      //     }

      //     if (!valdationsReccurin.monthly(value)) {
      //       valid = false;
      //     }

      //     if (!valdationsReccurin.yearly(value)) {
      //       valid = false;
      //     }
      //   }

      //   return valid;
      // },
      startExpression: {
        required,
        date: {
          required,
        },
      },
      endExpression: {
        required,
        date: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, 'validationCopyScheduleEventData.isReccuring') &&
              !_.get(this, 'validationCopyScheduleEventData.isEndTime')
            ) {
              valid =
                !!value &&
                moment(
                  this.validationCopyScheduleEventData.startExpression.date,
                ).isSameOrBefore(moment(value));
            }
            return valid;
          },
        },
      },
      timeZone: {
        value: {
          required,
        },
      },
      times: {
        $each: {
          start: {
            custom(value, state) {
              console.log('__valueStart__', value);
              let valid = true;
              if (state) {
                valid =
                  !!_.get(value, 'HH', false) && !!_.get(value, 'mm', false);
              } else {
                return true;
              }
              return valid;
            },
          },
          end: {
            custom(value, state) {
              console.log('__valueEnd__', value);
              let valid = true;
              if (state) {
                if (_.get(state, 'endTime', false)) {
                  valid =
                    !!_.get(value, 'HH', false) && !!_.get(value, 'mm', false);
                }
              } else {
                return true;
              }
              return valid;
            },
          },
          endTime: {},
          every: {
            custom(value, state) {
              console.log('__valueEvery__', value);
              let valid = true;
              if (state) {
                valid =
                  _.get(value, 'val', false) &&
                  parseInt(_.get(value, 'val', 0), 10) > 0;
              } else {
                return true;
              }
              return valid;
            },
          },
        },
        // custom(value) {
        //   // console.log('valuevalue', value);
        //   if (!value) {
        //     return false;
        //   }
        //   let valid = true;
        //   value.forEach(item => {
        //     if (!item.start.HH || !item.start.mm) {
        //       valid = false;
        //     }
        //     if (item.endTime && (!item.end.HH || !item.end.mm)) {
        //       valid = false;
        //     }
        //     if (item.endTime && (!item.every.val || item.every.val < 1)) {
        //       valid = false;
        //     }
        //   });
        //   return valid;
        // },
      },
      savedAccordionSlotName: {
        custom(value) {
          let valid = true;
          if (_.get(this, 'validationCopyScheduleEventData.isReccuring'))
            valid = !!value;
          return valid;
        },
      },
      daily: {
        period: {
          custom(stateCurr, stateAbove) {
            let valid = true;
            if (
              _.get(this, 'validationCopyScheduleEventData.isReccuring') &&
              _.get(
                this,
                'validationCopyScheduleEventData.savedAccordionSlotName',
              ) === 'item1'
            ) {
              valid =
                _.get(stateAbove, 'periodMode') !== 'everyDay'
                  ? true
                  : stateCurr && stateCurr > 0;
            }
            return valid;
          },
        },
      },
      weekly: {
        period: {
          custom(value) {
            console.log('validationCopyScheduleEventData3', this);
            let valid = true;
            if (
              _.get(this, 'validationCopyScheduleEventData.isReccuring') &&
              _.get(
                this,
                'validationCopyScheduleEventData.savedAccordionSlotName',
              ) === 'item2' &&
              (!value || value < 1)
            ) {
              valid = false;
            }
            return valid;
          },
        },
        weekDays: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, 'validationCopyScheduleEventData.isReccuring') &&
              _.get(
                this,
                'validationCopyScheduleEventData.savedAccordionSlotName',
              ) === 'item2' &&
              !value.length
            ) {
              valid = false;
            }
            return valid;
          },
        },
      },

      monthly: {
        selectedMonths: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, 'validationCopyScheduleEventData.isReccuring') &&
              _.get(
                this,
                'validationCopyScheduleEventData.savedAccordionSlotName',
              ) === 'item3' &&
              !value.length
            ) {
              valid = false;
            }
            return valid;
          },
        },
        selectedDays: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, 'validationCopyScheduleEventData.isReccuring') &&
              _.get(
                this,
                'validationCopyScheduleEventData.savedAccordionSlotName',
              ) === 'item3' &&
              (_.get(this, 'validationCopyScheduleEventData.monthly.mode') ===
                'each' &&
                !value.length)
            ) {
              valid = false;
            }
            return valid;
          },
        },
      },
      yearly: {
        period: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, 'validationCopyScheduleEventData.isReccuring') &&
              _.get(
                this,
                'validationCopyScheduleEventData.savedAccordionSlotName',
              ) === 'item4' &&
              (!value || value < 1)
            ) {
              valid = false;
            }
            return valid;
          },
        },
        selectedMonths: {
          custom(value) {
            let valid = true;
            if (
              _.get(this, 'validationCopyScheduleEventData.isReccuring') &&
              _.get(
                this,
                'validationCopyScheduleEventData.savedAccordionSlotName',
              ) === 'item4' &&
              !value.length
            ) {
              valid = false;
            }
            return valid;
          },
        },
      },
    },
  },
  // validations() {
  //   return validator(this.template);
  // },
  // created() {
  //   this.validationCopyScheduleEventData = this.schema.validationCopyScheduleEventData;
  // },
  created() {
    this.schema.scheduleEvents = this.schema.scheduleEvents || [];
  },
  data() {
    return {
      validationCopyScheduleEventData: {},
    };
  },
};

export const meta = {
  name: 'schedule-component',
  type: 'onereach-studio-form-editor',
  version: '0.5.0',
};
</script>

<style lang="scss" scoped>
.disabled {
  pointer-events: none;
}
</style>
