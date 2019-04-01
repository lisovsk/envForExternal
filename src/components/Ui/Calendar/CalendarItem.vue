<template>
  <div
    class="calendar__item"
    :class="{'calendar__item_not-edit': !editable, 'calendar__item_not-curr': !currentMonthDays}"
    @click="sendChosenDate(dayKey, month, year)"
  >
    <div>
      <span
        class="calendar__item_event calendar__item_event-recurring"
        :class="{'calendar__item_event-actice': 0}"
      >
        <div v-if="dayValue.length" class="calendar__events-names">
          <div>
            <span
              class="calendar__event"
              :key="value.color"
              v-for="(value, key) in dayValue"
              :style="{color : value.lighter ? '#0F232E' : ''}"
            >
              <span
                class="calendar__event-background"
                :style="{background: currentMonthDays ? value.color : convertColor(value.color, 0.5), opacity : value.lighter ? '0.3' : ''}"
                v-if="howPrevMonthItem(key, dayValue.length)"
              ></span>
              <span
                @mouseover="startCountLaunches"
                class="calendar__event-text"
                :style="{opacity : value.lighter && !currentMonthDays  ? '0.5' : ''}"
              >{{value.eventName || 'No Name'}}</span>

              <times
                :extreme-times="value.times"
                :color="value.color"
                :lighter="value.lighter"
                :opacity="!currentMonthDays ? 0.5 : 1"
                :expressions="value.expressions"
                :timeZoneFrom="value.timeZone.value"
                :timeZoneCalendar="timeZoneCalendar"
                :date="`${year}-${month}-${dayKey}`"
                :count-launches="countLaunches"
              ></times>
            </span>
          </div>
          <span
            class="calendar__event calendar__event_more"
            :style="{opacity :!currentMonthDays ? 0.5 : 1 }"
            v-if="isShowButtonMore(dayValue.length)"
          >
            <span class="calendar__event-background calendar__event-background_more"></span>
            More
          </span>
          <div
            class="calendar__event-more-items"
            :class="{'calendar__event-more-items_year': yearsCalendar}"
            v-if="isShowMoreItems(Object.keys(dayValue).length)"
          >
            <span
              class="calendar__event"
              :key="value.color"
              v-if="key >= 3"
              v-for="(value, key) in dayValue"
              :style="{color : value.lighter ? '#0F232E' : ''}"
            >
              <span
                class="calendar__event-background"
                :style="{background: currentMonthDays ? value.color : convertColor(value.color, 0.5), opacity : value.lighter ? '0.3' : ''}"
              ></span>
              <span
                @mouseover.once="startCountLaunches"
                class="calendar__event-text"
                :style="{opacity : value.lighter && !currentMonthDays  ? '0.5' : ''}"
              >{{value.eventName || 'No Name'}}</span>
              <times
                :extreme-times="value.times"
                :color="value.color"
                :lighter="value.lighter"
                :opacity="!currentMonthDays ? 0.5: 1"
                :expressions="value.expressions"
                :timeZoneFrom="value.timeZone.value"
                :timeZoneCalendar="timeZoneCalendar"
                :date="`${year}-${month}-${dayKey}`"
                :count-launches="countLaunches"
              ></times>
            </span>
          </div>
        </div>
        <div class="calendar__day-num">
          <span></span>
          <div
            class="stroke__wr"
            v-if="isShowCircle(dayValue.length)"
            :style="{opacity : !currentMonthDays ? '0.5' : ''}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="34" width="34">
              <circle
                v-for="(value, key) in dayValue"
                :key="key"
                :style="{stroke: value.lighter ? convertColor(value.color, '0.3') : value.color, 'stroke-dasharray': key !== 0 ? 
                          `${(dayValue.length - parseInt(key)) * 2 * radius * Math.PI / dayValue.length},
                          ${2 * radius * Math.PI / dayValue.length * parseInt(key)}`
                          : ''}"
                class="stroke"
                cy="17"
                cx="17"
                :r="radius"
              ></circle>
            </svg>
          </div>
          <div
            class="calendar__day-num-text"
            :style="{opacity : !currentMonthDays ? '0.5' : ''}"
          >{{dayKey}}</div>
        </div>
      </span>
    </div>
  </div>
</template>
<script>
import Times from "./Times.vue";
import hex2rgb from "../../helpers/convertColor.js";

