<template>
  <div class="times__wr">
    <div
      :style="{background: lighter ? convertColor(color, '0.3') : color, opacity: opacity}"
      class="times"
      v-if="items.length"
    >
      <div
        class="times__item"
        v-for="(time, index) in items"
        :key="`${time}${index}`"
        v-if="index < 10"
      >{{time}}</div>
      <div class="times__item times__item_ellipsis" v-if="items.length > 10">...</div>
    </div>
  </div>
</template>

<script>
import hex2rgb from "../../helpers/convertColor.js";

export default {
  props: {
    lighter: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      default: () => []
    },
    opacity: {
      type: Number,
      default: 1
    }
  },
  methods: {
    convertColor(color, transparency) {
      return hex2rgb(color, transparency);
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

