import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import ValidationStep from '../../helpers/Validation.vue';
import stepEditor, { data as schemaData } from './src/editor/editor.vue';
import stepInput from './src/input/input.vue';
import MixinForBase from '../../../../.storybook/MixinForBase';

storiesOf('condition-builder_v0-6-0', module).add('Base', () => ({
  data() {
    return {
      schema: JSON.parse(Vue.localStorage.get('schema')) || schemaData(),
      defaultStep: {
        data: {}
      },
      data: {
        isSingleExit: null,
        conditionRuleHasDataOut: false,
        hasNoConditionDataOut: null
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
      <step-editor
        :readonly="readonly"
        :schema.sync="schema"
        :template="data"
        :step="defaultStep"
        :steps="[defaultStep]"
      ></step-editor>
    </or-tab>
    <or-tab title="Input">
      <step-input></step-input>
    </or-tab>
  </or-tabs>
  </div>
  `
}));
