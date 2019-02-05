<template>
  <div class="schedule-wrapper">
    <div class="wrapper">
      <editor class="disabled" :schema.sync="defaultStep.data"></editor>
    </div>
  </div>
</template>

<script>
import editor from "../editor/editor.vue";
let componentBase = () => {
  let component = null;

  try {
    component = require("@default/src/inputs/_design_base.vue");

    return require("@default/src/inputs/_design_base.vue").default;
  } catch (error) {
    return require("./../../src/../../../helpers/InputBaseMock.vue").default;
  }
};

export default {
  extends: componentBase(),
  name: "Input",
  data() {
    return {
      defaultStep: {
        data: {}
      }
    };
  },
  components: {
    editor
  },

  defaultValue() {
    return _.cloneDeep(data);
  }
};

export const label = "Schedule v0.5.0";
export const data = {
  scheduleEvents: []
};

export const meta = {
  name: "schedule-component",
  type: "onereach-studio-form-input",
  version: "0.5.0"
};
</script>

<style lang="postcss" scoped>
.disabled {
  pointer-events: none;
}
</style>
