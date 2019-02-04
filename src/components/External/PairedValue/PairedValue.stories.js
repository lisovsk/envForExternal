import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import ValidationStep from '../../helpers/Validation.vue';
import stepEditor, { data as schemaData } from './src/editor/editor.vue';
import stepInput from './src/input/input.vue';
import MixinForBase from '../../../../.storybook/MixinForBase';

storiesOf('PairedValue', module).add('Base', () => ({
  data() {
    return {
      schema: JSON.parse(Vue.localStorage.get('schema')) || schemaData()
    };
  },
  components: { stepEditor, stepInput, ValidationStep },
  mixins: [MixinForBase]
}));
