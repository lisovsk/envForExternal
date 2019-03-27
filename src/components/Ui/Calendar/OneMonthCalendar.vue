<template>
  <div class="wr-calendar">
    <div class="calendar">
      <div class="calendar__items" v-if="yearsCalendar">
        <div class="calendar__item">
          <div>
            <span class="calendar__title">{{monthNames[month - 1]}} {{year}}</span>
          </div>
        </div>
      </div>
      <div class="calendar__items calendar__items_title">
        <div class="calendar__item_title">
          <span>Sun</span>
        </div>
        <div class="calendar__item_title">
          <span>Mon</span>
        </div>
        <div class="calendar__item_title">
          <span>Tue</span>
        </div>
        <div class="calendar__item_title">
          <span>Wed</span>
        </div>
        <div class="calendar__item_title">
          <span>Thu</span>
        </div>
        <div class="calendar__item_title">
          <span>Fri</span>
        </div>
        <div class="calendar__item_title">
          <span>Sat</span>
        </div>
      </div>
      <div
        class="calendar__items"
        v-for="(monthDays, index) in highlightedCurrDays"
        :key="index"
        v-if="dPrevDays.length || monthDays.length || dNextDays.length"
      >
        <template v-if="!index">
          <calendar-item
            v-for="(dayValue, dayKey) in highlightedPreviousMonthDays"
            prev-days
            :day-value="dayValue"
            :day-key="dayKey"
            :key="dayKey"
            :editable="editable"
            :month="month"
            :year="year"
            :years-calendar="yearsCalendar"
            :timeZoneCalendar="timeZoneCalendar"
            @selected-date="sendChosenDate"
          ></calendar-item>
        </template>

        <calendar-item
          v-for="(dayValue, dayKey) in monthDays"
          :day-value="dayValue"
          :day-key="dayKey"
          :key="dayKey"
          :editable="editable"
          :month="month"
          :year="year"
          :years-calendar="yearsCalendar"
          :timeZoneCalendar="timeZoneCalendar"
          @selected-date="sendChosenDate"
        ></calendar-item>

        <template v-if="index === currDays.length - 1">
          <calendar-item
            v-for="(dayValue, dayKey) in highlightedDNextDays"
            next-days
            :day-value="dayValue"
            :day-key="dayKey"
            :key="dayKey"
            :editable="editable"
            :month="month"
            :year="year"
            :years-calendar="yearsCalendar"
            :timeZoneCalendar="timeZoneCalendar"
            @selected-date="sendChosenDate"
          ></calendar-item>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import Times from "./Times.vue";
import hex2rgb from "../../helpers/convertColor.js";
import CalendarItem from "./CalendarItem.vue";

