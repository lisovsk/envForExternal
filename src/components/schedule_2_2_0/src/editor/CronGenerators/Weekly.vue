<template>
  <div class="weekly-scope">
    <div class="weekly">
      <div v-show="isEditable">
        <div class="radio-custom__wr">
          <or-radio v-model="periodModeLocal" true-value="every" :disabled="readonly"></or-radio>
          <or-textbox
            :disabled="readonly"
            :class="['xs-input', /*{'text-box-error': !dailySchedule.isDailyDaysValid}*/]"
            label
            v-model="periodLocal"
            placeholder
            mask="#"
            :invalid="validdationPeriod"
          ></or-textbox>
          <div class>week of a month on</div>
        </div>
        <div class="radio-custom__wr">
          <or-radio v-model="periodModeLocal" true-value="each" :disabled="readonly">Each week</or-radio>
        </div>
        <div
          :class="[
          'weekly-days',
          {'weekly-days_error': validdationWeekDays}
        ]"
        >
          <button
            :class="[
              'btn-group',
              {
                'is-active': isWeekBtnActive(day),
                'is-disabled': readonly,
              }]"
            v-for="day in getWeekDays"
            :key="day.value"
            :disabled="readonly"
            @click="toggleWeeklyDays(day)"
          >{{day.label}}</button>
        </div>
      </div>
      <div v-show="!isEditable">
        <div v-html="textWhenScheduled" v-show="!invalid"></div>
        <div v-show="invalid" class="cron-gen__error">Please correct errors</div>
      </div>
    </div>
  </div>
</template>

<script>
import savedState from "./savedState.js";
import { generateCrons, getOrdinalFor } from "./helpers.js";

export default {
  created() {
    this.$emit("input", this.cronExpression());
  },
  data() {
    return {
      getWeekDays: [
        { label: "Mon", value: "1" },
        { label: "Tue", value: "2" },
        { label: "Wed", value: "3" },
        { label: "Thu", value: "4" },
        { label: "Fri", value: "5" },
        { label: "Sat", value: "6" },
        { label: "Sun", value: "0" }
      ]
      //   weekDaysLocal: this.weekDays,
      //   periodLocal: this.period,
    };
  },
  props: {
    periodMode: {
      type: String,
      default: "every"
    },
    readonly: {
      type: Boolean,
      default: false
    },
    weekDays: {
      type: Array,
      default() {
        return [];
      }
    },
    period: {
      type: String,
      default: ""
    },
    runAtTime: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    index: {
      type: Number,
      default: -1
    },
    previewTextsLocal: {
      type: Object,
      default: null
    },
    $v: null,
    invalid: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    isWeekBtnActive(day) {
      return _.find(this.weekDaysLocal, weekDay => weekDay.value === day.value);
    },
    toggleWeeklyDays(day) {
      this.$v.validationCopyScheduleEventData.weekly.weekDays.$touch();
      if (_.some(this.weekDaysLocal, day)) {
        this.weekDaysLocal = this.weekDaysLocal.filter(
          item => item.value !== day.value
        );
      } else {
        this.weekDaysLocal.push(day);
      }
    },
    cronExpression() {
      if (
        (this.periodModeLocal === "every" &&
          (this.periodLocal === "0" || _.isEmpty(this.periodLocal))) ||
        !this.weekDaysLocal.length
      ) {
        return [];
      }

      const weekDays = _.map(
        this.weekDaysLocal,
        weekDay =>
          `${weekDay.label.toUpperCase()}${
            this.periodModeLocal === "every" ? `#${this.periodLocal}` : ""
          }`
      );
      return generateCrons(this.runAtTime, `*  * ${weekDays} *`);
    }
  },
  computed: {
    dataLocal: {
      get() {
        return this.weeklyData;
      },
      set(newWeeklyData) {
        this.$emit("update:weeklyData", newWeeklyData);
      }
    },
    weekDaysLocal: {
      get() {
        return this.weekDays;
      },
      set(newWeekDays) {
        this.$emit("update:weekDays", newWeekDays);
      }
    },
    periodModeLocal: {
      get() {
        return this.periodMode;
      },
      set(newPeriodMode) {
        this.$emit("update:periodMode", newPeriodMode);
      }
    },
    periodLocal: {
      get() {
        return this.period;
      },
      set(newPeriod) {
        let period = parseInt(newPeriod, 10);
        period = period ? period.toString() : "";
        this.$emit("update:period", period);
      }
    },
    textWhenScheduled() {
      let text = `${this.periodModeLocal.charAt(0).toUpperCase() +
        this.periodModeLocal.slice(1)} <span class="bold-text">${
        this.periodModeLocal === "every"
          ? getOrdinalFor(this.periodLocal, true)
          : ""
      }</span> week on `;
      this.weekDaysLocal.forEach((item, index) => {
        text += `<span class="bold-text">${item.label}</span>`;
        if (this.weekDaysLocal.length - 1 !== index) {
          text += ", ";
        }
      });
      this.previewTextsLocal.reccuring = text;
      return text;
    },
    validdationPeriod() {
      return _.get(
        this.$v,
        "validationCopyScheduleEventData.weekly.period.$invalid",
        false
      );
    },
    validdationWeekDays() {
      return (
        _.get(
          this.$v,
          "validationCopyScheduleEventData.weekly.weekDays.$invalid",
          false
        ) &&
        _.get(
          this.$v,
          "validationCopyScheduleEventData.weekly.weekDays.$dirty",
          false
        )
      );
    }
  },
  watch: {
    runAtTime() {
      this.$emit("input", this.cronExpression());
    },
    weekDaysLocal() {
      this.$emit("input", this.cronExpression());
      this.$emit("change-saved-accordion-num-item", this.index);
    },
    periodLocal() {
      this.$emit("input", this.cronExpression());
      this.$emit("change-saved-accordion-num-item", this.index);
    },
    periodModeLocal() {
      this.$emit("input", this.cronExpression());
      this.$emit("change-saved-accordion-num-item", this.index);
    }
  },
  mixins: [savedState]
};
</script>

<style lang="scss">
.weekly-scope {
  .weekly {
    .radio-custom__wr {
      display: flex;
      align-items: center;
      margin-bottom: 5px;

      .xs-input {
        margin-bottom: 0;
        padding-right: 16px;
      }

      .xs-input .ui-textbox__input {
        min-height: 26px;
        height: 26px;
        width: 41px;
        padding-top: 6px;
        padding-bottom: 6px;
      }
      .ui-radio__label-text {
        color: #0f232e;
        font-size: 14px;
        line-height: 16px;
      }

      .ui-radio {
        display: flex;
        align-items: center;
        padding-right: 16px;
      }
    }

    .weekly-days {
      margin: 10px 0 0 0;

      &_error {
        border: #f95d5d 1px solid;
      }

      .btn-group {
        font-size: 14px;
        color: #0f232e;
        width: 34px;
        height: 25px;
        border: solid 1px #e7e7e7;
        background-color: #fbfbfb;
        padding: 0;
        font-size: 12px;
        cursor: pointer;
        &:hover {
          color: #59a9d5;
          border: solid 1px #59a9d5;
          background-color: #fbfbfb;
        }
        &.is-disabled:hover {
          color: #0f232e;
          border: solid 1px #e7e7e7;
          background-color: #fbfbfb;
          cursor: default;
        }
        &.is-active,
        &.is-active:hover {
          background-color: #59a9d5;
          // border-color: #59a9d5;
          color: #ffffff;
        }
      }
    }
    .cron-gen__error {
      color: #f95d5d;
    }
  }
}
</style>

