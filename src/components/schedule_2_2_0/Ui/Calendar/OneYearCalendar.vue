<template>
  <div>
    <div class="months">
      <one-month-calendar
        v-for="month in months"
        :key="month"
        :year="year"
        :month="month"
        :years-calendar="true"
        :highlighted-dates="highlightedDates"
        :editable="editable"
        :timeZoneCalendar="timeZoneCalendar"
        not-show-selected-on-prev-next-days
        class="calendar_years"
        @selected-date="selectDateHandler"
        @go-to-month-calendar="goToMonthCalendar"
      ></one-month-calendar>
    </div>
  </div>
</template>

<script>
import OneMonthCalendar from "./OneMonthCalendar.vue";

export default {
  data() {
    return {
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    };
  },

  props: {
    year: {
      type: Number,
      default: new Date().getFullYear()
    },
    highlightedDates: {
      type: Object,
      default() {
        return {};
      }
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

  methods: {
    selectDateHandler(day, month, year) {
      this.$emit("selected-date", day, month, year);
    },
    goToMonthCalendar(month) {
      this.$emit("go-to-month-calendar", month);
    }
  },

  components: { OneMonthCalendar }
};
</script>

<style>
.months {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  min-height: 1350px;
  grid-row-gap: 1px;
  grid-column-gap: 1px;
  background-color: #dfdfdf;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
}

.calendar_years {
  background-color: #fafafa;
}

.calendar_years .calendar__item_event {
  line-height: 30px;
}

.calendar_years .calendar__items_title {
  padding-bottom: 10px;
}

.calendar_years .calendar__items:not(.calendar__items_title) {
  background-color: inherit;
}

.calendar_years .calendar__items:not(:last-child) {
  border-bottom: none;
}

.calendar_years .calendar__items {
  line-height: normal;
}

.calendar_years .calendar__item:not(:last-child) {
  border-right: none;
}

.calendar_years .calendar__item {
  font-size: 11.18px;
  /* background: red;
  border-radius: 50%; */
}

.calendar_years .calendar__item_title {
  font-size: 0;
}

.calendar_years .calendar__item_title::first-letter {
  font-size: 12px;
}

.calendar_years .calendar {
  border: none;
  padding: 20px 25px 38px;
  grid-template-rows: 35px;
}
</style>
