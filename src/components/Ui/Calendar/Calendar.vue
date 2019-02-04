<template>
  <div class="Calendar">
    <!-- {{highlightedDates}} -->
    <div class="nav">
      <div>
        <span class="nav__interval">{{state === 'month' ? `${monthComp}, ${interval.year}` : year}}</span>
        <label class="select__wr" v-if="!hideTimeZone">
          <span class="select__label">Timezone</span>
          <or-select
            placeholder="Select a time zone"
            class="select"
            :has-search="true"
            v-model="timeZoneCalendar"
            :options="getRegions"
          ></or-select>
        </label>
      </div>
      <div class="nav__wr-right">
        <span class="nav__month" :class="{active: state === 'month'}" @click="doStateMonth">Month</span>
        <span class="nav__year" :class="{active: state === 'year'}" @click="doStateYear">Year</span>
        <div class="nav__wr-arrows">
          <span @click="back">
            <or-icon class="nav__forward" icon="keyboard_arrow_left"></or-icon>
          </span>
          <span @click="moveToCurrent">Current</span>
          <span @click="forward">
            <or-icon class="nav__forward" icon="keyboard_arrow_right"></or-icon>
          </span>
        </div>
      </div>
    </div>
    <div :class="{'disabled-calendar': !editable}">
      <one-month-calendar
        :year="year"
        :month="month"
        v-model="interval"
        v-show="state === 'month'"
        @selected-date="selectDateHandler"
        :highlighted-dates="highlightedDates"
        :editable="editable"
      ></one-month-calendar>
      <one-year-calendar
        :year="year"
        v-show="state === 'year'"
        @selected-date="selectDateHandler"
        :highlighted-dates="highlightedDates"
        :editable="editable"
      ></one-year-calendar>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import OneMonthCalendar from "./OneMonthCalendar.vue";
import OneYearCalendar from "./OneYearCalendar.vue";
import getScheduledDays from "./getScheduledDaysMixin.js";
import getRegions from "../../helpers/getRegions.js";

export default {
  data() {
    return {
      interval: {},
      state: "month",
      year: parseInt(this.startYear, 10),
      month: parseInt(this.startMonth, 10),
      timeZoneCalendar: moment.tz.guess()
      // selectedDate: { day: null, month: null, year: null },
    };
  },
  props: {
    hideTimeZone: {
      default: false,
      type: Boolean
    },
    startYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    startMonth: {
      type: Number,
      default: new Date().getMonth() + 1
    },
    selectedDays: {
      type: Array,
      default() {
        return [];
      }
    },
    editable: {
      default: true,
      type: Boolean
    }
  },
  components: { OneMonthCalendar, OneYearCalendar },
  watch: {
    timeZoneCalendar(newTineZone) {
      this.$emit("changed-calendar-time-zone", newTineZone);
    }
  },
  methods: {
    forward() {
      switch (this.state) {
        case "year":
          this.year += 1;
          this.month = 1;
          break;
        case "month":
          if (this.month === 12) {
            this.month = 1;
            this.year += 1;
          } else {
            this.month += 1;
          }

          break;

        default:
          break;
      }
    },
    back() {
      switch (this.state) {
        case "year":
          this.year -= 1;
          this.month = 1;
          break;
        case "month":
          if (this.month === 1) {
            this.month = 12;
            this.year -= 1;
          } else {
            this.month -= 1;
          }

          break;

        default:
          break;
      }
    },
    doStateMonth() {
      this.state = "month";
    },
    doStateYear() {
      this.state = "year";
    },
    selectDateHandler(day, month, year) {
      this.$emit("selected-date", day, month, year);
    },
    moveToCurrent() {
      this.month = new Date().getMonth() + 1;
      this.year = new Date().getFullYear();
    }
  },
  computed: {
    monthComp() {
      return moment(this.month, "MM").format("MMMM");
    },
    getRegions() {
      return getRegions();
    }
  },

  mixins: [getScheduledDays]
};
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav__forward,
.nav__back {
}

.nav__back {
}

.nav__forward {
}

.nav__month .nav__year {
  color: rgba(15, 35, 46, 0.55);
  font-size: 14px;
  line-height: 16px;
}

.nav__month.active,
.nav__year.active {
  color: #0f232e;
  font-weight: bold;
  cursor: pointer;
}

.nav__wr-right {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nav__month {
  margin-right: 43px;
}

.nav__year {
  margin-right: 40px;
}

.nav__interval {
  color: #000;
  font-size: 17px;
  font-weight: bold;
  line-height: 23px;
}

.select {
  min-width: 180px;
  &__label {
    color: #91969d;
    font-size: 12px;
    line-height: 16px;
  }
  &.ui-select.ui-select--type-basic.ui-select--icon-position-left {
    display: inherit;
  }
  &__wr {
    height: 22px;
    padding-left: 16px;
  }
}
</style>

<style lang="scss">
.Calendar {
  .ui-select .ui-select__content .ui-select__label .ui-select__display {
    min-height: 32px;
  }
}
</style>

