<template>
    <div>
        <div>
            <ul class="accordion" :class="{'accordion_invalid': invalid}">
                <li class="accordion__item"  :key="index" v-for="(slot, index) in slots">
                    <div class="accordion__wr-content" @click="openItem(index)">
                        <span 
                          class="accordion__title" 
                          :class="{
                                    'active' : openedItemComp === index,
                                    'disabled': openedItemComp && openedItemComp !== index,
                                    'invalid': slotErrors[index] && openedItemComp === index
                                  }">
                            {{slot[0].data.attrs.titleItem}}
                        </span>
                        <div v-if="openedItemComp === index" class="accordion__slot">
                            <slot
                              :name="index"
                            ></slot>
                        </div>
                        <span v-if="!openedItemComp" class="accordion__placeholder">
                            {{slot[0].data.attrs.placeholderItem}}
                        </span>
                    </div>
                    <div v-if="openedItemComp === index" class="accordion__close-item" @click="deleteItem">
                        <or-icon  icon="delete_forever"></or-icon>
                    </div>
                </li>
            </ul>
        </div>
        <or-modal  :contain-focus="false" ref="deleteSettingsInAccordionItemConfirmation" title="Delete settings">
          Do you really want to delete <span class="accordion__bold">{{currentRecurringName}}</span> recurrent settings?
          <div slot="footer">
              <or-button color="red" @click="isDelete ? deleteSettingsInAccordionItemOrOpenOther() : deleteSettingsInAccordionItemOrOpenOther(true)">Delete</or-button>
              <or-button color="primary" type="secondary" @click="closeModal('deleteSettingsInAccordionItemConfirmation')">Cancel</or-button>
          </div>
        </or-modal>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      slots: this.$slots,
      indexLocal: null,
      isDelete: false,
    };
  },
  props: {
    openedItem: null,
    savedAccordionNumItem: {
      type: String,
      default: null,
    },
    slotErrors: {
      type: Object,
      default: () => [],
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
    deleteItem() {
      if (this.savedAccordionNumItem) {
        this.openModal('deleteSettingsInAccordionItemConfirmation');
        this.isDelete = true;
      } else {
        this.$emit('close-item', this.openedItemComp);
        this.openedItemComp = null;
      }
    },
    openItem(index) {
      if (this.openedItemComp === index && this.isEditable) return;

      this.$emit('touch');
      this.$emit('do-editable', index);
      this.indexLocal = index;
      if (this.openedItemComp && this.openedItemComp !== index) {
        this.openModal('deleteSettingsInAccordionItemConfirmation');
        return;
      }
      this.$emit('opened-item', index);
      this.openedItemComp = index;
    },
    deleteSettingsInAccordionItemOrOpenOther(openOther) {
      if (openOther) {
        this.$emit('close-item', this.openedItemComp);

        this.$emit('do-editable', this.indexLocal);
        this.$emit('opened-item', this.indexLocal);
        this.openedItemComp = this.indexLocal;
      } else {
        this.$emit('close-item', this.openedItemComp);
        this.openedItemComp = null;
      }
      this.closeModal('deleteSettingsInAccordionItemConfirmation');
      this.isDelete = false;
    },
  },
  computed: {
    openedItemComp: {
      get() {
        return this.openedItem;
      },
      set(newValue) {
        this.$emit('update:openedItem', newValue);
      },
    },
    currentRecurringName() {
      return _.get(
        this.$slots,
        `[${this.openedItemComp}][0].data.attrs.titleItem`,
      );
    },
  },
};
</script>
<style scoped lang="scss">
* {
  padding: 0;
  margin: 0;
}
ul {
  list-style: none;
}

.accordion {
  padding-left: 0;

  &__bold {
    font-weight: bold;
  }
}

.accordion_invalid {
  border: red 1px solid;
  padding-left: 5px;
  padding-right: 5px;
}

.accordion__item:not(:last-child) {
  border-bottom: #dfdfdf 1px solid;
}

.accordion__item {
  display: flex;
  justify-content: space-between;
}

.accordion__wr-content {
  padding: 12px 0;
  cursor: pointer;
  width: 100%;
}

.accordion__slot {
  display: inline-block;
  max-width: 270px;
}

.accordion__title {
  color: #0f232e;
  font-size: 14px;
  line-height: 16px;
  min-width: 100px;
  padding-right: 5px;
  display: inline-block;
  vertical-align: top;

  &.invalid {
    color: #f95d5d;
  }
}

.accordion__title.active {
  font-weight: bold;
}

.accordion__title.disabled {
  color: rgba(15, 35, 46, 0.55);
}

.accordion__placeholder {
  color: rgba(15, 35, 46, 0.55);
  font-size: 14px;
  line-height: 16px;
}

.accordion__close-item {
  padding-top: 12px;
}

.ui-icon {
  font-size: 16px;
  color: #8c9492;
  cursor: pointer;
}
</style>
