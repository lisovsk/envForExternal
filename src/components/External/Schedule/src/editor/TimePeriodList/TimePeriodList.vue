<template>
  <div class="time-period-list">
    <or-list
      class="list-time"
      drag-handle-right
      v-model="timesLocal"
      add-button-label="Add Time"
      :new-item-method="listNewItemTime"
      :can-remove-last-item="false"
      :can-drag-items="false"
      :max-items-count="$v.validationCopyScheduleEventData.times.$invalid ? times.length: 99"
    >
      <template scope="item">
        <time-period-item
          :$v="$v"
          :index="item.index"
          :readonly="readonly"
          :start.sync="item.item.start"
          :endTime.sync="item.item.endTime"
          :every.sync="item.item.every"
          :end.sync="item.item.end"
        ></time-period-item>
      </template>
    </or-list>
  </div>
</template>

<script>
import uuid from "uuid";

import TimePeriodItem from "../TimePeriodItem/TimePeriodItem.vue";

export default {
  data() {
    return { timesLocal: this.times };
  },
  props: {
    times: {
      type: Array,
      default() {
        return [];
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    $v: null
  },
  methods: {
    listNewItemTime() {
      return {
        start: {
          HH: "00",
          mm: "00"
        },
        end: {
          HH: "00",
          mm: "00"
        },
        every: {
          val: 10,
          units: "mm"
        },
        endTime: false,
        vforkey: uuid.v4()
      };
    }
  },
  watch: {
    timesLocal: {
      handler(newTimesLocal) {
        this.$emit("update:times", newTimesLocal);
      },
      deep: true
    }
  },
  components: {
    TimePeriodItem
  }
};
</script>

<style lang="scss" scoped>
.time-period-list {
  margin-top: -12px;
}
</style>
