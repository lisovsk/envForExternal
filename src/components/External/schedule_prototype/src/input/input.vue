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

<style lang="scss" scoped>
.disabled {
  pointer-events: none;
}
</style>
