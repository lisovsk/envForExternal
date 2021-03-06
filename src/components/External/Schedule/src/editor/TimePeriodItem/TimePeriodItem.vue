<template>
  <div class="time-period-item-scope">
    <div class="wr-time-item">
      <div class="wr-configs-every">
        <div class="configs-time__wr">
          <div class="configs-time">
            <or-icon class="configs-time__icon" icon="query_builder"></or-icon>
            <or-timepicker
              v-model="localStart"
              :class="[{ readony: readonly, 'timepicker-error': timepickerStartError()}]"
              format="HH:mm"
              hideClearButton
              @close-dropdown="touchStartTime"
            ></or-timepicker>
          </div>
          <span class="configs-time__from-to" v-if="endTime">To</span>
          <div class="configs-time" v-if="localEndTime">
            <or-icon class="configs-time__icon" icon="query_builder"></or-icon>
            <div class="time-item__wr-end-time">
              <or-timepicker
                v-model="localEnd"
                :class="[{ readony: readonly, 'timepicker-error': timepickerEndError()}]"
                format="HH:mm"
                hideClearButton
              ></or-timepicker>
              <span @click="cancelEndTime">
                <or-icon class="time-item__cancel-end-time" icon="close"></or-icon>
              </span>
            </div>
          </div>
        </div>
        <div v-if="localEndTime" class="every">
          <span>every</span>
          <or-textbox
            label
            placeholder="00"
            class="xs-input"
            :invalid="timepickerEveryValError()"
            :disabled="readonly"
            v-model="localEvery.val"
            mask="##########"
            @change="touchEveryTime"
          ></or-textbox>
          <or-select
            label
            :disabled="readonly"
            class="dimention-selector"
            :options="[{value:'hh', label:'hr'}, {value:'mm', label:'min'}]"
            v-model="localEvery.units"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M6.984 9.984h10.03L12 15z"></path>
            </svg>
          </or-select>
        </div>
      </div>
      <span
        class="configs-time__end-time"
        v-if="!localEndTime"
        @click="localEndTime=!localEndTime"
      >+ End Time</span>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  props: {
    start: {
      type: Object,
      default() {
        return {
          HH: "00",
          mm: "00"
        };
      }
    },

    end: {
      type: Object,
      default() {
        return {
          HH: "00",
          mm: "00"
        };
      }
    },

    endTime: {
      type: Boolean,
      default: false
    },

    every: {
      type: Object,
      default() {
        return {
          val: "",
          units: ""
        };
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    $v: null,
    index: null
  },
  data() {
    return {};
  },
  computed: {
    localStart: {
      get() {
        return this.start;
      },
      set(newStart) {
        this.$emit("update:start", newStart);
      }
    },
    localEnd: {
      get() {
        return this.end;
      },
      set(newEnd) {
        this.$emit("update:end", newEnd);
      }
    },
    localEvery: {
      get() {
        return this.every;
      },
      set(newEvery) {
        this.$emit("update:every", newEvery);
      }
    },
    localEndTime: {
      get() {
        return this.endTime;
      },
      set(newEndTime) {
        this.$emit("update:endTime", newEndTime);
      }
    }
  },
  methods: {
    touchStartTime() {
      const touch = _.get(
        this.$v,
        `validationCopyScheduleEventData.times.$each[${this.index}].start`
      );
      if (touch) {
        touch.$touch();
      }
    },
    touchEndTime() {
      const touch = _.get(
        this.$v,
        `validationCopyScheduleEventData.times.$each[${this.index}].end`
      );
      if (touch) {
        touch.$touch();
      }
    },
    touchEveryTime() {
      const touch = _.get(
        this.$v,
        `validationCopyScheduleEventData.times.$each[${this.index}].every`
      );
      if (touch) {
        touch.$touch();
      }
    },
    timepickerStartError() {
      const item = _.get(
        this.$v,
        `validationCopyScheduleEventData.times.$each[${this.index}].start`
      );
      return item && item.$invalid && item.$dirty;
    },
    timepickerEndError() {
      const item = _.get(
        this.$v,
        `validationCopyScheduleEventData.times.$each[${this.index}].end`
      );

      return item && item.$invalid && item.$dirty;
    },
    timepickerEveryValError() {
      const item = _.get(
        this.$v,
        `validationCopyScheduleEventData.times.$each[${this.index}].every`
      );
      return item && item.$invalid && item.$dirty;
    },
    cancelEndTime() {
      this.$emit("update:endTime", false);
      this.$emit("update:every", {
        val: "10",
        units: "mm"
      });
      this.$emit("update:end", {
        HH: "00",
        mm: "00"
      });
    }
  }
};
</script>

<style lang="scss">
.time-period-item-scope {
  .wr-time-item {
    display: flex;
    align-items: center;
    .ui-checkbox {
      margin-bottom: 0;
    }

    .wr-configs-every {
      display: flex;
    }

    .wr-start-date {
      display: flex;
      align-items: center;
    }

    .configs-time {
      position: relative;
      width: 110px;
      height: 30.8px;
      &__date {
        width: 140px;
      }
      &_with-conf {
        margin-bottom: 2px;
      }
      &__with-conf {
        display: flex;
        align-items: center;
      }

      &__icon {
        position: absolute;
        z-index: 1;
        font-size: 12px;
        color: #e1e1e1;
        top: 50%;
        margin-top: -6px;
        left: 8px;
      }

      &__from-to {
        padding: 0 20px;
      }

      &__end-time {
        cursor: pointer;
        padding-left: 20px;
        padding-right: 3px;
      }

      span.time-picker input.display-time {
        padding-left: 35px;
        width: 110px;
      }

      .dropdown {
        width: 110px;
      }

      &__wr {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .every {
      display: flex;
      align-items: center;
      padding-left: 22px;

      &__icon {
        margin-left: 0;
      }

      .ui-select {
      }
      .ui-select__label-text {
        display: inline-block;
        float: right;
      }

      .ui-select__display {
        padding: 0;
        display: inline-block;
        width: auto;
        line-height: 35px;
        width: 25px;
      }

      .ui-select__label-text svg {
        display: inline-block;
        margin-top: 10px;
        height: 15px;
        width: 15px;
      }

      .xs-input {
        width: 35px;
        margin: 0 3px 0 8px;
      }

      .ui-select__content {
        height: 35px;
        width: 40px;
        cursor: pointer;
      }
    }

    .timepicker span.or-timepicker.time-picker {
      width: 110px;
    }

    .dimention-selector {
      &.ui-select {
        margin-bottom: 0;
        .ui-select__display {
          border: none;
          font-size: 14px;
          text-align: left;
          color: #0f232e;
          min-height: auto;
          padding: 0 5px;
          height: 24px;
          background: transparent;
          &:hover {
            color: #4b99c1;
          }
          .ui-icon {
            display: none;
          }
        }
        .ui-select__dropdown {
          width: 60px;
          min-width: 60px;
          padding: 0;
          .is-highlighted {
            color: #000000;
            background-color: #f9f9f9;
          }
          .is-selected {
            color: #64b2da;
          }
        }
        &.is-disabled {
          .ui-select__display {
            color: rgb(94, 101, 109);
          }
          .ui-select__display-value {
            color: rgb(94, 101, 109);
            opacity: 1;
          }
        }
      }
    }

    .text-box-error {
      .ui-textbox__content {
        .ui-textbox__label {
          input {
            border: 1px solid rgba(244, 67, 5, 0.46);
          }
        }
      }

      .ui-datepicker__display {
        border: 1px solid rgba(244, 67, 5, 0.46) !important;
      }
    }
    .ui-select__label {
      margin-left: 2px;
    }
  }

  .ui-textbox__input {
    min-width: 40px;
  }

  .timepicker-error.time-picker input.display-time {
    border: 1px #f95d5d solid;
  }

  .time-item__cancel-end-time {
    font-size: 12px;
    color: #e1e1e1;
    cursor: pointer;
  }

  .time-item__wr-end-time {
    display: flex;
    align-items: center;
  }
}
</style>

