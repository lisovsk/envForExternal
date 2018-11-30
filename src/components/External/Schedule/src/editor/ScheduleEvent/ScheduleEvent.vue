<template>
<div class="schedule-event-scope">
  <div class="schedule-event">
    <div class="schedule-event__title">
      <div 
        :style="{background: copyScheduleEventData.color}"
        class="schedule-event__circle"
      ></div>
      <input
        placeholder="Specify event name…"
        class="textbox-without-border"
        :class="{'textbox-without-border_invalid': invalidNameOfEvent}"
        v-model="copyScheduleEventData.eventName"
        :invalid="invalidNameOfEvent"
        @blur="$v.validationCopyScheduleEventData.eventName.$touch()"
        @input="handleName()"
      />
    </div>
    <div class="wr-tizezone-start-date">
      <div class="wr-top-start-date">
        <div class="schedule-event__label">Date</div>
        <div class="recurring-controls__date">
          <or-icon class="recurring-controls__custom-icon-date" icon="view_comfy"></or-icon>
            <ui-datepicker
              :disabled="readonly" 
              class="recurring-controls__calendar-picker-custom" iconPosition="right" placeholder="Select date"
              :custom-formatter="formatDate" v-model="startDate"
              :invalid="validationDate"
              @touch="$v.validationCopyScheduleEventData.startExpression.date.$touch()"
            >
            </ui-datepicker>
        </div>
      </div>
      <label class="timezone timezone_top">
          <span class="schedule-event__label">Timezone</span>
          <or-select 
            :disabled="readonly" 
            placeholder="Select a time zone" 
            class="config-line__select" 
            :has-search="true" 
            :options="getRegions"
            v-model="timeZoneComp"
            :invalid="validationTimeZone"
            @dropdown-close="$v.validationCopyScheduleEventData.timeZone.value.$touch()"
          >
          </or-select>
      </label>
    </div>
    <div class="wr-time-period-list">
      <div class="schedule-event__label">Time</div>
      <time-period-list
        :times.sync="copyScheduleEventData.times"
        :readonly="readonly"
        :$v="$v"
      >
      </time-period-list>
    </div>
    <div class="recurring-controls">
        <or-checkbox class="recurring-controls__checkbox" v-model="copyScheduleEventData.isReccuring" :disabled="readonly">Recurring</or-checkbox>
        <span v-if="!copyScheduleEventData.isEndTime && copyScheduleEventData.isReccuring" class="recurring-controls__recuring-till">till</span>
        <div class="recurring-controls__wr-configs-time">
            <div class="" v-if="!copyScheduleEventData.isEndTime && copyScheduleEventData.isReccuring">
                <div class="">
                    <div class="">
                      <div class="recurring-controls__date">
                        <or-icon class="recurring-controls__custom-icon-date" icon="view_comfy"></or-icon>
                          <ui-datepicker 
                            :disabled="readonly"
                            class="recurring-controls__calendar-picker-custom"
                            iconPosition="right" placeholder="Select date"
                            :custom-formatter="formatDate" 
                            v-model="endDate"
                            :invalid="$v.validationCopyScheduleEventData.endExpression.date.$invalid && $v.validationCopyScheduleEventData.endExpression.date.$dirty"
                            @touch="$v.validationCopyScheduleEventData.endExpression.date.$touch()"
                          >
                          </ui-datepicker>
                      </div>
                    </div>
                </div>
            </div>
            <div v-if="copyScheduleEventData.isReccuring" class="recurring-controls__wr-is-end">
                <or-checkbox class="recurring-controls__checkbox" v-model="copyScheduleEventData.isEndTime" :disabled="readonly">No end</or-checkbox>
            </div>
        </div>
    </div>
    <accordion
      :opened-item.sync="copyScheduleEventData.savedAccordionSlotName"
      v-if="copyScheduleEventData.isReccuring"
      :saved-accordion-num-item="scheduleEventData.savedAccordionSlotName"
      @close-item="closeAccordionItem"
      @opened-item="openedAccordionItem"
      @do-editable="doEditable"
      :slot-errors="errorsAccordion"
      :invalid="$v.validationCopyScheduleEventData.savedAccordionSlotName.$invalid && $v.validationCopyScheduleEventData.savedAccordionSlotName.$dirty"
      @touch="$v.validationCopyScheduleEventData.savedAccordionSlotName.$touch()"
      :is-editable="isEditable"
    >
        <template slot="item1">
            <div 
              placeholderItem="Set recurring daily"
               titleItem="Daily">
              <cron-generators-daily
                :period.sync="copyScheduleEventData.daily.period"
                :period-mode.sync="copyScheduleEventData.daily.periodMode"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="copyScheduleEventData.daily.cronExpressions"
                :index="0"
                :data-state="dataStateComp"
                :is-editable.sync="isEditable"
                :preview-texts.sync="previewTexts"
                @text-when-scheduled="/*textWhenScheduled*/"
                :$v="$v"
                :invalid="errorsAccordion.item1"
              ></cron-generators-daily>
            </div>
        </template>
        <template  slot="item2">
            <div placeholderItem="Set recurring weekly"  titleItem="Weekly">
              <cron-generators-weekly
                :week-days.sync="copyScheduleEventData.weekly.weekDays"
                :period.sync="copyScheduleEventData.weekly.period"
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="copyScheduleEventData.weekly.cronExpressions"
                :index="1"
                :data-state="dataStateComp"
                :is-editable.sync="isEditable"
                :preview-texts.sync="previewTexts"
                :$v="$v"
                :invalid="errorsAccordion.item2"
              ></cron-generators-weekly>
            </div>
        </template>
        <template  slot="item3">
            <div placeholderItem="Set recurring monthly"  titleItem="Monthly">
              <cron-generators-monthly
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                :selected-months.sync="copyScheduleEventData.monthly.selectedMonths"
                :selected-days.sync="copyScheduleEventData.monthly.selectedDays"
                :days-period.sync="copyScheduleEventData.monthly.daysPeriod"
                :mode.sync="copyScheduleEventData.monthly.mode"
                :period.sync="copyScheduleEventData.monthly.period"
                v-model="copyScheduleEventData.monthly.cronExpressions"
                :index="2"
                :data-state="dataStateComp"
                :is-editable.sync="isEditable"
                :preview-texts.sync="previewTexts"
                :$v="$v"
                :invalid="errorsAccordion.item3"
              ></cron-generators-monthly>
            </div>
        </template> 
        <template  slot="item4">
            <div placeholderItem="Set recurring yearly"  titleItem="Yearly">
              <cron-generators-yearly
                :runAtTime="runAtTimeLocal"
                :readonly="readonly"
                v-model="copyScheduleEventData.yearly.cronExpressions"
                :period.sync="copyScheduleEventData.yearly.period"
                :start-year.sync="copyScheduleEventData.yearly.startYear"
                :selected-months.sync="copyScheduleEventData.yearly.selectedMonths"
                :days-period.sync="copyScheduleEventData.yearly.daysPeriod"
                :index="3"
                :data-state="dataStateComp"
                :is-editable.sync="isEditable"
                :preview-texts.sync="previewTexts"
                :$v="$v"
                :invalid="errorsAccordion.item4"
              ></cron-generators-yearly>
            </div>
        </template>
    </accordion>
    <div class="schedule-event__wr-buttons">
      <or-button 
        @click="deleteEvent" 
        class="schedule-event__bottom-button_delete" 
        color="red" 
        type="secondary"
      >
        Delete
      </or-button>
      <or-button 
        @click="cancel" 
        class="schedule-event__bottom-button" 
        color="primary" 
        type="secondary"
      >
        Cancel
      </or-button>
      <or-button 
        :loading="loadingApply"
        :disabled="(dataStateComp === 'saved' || dataStateComp === 'canceled') || ($v.validationCopyScheduleEventData.$invalid && $v.validationCopyScheduleEventData.$dirty)"
        @click="apply"
        class="schedule-event__bottom-button" 
        color="primary"
      >
        Apply
      </or-button>
    </div>
    <or-modal  :contain-focus="false" ref="cancelAndDataNotSave" title="Discard unsaved changes">
        You have unsaved changes. Are you sure you want to discard them?

        <div slot="footer">
            <or-button color="red" @click="discardNotSaved">Discard</or-button>
            <or-button color="primary" type="secondary" @click="closeModal('cancelAndDataNotSave')">Cancel</or-button>
        </div>
    </or-modal>
  </div>
