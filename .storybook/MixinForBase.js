import TemplateForBase from './TemplateForBase';
import Vue from 'vue';

export default {
  data() {
    return {
      invalid: false,
      readonly: JSON.parse(Vue.localStorage.get('readonly')) || false
    };
  },
  watch: {
    schema: {
      handler(newSchema) {
        Vue.localStorage.set('schema', JSON.stringify(newSchema));
      },
      deep: true
    },
    readonly(newReadonly) {
      Vue.localStorage.set('readonly', JSON.stringify(newReadonly));
    }
  },
  methods: {
    stepValidation(newValue) {
      this.invalid = newValue.$invalid;
    }
  },

  template: TemplateForBase
};
