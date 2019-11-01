<template>
  <div class="daily-scope">
    <div class="daily">
      <div v-if="editMode">
        <div class="radio-custom__wr">
          <or-radio
            v-model="periodModeLocal"
            true-value="EVERY_DAY"
            class
            :disabled="readonly"
          >Every:</or-radio>
          <or-textbox
            :disabled="readonly || periodModeLocal !== 'EVERY_DAY'"
            :class="['xs-input', /*{'text-box-error': !dailySchedule.isDailyDaysValid}*/]"
            label
            v-model="periodLocal"
            placeholder
            mask="##########"
            :invalid="validationPeriod"
          ></or-textbox>
          <div class>day(s) in each month</div>
        </div>
        <div class="radio-custom__wr">
          <or-radio
            v-model="periodModeLocal"
            true-value="EVEN_DAYS"
            class
            :disabled="readonly"
          >Every</or-radio>
          <div class>even day</div>
        </div>
        <div class="radio-custom__wr">
          <or-radio v-model="periodModeLocal" true-value="ODD_DAYS" class :disabled="readonly">Every</or-radio>
          <div class>odd day</div>
        </div>
        <div class="radio-custom__wr">
          <or-radio
            v-model="periodModeLocal"
            true-value="SPECIFIC_DAYS"
            :disabled="readonly"
            class="config-line__radio"
          ></or-radio>
          <days-picker
            :selected-days.sync="selectedDaysComp"
            :readonly="readonly || periodModeLocal !== 'SPECIFIC_DAYS'"
            :invalid="false/*validdationSelectedDays*/"
            @touch="true/*$v.validationCopyScheduleEventData.monthly.selectedDays.$touch()*/"
          ></days-picker>
        </div>
      </div>
      <div v-else>
        <div v-html="textWhenScheduled" v-show="!invalid"></div>
        <div v-show="invalid" class="cron-gen__error">Please correct errors</div>
      </div>
    </div>
  </div>
</template>

<script>
import savedState from "./savedState.js";
import CRON_THAT_NEVER_RUN from "./Constants.js";
import { generateCrons, getOrdinalFor } from "./helpers.js";
import DaysPicker from "../DaysPicker/DaysPicker.vue";

export default {
  created() {
    this.$emit("input", this.cronExpression());
  },
  data() {
    return {};
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    period: {
      type: String,
      default: "1"
    },
    periodMode: {
      type: String,
      default: "EVERY_DAY"
    },
    runAtTime: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: String,
      default: ""
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
    },
    selectedDays: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    periodLocal: {
      get() {
        return this.period;
      },
      set(newValue) {
        let period = parseInt(newValue, 10);
        period = period ? period.toString() : "";
        this.$emit("update:period", period);
      }
    },
    periodModeLocal: {
      get() {
        return this.periodMode;
      },
      set(newValue) {
        this.$emit("update:periodMode", newValue);
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
    dailyValue() {
      switch (this.periodModeLocal) {
        case "EVERY_DAY":
          return `1/${this.periodLocal}`;
        case "ODD_DAYS":
          return "1-31/2";
        case "EVEN_DAYS":
          return "2-30/2";
        case "SPECIFIC_DAYS":
          return this.selectedDaysComp && this.selectedDaysComp.length
            ? `${this.selectedDaysComp}`
            : "";
        default:
          return "1/1";
      }
    },
    textWhenScheduled() {
      let text = "";
      switch (this.periodModeLocal) {
        case "EVERY_DAY":
          text = `Every <span class="bold-text">${getOrdinalFor(
            this.periodLocal,
            true
          )}</span> day`;
          break;
        case "ODD_DAYS":
          text = 'Every <span class="bold-text">odd</span> days';
          break;
        case "EVEN_DAYS":
          text = 'Every <span class="bold-text">even</span> days';
          break;
        default:
          text = "";
          break;
      }
      this.previewTextsLocal.reccuring = text;
      return text;
    },
    validationPeriod() {
      return _.get(
        this.$v,
        "validationCopyScheduleEventData.daily.period.$invalid",
        false
      );
    }
  },
  methods: {
    cronExpression() {
      return this.dailyValue; //generateCrons(this.runAtTime, `${this.dailyValue} * ? *`);
    }
  },
  watch: {
    runAtTime() {
      this.$emit("input", this.cronExpression());
    },
    dailyValue() {
      this.$emit("input", this.cronExpression());
      this.$emit("change-saved-accordion-num-item", this.index);
    }
  },
  mixins: [savedState],
  components: { DaysPicker }
};
</script>

<style lang="scss">
.daily-scope {
  .daily {
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
    .cron-gen__error {
      color: #f95d5d;
    }
  }
}
</style>