export default {
  beforeUpdate() {
    this.mon = this.month - 1;
  },
  data() {
    return {
      radius: 15,
      mon: this.month - 1,
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    };
  },
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear()
    },
    month: {
      type: Number,
      default: new Date().getMonth() + 1
    },
    yearsCalendar: {
      type: Boolean,
      default: false
    },
    highlightedDates: {
      type: Object,
      default() {
        return {};
      }
    },
    notShowSelectedOnPrevNextDays: {
      type: Boolean,
      default: false
    },
    editable: {
      default: true,
      type: Boolean
    },
    timeZoneCalendar: {
      type: String,
      default: ""
    }
  },
  computed: {
    dPrevDays() {
      const d = new Date(this.year, this.mon);
      const dPrev = new Date(this.year, this.mon);
      dPrev.setDate(dPrev.getDate() - this.getDay(d));
      const data = [];
      for (let i = 0; i < this.getDay(d); i += 1) {
        data.push(dPrev.getDate());
        dPrev.setDate(dPrev.getDate() + 1);
      }
      return data;
    },
    currDays() {
      const d = new Date(this.year, this.mon);
      const data = [];
      data[0] = [];
      while (d.getMonth() === this.mon) {
        data[data.length - 1].push(d.getDate());

        if (this.getDay(d) % 7 === 6) {
          data[data.length] = [];
        }

        d.setDate(d.getDate() + 1);
      }
      return data;
    },
    dNextDays() {
      const data = [];
      const d = new Date(this.year, this.month);
      for (let i = this.getDay(d); i < 7; i += 1) {
        data.push(d.getDate());
        d.setDate(d.getDate() + 1);
      }
      return data;
    },
    interval() {
      const currDaysLast = this.currDays[this.dNextDays.length - 1];
      const start = this.dPrevDays.length
        ? `${this.dPrevDays[0]} ${
            this.monthNames[this.month === 1 ? 11 : this.month - 2]
          }`
        : `${this.currDays[0][0]} ${this.monthNames[this.month - 1]}`;
      const end = this.dNextDays.length
        ? `${this.dNextDays[this.dNextDays.length - 1]} ${
            this.monthNames[this.month === 12 ? 0 : this.month]
          }`
        : `${currDaysLast[currDaysLast.length - 1]} ${
            this.monthNames[this.month - 1]
          }`;
      this.$emit("input", {
        start,
        end,
        year: this.year
      });
      return {
        start,
        end,
        year: this.year
      };
    },
    highlightedPreviousMonthDays() {
      if (this.dPrevDays) {
        return this.dPrevDays.reduce((accumulator, currentValue) => {
          const resLocal = accumulator;
          resLocal[currentValue] = this.isHighlightedItem(
            { day: currentValue, month: this.month, year: this.year },
            "prevMonth"
          );
          return resLocal;
        }, {});
      }
      return null;
    },
    highlightedCurrDays() {
      if (this.currDays) {
        return this.currDays.map(item =>
          item.reduce((accumulator, currentValue) => {
            const resLocal = accumulator;
            resLocal[currentValue] = this.isHighlightedItem({
              day: currentValue,
              month: this.month,
              year: this.year
            });
            return resLocal;
          }, {})
        );
      }
      return null;
    },
    highlightedDNextDays() {
      if (this.dNextDays) {
        return this.dNextDays.reduce((accumulator, currentValue) => {
          const resLocal = accumulator;
          resLocal[currentValue] = this.isHighlightedItem(
            { day: currentValue, month: this.month, year: this.year },
            "nextMonth"
          );
          return resLocal;
        }, {});
      }
      return null;
    }
  },
  methods: {
    getDay(date) {
      return date.getDay();
    },
    sendChosenDate(day, month, year) {
      this.$emit("selected-date", day, month, year);
    },

    isHighlightedItem(date, nexOrPrevMonthFlag) {
      let month = date.month;
      let year = date.year;
      let res = {};

      if (nexOrPrevMonthFlag === "nextMonth") {
        month += 1;
        if (month === 13) {
          month = 1;
          year += 1;
        }
      } else if (nexOrPrevMonthFlag === "prevMonth") {
        month -= 1;
        if (month === 0) {
          month = 12;
          year -= 1;
        }
      }
      _.forIn(this.highlightedDates, (value, key) => {
        if (key === `${year}-${month}-${date.day}`) {
          res = value;
        }
      });
      return res;
    }
  },
  components: {
    Times,
    CalendarItem
  },
  watch: {
    interval: {
      handler(newInterval) {
        this.$emit("input", newInterval);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.wr-calendar {
  position: relative;
  width: 100%;
}

.wr-calendar:before {
  content: "";
  display: block;
  padding-top: 75%;
}

.calendar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
  display: grid;
  grid-template-rows: 30px;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
}

.wr-calendar:not(.calendar_years) .calendar {
  min-height: 820px;
}

.calendar__title {
  white-space: nowrap;
  width: 11px;
  color: #0f232e;
  font-size: 14px;
  font-weight: bold;
  line-height: 16px;
  padding-bottom: 20px;
  display: inline-block;
}

.calendar__items {
  display: grid;
  vertical-align: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  line-height: 30px;
}

.calendar__items:not(.calendar__items_title) {
  background-color: #fafafa;
}

.calendar__items_title {
  color: rgba(94, 101, 109, 0.55);
  font-size: 14px;
  font-weight: bold;
}

.calendar__items:not(:last-child) {
  border-bottom: 1px solid #dfdfdf;
}

.calendar__item:not(:last-child) {
  border-right: 1px solid #dfdfdf;
}
</style>
