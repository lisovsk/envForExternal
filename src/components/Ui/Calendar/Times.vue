<template>
  <div class="times__wr">
    <div
      :style="{background: lighter ? convertColor(color, '0.3') : color, opacity: opacity}"
      class="times"
      v-if="timeLounches.length"
    >
      <div
        class="times__item"
        v-for="(time, index) in timeLounches"
        :key="`${time}${index}`"
        v-if="index < lengthOfShownElements"
      >{{time}}</div>
      <div
        class="times__item times__item_ellipsis"
        v-if="timeLounches.length > lengthOfShownElements"
      >...</div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import hex2rgb from "../../helpers/convertColor.js";
import { getTimeLounchesFomCrons } from "./helpers/getLounchesFomCrons.js";
import sortTime from "./../../helpers/sortTime.js";

export default {
  data() {
    return {
      lounches: [],
      lengthOfShownElements: 10
    };
  },
  props: {
    countLaunches: {
      type: Boolean,
      default: false
    },
    expressions: {
      type: Array,
      default: () => []
    },
    timeZoneFrom: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    },
    lighter: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ""
    },
    extremeTimes: {
      type: Array,
      default: () => []
    },
    opacity: {
      type: Number,
      default: 1
    },
    timeZoneCalendar: {
      type: String,
      default: ""
    }
  },
  computed: {
    timeLounches() {
      if (this.lounches === 0) return null;
      else {
        return this.lounches.reduce((result, item) => {
          return sortTime(
            result.concat(item.map(date => date.format("HH:mm")))
          );
        }, []);
      }
    }
  },
  methods: {
    convertColor(color, transparency) {
      return hex2rgb(color, transparency);
    },
    getLounches() {
      return getTimeLounchesFomCrons(
        this.expressions,
        moment(`${this.date} 00:00:00`).format("YYYY-MM-DD HH:mm:ss"),
        moment(`${this.date} 23:59:59`).format("YYYY-MM-DD HH:mm:ss"),
        this.timeZoneFrom,
        this.timeZoneCalendar
      );
    }
  },

  watch: {
    countLaunches(newCountLaunches) {
      this.lounches = this.getLounches();
    }
  }
};
</script>


<style lang="scss" scoped>
.times {
  padding: 2px 10px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;

  &__wr {
    position: absolute;
    left: 100%;
    top: 0;
    background: #fff;
    border-top-right-radius: 2px;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  &__item {
    height: 20px;

    &_ellipsis {
      text-align: center;
      line-height: 12px;
    }
  }
}
</style>

<style lang="scss">
.calendar__event:hover {
  .times__wr {
    box-shadow: rgba(0, 0, 0, 0.3) 0 2px 10px;
  }
}
</style>

