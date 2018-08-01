<template>
<div
    class="times__wr"
>
    <div
    :style="{background: lighter ? convertColor(color, '0.3') : color}"
    class="times"
    >
    <div
        class="ctimes__item"
        v-for="(time, index) in items"
        :key="`${time}${index}`"
    >
        {{time}}
    </div>
    </div>
</div>
</template>

<script>
/* eslint-disable */
import hex2rgb from '../../helpers/convertColor.js';
/* eslint-enable */

export default {
  props: {
    lighter: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    convertColor(color, transparency) {
      return hex2rgb(color, transparency);
    },
  },
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
    box-shadow: rgba(0, 0, 0, 0.3) 0 2px 10px;
    border-top-right-radius: 2px;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  &__item {
    height: 20px;
  }
}
</style>

