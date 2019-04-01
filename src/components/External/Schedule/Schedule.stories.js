import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import ValidationStep from '../../helpers/Validation.vue';
import stepEditor, { data as schemaData } from './src/editor/editor.vue';
import stepInput from './src/input/input.vue';
import MixinForBase from '../../../../.storybook/MixinForBase';

storiesOf('Schedule', module).add('Base', () => ({
  data() {
    return {
      schema: JSON.parse(Vue.localStorage.get('schema')) || {
        ...schemaData(),
        isRunAtActivation: false,
        exits: [],
        multipleLegs: false
      }
    };
  },
  components: { stepEditor, stepInput, ValidationStep },
  mixins: [MixinForBase],
  template: `<div>
  <or-tabs type="text" class="flex" fullwidth>
    <or-tab title="Editor">
        <div style="margin-bottom:30px;">
          <or-checkbox 
            v-model="readonly"
          >Readonly</or-checkbox>
        </div>
      <or-switch
        label="Run flow at activation"
        v-model="schema.isRunAtActivation"
      ></or-switch>
      <step-editor
        :readonly="readonly"
        :schema.sync="schema"
        @step-validation="stepValidation"
      ></step-editor>
    </or-tab>
    <or-tab title="Input">
      <step-input></step-input>
    </or-tab>
  </or-tabs>
</div>`
}));