</div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment-timezone';

/* eslint-disable */
import TimePeriodList from '../TimePeriodList/TimePeriodList.vue';
import Accordion from '../../../../../Ui/Accordion/Accordion.vue';
import CronGeneratorsDaily from '../CronGenerators/Daily.vue';
import CronGeneratorsWeekly from '../CronGenerators/Weekly.vue';
import CronGeneratorsMonthly from '../CronGenerators/Monthly.vue';
import CronGeneratorsYearly from '../CronGenerators/Yearly.vue';
import defaultValues from '../Constants/DefaultValues.js';
import valdationsReccurin from '../validation/validationReccuring.js';
/* eslint-enable */

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false,
      isEditable: false
    },
    steps: null,
    stepId: null,
    $v: null,
    editableEventNum: {
      type: Number,
      default: null
    },
    index: {
      type: Number,
      default: null
    },
    copyScheduleEventData: {
      type: Object,
      default: () => ({})
    },
    scheduleEventData: {
      type: Object,
      default: () => ({})
    },
    dataState: {
      type: String,
      default: 'saved'
    },
    previewTexts: {
      type: Object,
      default: null
    },
    saved: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      i: 0,
      runAtTimeLocal: [],
      loadingApply: false,
      isEditable: false
    };
  },
  computed: {
    getRegions() {
      // return only canonical zones
      const timeZones = moment.tz._zones; // eslint-disable-line no-underscore-dangle

      return _.chain(timeZones)
        .keys()
        .map(key => {
          // due to mutation in moment we need check if it's object
          // mutation is caused when invoke moment.tz()
          const zone = timeZones[key];
          return _.isObject(zone) ? zone.name : zone.split('|')[0];
        })
        .filter(zone => zone.indexOf('/') >= 0)
        .sort()
        .map(value => ({ label: value, value }))
        .value();
    },
    timeZoneComp: {
      get() {
        const timeZone = moment.tz.guess();
        return _.isEmpty(this.copyScheduleEventData.timeZone)
          ? timeZone
          : _.get(this.copyScheduleEventData.timeZone, 'value', '');
      },
      set(newValue) {
        if (newValue) {
          this.copyScheduleEventData.timeZone = {
            value: newValue,
            label: newValue
          };
        }
      }
    },
    endDate: {
      get() {
        const date = _.get(this.copyScheduleEventData.endExpression, 'date');
        return date ? new Date(date) : null;
      },
      set(newValue) {
        const date = new Date(newValue);
        this.copyScheduleEventData.endExpression.date = moment(date).format(
          'YYYY-MM-DD'
        );
      }
    },
    startDate: {
      get() {
        const date = _.get(this.copyScheduleEventData, 'startExpression.date');
        return date ? new Date(date) : null;
      },
      set(newValue) {
        const date = new Date(newValue);
        console.log('datedatedatedate', date);
        this.copyScheduleEventData.startExpression.date = moment(date).format(
          'YYYY-MM-DD'
        );
      }
    },
    dataStateComp: {
      get() {
        return this.dataState || 'saved';
      },
      set(newValue) {
        this.$emit('update:dataState', newValue);
      }
    },
    savedAccordionNumItemComp() {
      return this.copyScheduleEventData.savedAccordionSlotName
        ? parseInt(
            this.copyScheduleEventData.savedAccordionSlotName
              .split('')
              .reverse()
              .join(),
            10
          )
        : -1;
    },
    errorsAccordion() {
      return {
        item1:
          _.get(
            this.$v,
            'validationCopyScheduleEventData.daily.$anyDirty',
            false
          ) &&
          _.get(
            this.$v,
            'validationCopyScheduleEventData.daily.$invalid',
            false
          ),
        // item1: !valdationsReccurin.daily(this.copyScheduleEventData),
        item2:
          _.get(
            this.$v,
            'validationCopyScheduleEventData.weekly.$anyDirty',
            false
          ) &&
          _.get(
            this.$v,
            'validationCopyScheduleEventData.weekly.$invalid',
            false
          ),
        // item2: !valdationsReccurin.weekly(this.copyScheduleEventData),
        item3:
          _.get(
            this.$v,
            'validationCopyScheduleEventData.monthly.$anyDirty',
            false
          ) &&
          _.get(
            this.$v,
            'validationCopyScheduleEventData.monthly.$invalid',
            false
          ),
        // item3: !valdationsReccurin.monthly(this.copyScheduleEventData),
        // item4: !valdationsReccurin.yearly(this.copyScheduleEventData),
        item4:
          _.get(
            this.$v,
            'validationCopyScheduleEventData.yearly.$anyDirty',
            false
          ) &&
          _.get(
            this.$v,
            'validationCopyScheduleEventData.yearly.$invalid',
            false
          )
      };
    },
    validationDate() {
      return (
        _.get(
          this.$v,
          'validationCopyScheduleEventData.startExpression.date.$invalid',
          false
        ) &&
        _.get(
          this.$v,
          'validationCopyScheduleEventData.startExpression.date.$dirty',
          false
        )
      );
    },
    validationTimeZone() {
      return (
        _.get(
          this.$v,
          'validationCopyScheduleEventData.timeZone.value.$invalid',
          false
        ) &&
        _.get(
          this.$v,
          'validationCopyScheduleEventData.timeZone.value.$dirty',
          false
        )
      );
    },
    invalidNameOfEvent() {
      return (
        this.$v.validationCopyScheduleEventData.eventName.$dirty &&
        this.$v.validationCopyScheduleEventData.eventName.$invalid
      );
    }
  },
  methods: {
    handleName() {
      const maxLength = 140;
      if (this.copyScheduleEventData.eventName.length > maxLength) {
        this.copyScheduleEventData.eventName = this.copyScheduleEventData.eventName.slice(
          0,
          maxLength
        );
      }
    },
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
    apply() {
      if (this.$v.validationCopyScheduleEventData.$invalid) {
        this.$v.validationCopyScheduleEventData.$touch();
      } else if (
        this.dataStateComp !== 'canceled' &&
        this.dataStateComp !== 'saved'
      ) {
        this.expressionsForNotRecurring();
        this.copyScheduleEventData.saved = true;
        this.$emit('apply-changes');

        this.loadingApply = true;
        setTimeout(() => {
          this.loadingApply = false;
        }, 200);

        this.dataStateComp = 'saved';
        this.$emit('update:editableEventNum', null);
        // this.$emit('update:copyScheduleEventData.startExpression.date', '');
        // this.$emit('saved-event');
      }
    },
    cancel() {
      if (this.dataStateComp === 'new') {
        this.deleteEvent();
        this.$emit('cancel-event');
      } else if (
        this.dataStateComp !== 'canceled' &&
        this.dataStateComp !== 'saved'
      ) {
        if (this.$v.validationCopyScheduleEventData.$invalid && !this.saved) {
          this.deleteEvent();
        } else {
          this.openModal('cancelAndDataNotSave');
        }
      } else {
        this.$emit('cancel-changes');
        this.dataStateComp = 'canceled';
        this.$emit('cancel-event');
      }
    },
    formatDate(date) {
      const timeZone = moment.tz.guess();
      return moment(date)
        .tz(timeZone)
        .format('YYYY-MM-DD');
    },

    doExpressions() {
      if (this.copyScheduleEventData.isReccuring) {
        const expressions = [].concat(
          this.copyScheduleEventData.daily.cronExpressions,
          this.copyScheduleEventData.weekly.cronExpressions,
          this.copyScheduleEventData.monthly.cronExpressions,
          this.copyScheduleEventData.yearly.cronExpressions
        );
        this.copyScheduleEventData.expressions = expressions;
      }
    },
    changeSavedAccordionSlotName(number) {
      // console.log(number);
      this.copyScheduleEventData.savedAccordionSlotName = number;
    },
    closeAccordionItem(item) {
      switch (item) {
        case 'item1':
          this.copyScheduleEventData.daily = _.cloneDeep(defaultValues.daily);
          break;
        case 'item2':
          this.copyScheduleEventData.weekly = _.cloneDeep(defaultValues.weekly);
          break;
        case 'item3':
          this.copyScheduleEventData.monthly = _.cloneDeep(
            defaultValues.monthly
          );
          break;
        case 'item4':
          this.copyScheduleEventData.yearly = _.cloneDeep(defaultValues.yearly);
          break;
        default:
          throw new Error('incorrect number of accordion item');
      }
      console.log(item);
      // this.copyScheduleEventData.savedAccordionSlotName = null;
    },
    openedAccordionItem(itemNum) {
      console.log('itemNum', itemNum);
      // this.copyScheduleEventData.savedAccordionSlotName = itemNum;
    },
    doEditable() {
      this.isEditable = true;
      // if (
      //   this.copyScheduleEventData.savedAccordionSlotName === index ||
      //   this.savedAccordionNumItemComp === -1
      // ) {
      //   this.isEditable = true;
      // }
    },
    deleteEvent() {
      this.$emit('delete-event', this.index);
    },
    //TODO
    // textWhenScheduled(text) {
    //   console.log('textWhenScheduled', text);
    //   this.copyScheduleEventData.previewTexts.reccuring = text;
    // }
    discardNotSaved() {
      this.$emit('cancel-changes');
      this.dataStateComp = 'canceled';
      this.$emit('cancel-event');
    },
    expressionsForNotRecurring() {
      console.log(121212);
      const date = moment(
        this.copyScheduleEventData.startExpression.date,
        'YYYY-MM-DD'
      );
      if (!this.copyScheduleEventData.isReccuring) {
        // this.copyScheduleEventData.expressions = this.runAtTimeLocal.map(
        //   item =>
        //     `${parseInt(item.mm, 10)} ${parseInt(item.HH, 10)} ${parseInt(
        //       date.format('DD'),
        //       10,
        //     )}  ${parseInt(date.format('MM'), 10)} * ${parseInt(
        //       date.format('YYYY'),
        //       10,
        //     )}`,
        // );
        const expressionsLocal = [];
        const secondsOfhours = {};
        this.runAtTimeLocal.forEach(item => {
          if (!secondsOfhours[item.HH]) secondsOfhours[item.HH] = [];
          secondsOfhours[item.HH].push(item.mm);
        });

        Object.keys(secondsOfhours).forEach(keySecondsOfhours => {
          expressionsLocal.push(
            `-1,${secondsOfhours[keySecondsOfhours]} ${parseInt(
              keySecondsOfhours,
              10
            )} ${parseInt(date.format('DD'), 10)}  ${parseInt(
              date.format('MM'),
              10
            )} * ${parseInt(date.format('YYYY'), 10)}`
          );
        });

        this.copyScheduleEventData.expressions = expressionsLocal;
        // console.log('this.runAtTimeLocal', this.runAtTimeLocal);
        // console.log('secondsOfhours', secondsOfhours);
        // console.log('expressionsLocal', expressionsLocal);
        // this.copyScheduleEventData.endExpression.date = date.add(1, 'day').format('YYYY-MM-DD');
        //  console.log('this.copyScheduleEventData.endExpression',this.copyScheduleEventData.endExpression.date);
      }
    },
    getRunAtTimeLocal(newVal) {
      const runAtTimeLocal = [];

      _.forEach(newVal, item => {
        const evertVal = item.every.val ? item.every.val : 1;
        if (item.start.HH && item.start.mm && parseInt(evertVal, 10)) {
          const units = item.every.units === 'hh' ? 'hours' : 'minutes';

          let nextRunAtTime = moment(`${item.start.HH}:${item.start.mm}`, [
            'HH:mm'
          ]);
          const endTimeHmmA = moment(`${item.end.HH}:${item.end.mm}`, [
            'HH:mm'
          ]);

          do {
            runAtTimeLocal.push({
              HH: nextRunAtTime.hours(),
              mm: nextRunAtTime.minutes()
            });

            nextRunAtTime = nextRunAtTime.add(evertVal, units);
          } while (
            nextRunAtTime.isSameOrBefore(endTimeHmmA) &&
            item.end.HH &&
            item.end.mm
          );
        }
      });
      return _.uniqWith(runAtTimeLocal, _.isEqual);
    }
  },
  watch: {
    'copyScheduleEventData.times': {
      handler(newVal) {
        this.runAtTimeLocal = this.getRunAtTimeLocal(newVal);
      },
      deep: true
    },

    copyScheduleEventData: {
      handler(newValue, oldValue) {
        if (
          !_.isEqual(newValue, this.scheduleEventData) &&
          newValue.id === oldValue.id
        ) {
          console.log('newValue11', JSON.stringify(newValue));
          console.log(
            'scheduleEventData11',
            JSON.stringify(this.scheduleEventData)
          );

          this.dataStateComp = 'changed';

        } else if (this.dataStateComp !== 'new') {
          this.dataStateComp = 'canceled';
        }
      },
      deep: true
    },

    'copyScheduleEventData.daily.cronExpressions': {
      handler() {
        this.doExpressions();
      },
      deep: true
    },

    'copyScheduleEventData.weekly.cronExpressions': {
      handler() {
        this.doExpressions();
      },
      deep: true
    },

    'copyScheduleEventData.monthly.cronExpressions': {
      handler() {
        this.doExpressions();
      },
      deep: true
    },

    'copyScheduleEventData.yearly.cronExpressions': {
      handler() {
        this.doExpressions();
      },
      deep: true
    },
    // dataState(newValue) {
    //   this.$emit('data-state', newValue);
    // },
    // dataStateGlobal(newValue) {
    //   console.log(this.index);
    //   if(newValue.index === this.index) {
    //     this.dataState = 'saved';
    //   }
    // }
    runAtTimeLocal: {
      handler(newValue) {
        // this.$emit('run-at-time', newValue);
        this.copyScheduleEventData.runAtTime = newValue;
      },
      deep: true
    }
  },

  components: {
    Accordion,
    TimePeriodList,
    CronGeneratorsDaily,
    CronGeneratorsWeekly,
    CronGeneratorsMonthly,
    CronGeneratorsYearly
  }
};
</script>