export default {
  data() {
    return {
      radius: 15,
      countLaunches: false
    };
  },
  props: {
    prevDays: {
      type: Boolean,
      default: false
    },
    nextDays: {
      type: Boolean,
      default: false
    },
    dayValue: {
      type: [Array, Object],
      default: () => []
    },
    dayKey: {
      type: String,
      default: ""
    },
    editable: {
      default: true,
      type: Boolean
    },
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
    timeZoneCalendar: {
      type: String,
      default: ""
    }
  },
  computed: {
    currentMonthDays() {
      return !this.prevDays && !this.nextDays;
    }
  },
  methods: {
    isShowCircle(len) {
      return this.yearsCalendar && len > 0;
    },
    convertColor(color, transparency) {
      return hex2rgb(color, transparency);
    },
    isShowMoreItems(len) {
      return len > 3;
    },
    isShowButtonMore(len) {
      return !this.yearsCalendar && len > 3;
    },
    previousMonthDaysShowFirst3(key, len) {
      return key < 3 && len;
    },
    sendChosenDate(day, month, year) {
      if (!this.editable) return;

      let localMonth = month;
      if (this.prevDays) localMonth -= 1;
      else if (this.nextDays) localMonth += 1;
      let localYear = year;

      if (localMonth === 0) {
        localMonth = 12;
        localYear -= 1;
      } else if (localMonth === 13) {
        localMonth = 1;
        localYear += 1;
      }
      this.$emit("selected-date", day, localMonth, localYear);
    },
    startCountLaunches() {
      this.countLaunches = !this.countLaunches;
    },
    howPrevMonthItem(key, len) {
      return this.currentMonthDays
        ? key < 3
        : this.previousMonthDaysShowFirst3(key, len);
    }
  },
  components: { Times }
};
</script>

<style lang="scss" scoped>
.calendar__item_event {
  position: relative;

  width: 100%;
  display: block;
}

.calendar__events-names {
  position: absolute;
  color: #ffffff;
  font-size: 10px;
  line-height: 20px;
  width: calc(100% - 10px);
  left: 50%;
  top: 35px;
  transform: translateX(-50%);

  &:hover {
    z-index: 1;
  }
}

.calendar__event {
  display: block;
  margin-bottom: 4px;
  border-radius: 2px;
  text-align: left;
  padding: 0px 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  position: relative;
  z-index: 1;
  white-space: nowrap;
  min-height: 20px;
  &:hover {
    overflow: visible;
    z-index: 1;
  }

  &_more {
    color: #0f232e;
    text-align: center;
    margin-bottom: 0;
    &:hover + .calendar__event-more-items {
      opacity: 1;
    }
  }
}

.calendar__event-more-items {
  opacity: 0;
  padding-top: 4px;
  background: #fff;
  padding-bottom: 4px;
  box-shadow: rgba(0, 0, 0, 0.3) 0 2px 10px;
  width: calc(100% + 4px);
  margin-left: -2px;

  .calendar__event {
    width: calc(100% - 4px);
    margin-left: auto;
    margin-right: auto;
  }

  &.calendar__event-more-items_year {
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
}

.calendar__event-background {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  &_more {
    font-size: 10px;
    line-height: 12px;
    text-align: center;
    background-color: #dfdfdf;
  }

  // &_not-rurr {
  //   // opacity: 0.2 !important;
  // }
}

.calendar__day-num {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 15px);
  margin: auto;
}

.calendar__item {
  /* align-content: center; */
  display: grid;
  cursor: pointer;
  /* min-height: 120px; */
  &_not-edit {
    cursor: default;
  }
}

.calendar__item_not-curr {
  color: rgba(15, 35, 46, 0.55);
  background: #fff;
  position: relative;
}

.calendar__item:not(:last-child) {
  border-right: 1px solid #dfdfdf;
}

.calendar_years {
  .calendar__events-names {
    width: 100px;
    top: 34px;
    display: none;
    background: #fff;
    padding: 4px 4px 0 4px;
    z-index: 9999999;
    box-shadow: rgba(0, 0, 0, 0.3) 0 2px 10px;
  }

  .calendar__item:hover {
    .calendar__events-names {
      display: block;
    }
  }
  .calendar__event-more-items {
    padding-top: 0;
    padding-bottom: 0;
    box-shadow: none;
  }
  .calendar__item:hover {
    .calendar__events-names {
      display: block;
    }
  }

  .calendar__item_not-curr {
    &::before {
      content: none;
    }
  }

  .calendar__item_not-curr {
    background: inherit;
  }
  .stroke {
    stroke-width: 3.5;
    stroke-opacity: 1;
    fill: transparent;
    stroke: #fff;

    &__wr {
      height: 30px;
      width: 30px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -17.5px;
      margin-left: -17.75px;
    }
  }
  .calendar__day-num {
    justify-content: flex-start;
  }

  .calendar__day-num-text {
    width: 100%;
  }
}

.calendar__event-text {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
}
</style>