<template>
  <div>
    <!-- <validation-step :invalid="invalid"> -->
    <schedule-editor :schema.sync="schema"></schedule-editor>
    <!-- </validation-step> -->
  </div>
</template>
<script>
// import ScheduleEvent from "./External/Schedule/src/editor/ScheduleEvent/ScheduleEvent.vue";
import Vue from "vue";
import ScheduleEditor, {
  data as schemaData
} from "./External/Schedule/src/editor/editor.vue";
export default {
  data() {
    return {
      schema: JSON.parse(Vue.localStorage.get("schema")) || schemaData(),
      invalid: false
    };
  },
  created() {
    // console.log('this.schema', this.schema);
  },
  watch: {
    schema: {
      handler(newSchema) {
        Vue.localStorage.set("schema", JSON.stringify(newSchema));
      },
      deep: true
    }
  },
  methods: {
    stepValidation(newValue) {
      this.invalid = newValue.$invalid;
    }
  },
  components: { ScheduleEditor }
};
</script>
