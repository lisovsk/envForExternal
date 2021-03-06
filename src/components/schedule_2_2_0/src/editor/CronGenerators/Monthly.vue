<template>
  <div class="monthly-scope">
    <div class="monthly">
      <div v-show="isEditable">
        <div class="monthly__month-picker">
          <month-picker
            v-model="selectedMonthsComp"
            :disabled="readonly"
            :invalid="validdationSelectedMonths"
            :$v="$v"
            @touch="$v.validationCopyScheduleEventData.monthly.selectedMonths.$touch()"
          ></month-picker>
        </div>
        <div class="recuring-configs__monthly-day_configs">
          <div class="config-line monthly__each" v-if="selectedMonths.length">
            <or-radio
              v-model="modeComp"
              true-value="each"
              :disabled="!selectedMonthsComp.length 
                  || readonly"
              class="config-line__radio"
            >each</or-radio>
            <days-picker
              :months="selectedMonthsComp"
              :selected-days.sync="selectedDaysComp"
              :readonly="readonly || modeComp === 'onThe'"
              :invalid="validdationSelectedDays"
              :$v="$v"
              @changed-month-days="changedMonthDays"
              @touch="$v.validationCopyScheduleEventData.monthly.selectedDays.$touch()"
            ></days-picker>
          </div>
          <div class="config-line" v-if="selectedMonths.length">
            <or-radio
              v-model="modeComp"
              true-value="onThe"
              :disabled="!selectedMonthsComp.length || readonly"
              class="config-line__radio"
            >on the</or-radio>
            <div class="monthly-periods">
              <or-select
                :disabled="readonly || modeComp === 'each'"
                :class="['config-line__select', /*{'select-box-error': !daysPeriodComp.period}*/]"
                label
                placeholder
                @change="/*monthlyDaysPeriodChange*/"
                v-model="daysPeriodComp.period"
                :options="getDaysPeriod"
              ></or-select>
              <or-select
                :disabled="readonly || modeComp === 'each'"
                :class="['config-line__select', /*{'select-box-error': !daysPeriodComp.day}*/]"
                label
                placeholder
                @change="/*monthlyDaysPeriodChange*/"
                v-model="daysPeriodComp.day"
                :options="getWeekDays"
              ></or-select>
            </div>
          </div>
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
import MonthPicker from "../MonthPicker/MonthPicker.vue";
import DaysPicker from "../DaysPicker/DaysPicker.vue";
import moment from "moment-timezone";
import savedState from "./savedState.js";
import { generateCrons } from "./helpers.js";