<style lang="scss">
.schedule-event-scope {
  .schedule-event {
    min-width: 410px;
    padding-left: 16px;

    &__wr-buttons {
      padding-top: 25px;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    }

    &__circle {
      width: 20px;
      min-width: 20px;
      height: 20px;
      display: inline-block;
      border-radius: 50%;
      margin-bottom: 25px;
      margin-right: 16px;
    }

    &__title {
      display: flex;
      align-items: center;
    }

    &__label {
      color: #91969d;
      font-size: 12px;
      line-height: 16px;
      padding-bottom: 8px;
    }

    &__bottom-button {
      &_delete.ui-button.ui-button--type-secondary.ui-button--color-red {
        border: none;
      }
      &:not(:last-child) {
        margin-right: 12px;
      }
    }

    .wr-tizezone-start-date {
      display: flex;
    }

    .wr-top-start-date {
      padding-right: 30px;
    }

    .ui-select .ui-select__content .ui-select__label .ui-select__display {
      min-height: 32px;
    }

    .wr-time-period-list {
      padding-top: 16px;
    }

    .textbox-without-border {
      margin-bottom: 25px;
      height: 32px;
      outline: none;
      border: none;
      width: 100%;
      background: #fff;
      color: #0f232e;
      font-size: 17px;
      font-weight: bold;
      &::placeholder {
        font-size: 17px;
        color: rgba(15, 35, 46, 0.55);
        font-weight: bold;
      }

      &_invalid {
        border-bottom: 1.2px solid #f95d5d;
      }
      .ui-textbox__input {
        border: none;
        background: #fff;
        color: #0f232e;
        font-size: 17px;
        font-weight: bold;
        line-height: 23px;
        padding: 0;
        &::placeholder {
          font-size: 17px !important;
        }
      }
      &.ui-textbox {
        margin-bottom: 25px;
        width: 100%;
      }
    }
  }

  .config-line__select {
    height: 25px;
    white-space: nowrap;
    margin-right: 5px;
    &.ui-select {
      margin-bottom: 0;
      .ui-select__display {
        min-width: 80px;
        padding: 0 11px;
        height: 25px;
        border-radius: 3px;
        background-color: #fbfbfb;
        border: solid 1px #e7e7e7;
        .ui-select__display-value {
          font-size: 14px;
          color: #0f232e;
        }
      }
      &.is-active {
        .ui-select__display {
          border: 1px solid #64b2da;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        .ui-select__dropdown {
          border: 1px solid #64b2da;
          min-width: 80px;
          padding: 0;
          .is-highlighted {
            color: #000000;
            background-color: #f9f9f9;
          }
        }
      }
    }
    &.select-box-error {
      .ui-select__content {
        .ui-select__label {
          .ui-select__display {
            border: 1px solid rgba(244, 67, 5, 0.46);
          }
        }
      }
    }
  }

  .timezone {
    display: flex;
    align-items: baseline;
    flex-direction: column;
    &_top {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    &__label {
      padding-right: 25px;
      color: #91969d;
      font-size: 14px;
      line-height: 16px;
    }

    .ui-select {
      width: 100%;
      margin-bottom: 0px;
    }
  }

  .date {
    color: rgba(15, 35, 46, 0.55);
    font-size: 17px;
    font-weight: bold;
    line-height: 23px;
    padding-top: 8px;
    padding-bottom: 6px;

    &_start {
      padding-right: 10px;
    }

    // &_end {
    //   max-width: 120px;
    //   display: flex;
    //   align-items: center;
    // }
  }

  .recurring-controls {
    display: flex;
    height: 70px;
    padding-top: 23px;
    padding-bottom: 15px;

    &__checkbox {
      &.ui-checkbox .ui-checkbox__label-text {
        color: #0f232e;
      }
    }

    .ui-checkbox--color-primary {
      display: flex;
      align-self: center;
    }

    &__wr-is-end {
      padding-left: 30px;
    }

    &__calendar-picker-custom.ui-datepicker
      .ui-datepicker__content
      .ui-datepicker__display {
      padding-left: 35px;
      width: 140px;
      min-height: 30.8px;
      color: #0f232e;
      font-size: 12px;
      background: #fff;
      border-radius: 0;
    }

    &__calendar-picker-custom.ui-datepicker {
      margin-bottom: 0;
    }
    .ui-checkbox {
      margin-bottom: 0;
    }

    &__date {
      position: relative;
    }

    &__custom-icon-date {
      position: absolute;
      z-index: 1;
      font-size: 12px;
      color: #e1e1e1;
      top: 50%;
      margin-top: -6px;
      left: 8px;
    }

    &__recuring-till {
      padding: 0 16px;
      color: #0f232e;
      font-size: 14px;
      line-height: 19px;
      display: flex;
      align-items: center;
    }

    &__wr-configs-time {
      display: flex;
      align-items: center;
    }
  }
}
</style>