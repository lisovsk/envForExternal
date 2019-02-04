import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';

import Accordion from './Accordion.vue';
storiesOf('Accordion', module).add('Base accordion', () => ({
  data() {
    return {
      items: [
        {
          title: 'sdfsd'
        }
      ]
    };
  },
  methods: {},
  components: {
    Accordion
  },
  template: `
    <div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <accordion>
            <template  slot="item1">
                <div placeholderItem="Set recurring daily"  titleItem="Daily">
                    content1
                </div>
            </template>
            <template slot="item2">
                <div placeholderItem="Set recurring daily" titleItem="Weekly">
                    content2
                </div>
            </template>
            <template slot="item3">
                <div placeholderItem="Set recurring daily" titleItem="Monthly">
                    content3
                </div>
            </template>
            <template slot="item4">
                <div placeholderItem="Set recurring daily" titleItem="Yearly">
                    content4
                </div>
            </template>
        </accordion>
    </div>
  `
}));