export default {
  created() {
    this.$emit("input", this.cronExpression());
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    selectedMonths: {
      type: Array,
      default() {
        return [];
      }
    },
    selectedDays: {
      type: Array,
      default() {
        return [];
      }
    },
    mode: {
      type: String,
      default: ""
    },
    daysPeriod: {
      type: Object,
      default() {
        return {
          day: "",
          period: ""
        };
      }
    },
    period: {
      type: String,
      default: "1"
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    runAtTime: {
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
  data() {
    return {
      getDaysPeriod: [
        { label: "every", value: "" },
        { label: "first", value: "#1" },
        { label: "second", value: "#2" },
        { label: "third", value: "#3" },
        { label: "forth", value: "#4" },
        { label: "fifth", value: "#5" },
        { label: "last", value: "L" }
      ],
      getWeekDays: [
        { label: "Sunday", value: "SUN" },
        { label: "Monday", value: "MON" },
        { label: "Tuesday", value: "TUE" },
        { label: "Wednesday", value: "WED" },
        { label: "Thursday", value: "THU" },
        { label: "Friday", value: "FRI" },
        { label: "Saturday", value: "SAT" }
      ],
      modeComp: this.mode
    };
  },
  computed: {
    selectedMonthsComp: {
      get() {
        return this.selectedMonths;
      },
      set(newValue) {
        this.$emit("update:selectedMonths", newValue);
      }
    },
    selectedDaysComp: {
      get() {
        return this.selectedDays;
      },
      set(newValue) {
        this.$emit("update:selectedDays", newValue);
      }
    },
    daysPeriodComp: {
      get() {
        return this.daysPeriod;
      },
      set(newValue) {
        this.$emit("update:daysPeriod", newValue);
      }
    },
    periodComp: {
      get() {
        return this.period;
      },
      set(newValue) {
        this.$emit("update:period", newValue);
      }
    },
    textWhenScheduled() {
      let text = `Every `;
      this.selectedMonthsComp.forEach((item, index) => {
        text += `<span class="bold-text">${moment(item, "MM").format(
          "MMMM"
        )}</span>`;
        if (this.selectedMonthsComp.length - 1 !== index) {
          text += ", ";
        }
      });
      text += " on ";
      if (this.modeComp === "each") {
        _.sortBy(this.selectedDaysComp).forEach((item, index) => {
          text += `<span class="bold-text">${item}</span>`;
          if (this.selectedDaysComp.length - 1 !== index) {
            text += ", ";
          }
        });
        text += ` day${this.selectedDaysComp.length > 1 ? "s" : ""}`;
      } else if (this.modeComp === "onThe") {
        text += `the <span class="bold-text">${
          _.find(
            this.getDaysPeriod,
            item => item.value === this.daysPeriodComp.period
          ).label
        }</span> 
        <span class="bold-text">${
          _.find(
            this.getWeekDays,
            item => item.value === this.daysPeriodComp.day
          ).label
        }</span>`;
      }
      this.previewTextsLocal.reccuring = text;
      return text;
    },
    validdationSelectedMonths() {
      return (
        _.get(
          this.$v,
          "validationCopyScheduleEventData.monthly.selectedMonths.$invalid"
        ) &&
        _.get(
          this.$v,
          "validationCopyScheduleEventData.monthly.selectedMonths.$dirty",
          false
        )
      );
    },
    validdationSelectedDays() {
      return (
        _.get(
          this.$v,
          "validationCopyScheduleEventData.monthly.selectedDays.$invalid"
        ) &&
        _.get(
          this.$v,
          "validationCopyScheduleEventData.monthly.selectedDays.$dirty",
          false
        )
      );
    }
  },
  watch: {
    modeComp(newValue) {
      this.$emit("update:mode", newValue);
    },

    runAtTime() {
      this.$emit("input", this.cronExpression());
    },
    selectedDays() {
      this.$emit("input", this.cronExpression());
      this.$emit("change-saved-accordion-num-item", this.index);
    },
    selectedMonths() {
      this.$emit("input", this.cronExpression());
      this.$emit("change-saved-accordion-num-item", this.index);
    },
    mode() {
      this.$emit("input", this.cronExpression());
      this.$emit("change-saved-accordion-num-item", this.index);
    },
    daysPeriodComp: {
      handler() {
        this.$emit("input", this.cronExpression());
        this.$emit("change-saved-accordion-num-item", this.index);
      },
      deep: true
    }
  },

  methods: {
    cronExpression() {
      if (!this.selectedMonthsComp.length) return [];
      let exp = "";
      if (this.modeComp === "each") {
        if (!this.selectedDaysComp.length) return [];
        exp = generateCrons(
          this.runAtTime,
          `${this.selectedDaysComp} ${this.selectedMonthsComp} ? *`
        );
      } else if (this.modeComp === "onThe") {
        exp = generateCrons(
          this.runAtTime,
          `? ${this.selectedMonthsComp} ${this.daysPeriodComp.day}${
            this.daysPeriodComp.period
          } *`
        );
      }
      return exp;
    },
    changedMonthDays(newDays) {
      this.selectedDaysComp = _.reduce(
        this.selectedDaysComp,
        (result, item) => {
          if (_.includes(newDays, item)) {
            result.push(item);
          }
          return result;
        },
        []
      );
    }
  },
  components: { MonthPicker, DaysPicker },
  mixins: [savedState]
};
</script>

<style lang="scss">
.monthly-scope {
  .monthly {
    &__month-picker {
      width: 262px;
    }
    &__each {
      margin-bottom: 10px;
    }
    .recuring-configs__monthly-day_configs div.config-line {
      flex-direction: row;
      display: flex;
      max-width: 294px;
    }
    .config-line__radio {
      padding-right: 10px;
      width: 85px;
    }
    .ui-select .ui-select__content .ui-select__label .ui-select__display {
      min-height: 26px;
      max-width: 120px;
      width: 100px;
    }

    .config-line__select.ui-select
      .ui-select__display
      .ui-select__display-value {
      max-width: 60px;
      line-height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ui-radio .ui-radio__label-text {
      white-space: nowrap;
    }
    .cron-gen__error {
      color: #f95d5d;
    }
  }
}
</style>

