import {storiesOf} from '@storybook/vue';
import stepEditor, {meta as editorMeta, data as schemaData} from './src/editor/editor.vue';
import stepInput from './src/input/input.vue';
import BaseStory from '../../.storybook/BaseStory';

const template = {
    renderCondition   : '',
    scheduleEvents    : [],
    isRunAtActivation : false,
    inputs            : [],
    miltipleLegs      : true,
    isNew             : false
    // readonly          : false
};

storiesOf('Schedule', module).add('Design Tab', () => ({
    mixins : [BaseStory],
    data () {
        return {
            template,
            editorMeta,
            stepInput,
            stepEditor,
            persistSchema : true
        };
    }
}));
