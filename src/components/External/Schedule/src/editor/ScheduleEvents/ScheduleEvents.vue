<template>
  <div class="schedule-events-scope">
    <div class="schedule-events">
      <or-list
        v-model="scheduleEventsLocal"
        :steps="steps"
        :step-id="stepId"
        add-button-label="Add Event"
        :new-item-method="listNewItemMethod"
        :drag-handle-right="true"
        @item-added="eventAdded"
        prettifyDrag
        :can-delete-items="false"
        :can-drag-items="false"
        :readonly="readonly"
        ref="eventList"
      >
        <template scope="item">
          <div class="schedule__wr-event-preview" @click="doEditable(item.index)">
            <schedule-event-preview
              v-if="item.item.scheduleEventData.saved"
              :color="item.item.scheduleEventData.color"
              :event-name="item.item.scheduleEventData.eventName"
              :preview-texts="item.item.previewTexts"
              :is-reccuring="item.item.scheduleEventData.isReccuring"
              :startTimes="item.item.scheduleEventData.times"
              :end-date="{ noEnd: item.item.scheduleEventData.isEndTime, date: item.item.scheduleEventData.endExpression.date}"
              :start-date="item.item.scheduleEventData.startExpression.date"
              :expressions="item.item.scheduleEventData.expressions"
              :time-zone="item.item.scheduleEventData.timeZone.value"
              :index="item.index"
              @do-editable="doEditable"
              @copy-event="copyEvent"
              @delete-event="deleteEvent"
              :readonly="readonly"
            ></schedule-event-preview>
          </div>
        </template>
      </or-list>
      <or-modal
        :contain-focus="false"
        class="schedule-events__big-modal"
        ref="modal"
        title="Set schedule"
        @close="closeModalEvent('modal')"
        size="large"
      >
        <div class="schedule__wr-events-calendar">
          <div class="schedule__calendar">
            <calendar
              :month="1"
              @selected-date="changeSelectedDate"
              :selected-days="startDays"
              :editable="editable"
              @changed-calendar-time-zone="getChangedCalendarTimeZone"
            ></calendar>
          </div>
          <div class="schedule__events">
            <or-list
              v-model="scheduleEventsLocal"
              :steps="steps"
              :step-id="stepId"
              :new-item-method="listNewItemMethod"
              :drag-handle-right="true"
              @item-added="eventAdded"
              prettifyDrag
              :can-delete-items="false"
              :can-drag-items="false"
              :readonly="readonly"
            >
              <div slot="footer" @click="addItem">
                <or-button class="add-buttom" color="primary" icon="add" type="secondary">Add Event</or-button>
              </div>
              <template scope="item">
                <schedule-event
                  v-if="editableEventNum == item.index && copyScheduleEventData"
                  :index="item.index"
                  :copy-schedule-event-data.sync="copyScheduleEventData"
                  :schedule-event-data.sync="scheduleEventsLocal[editableEventNum].scheduleEventData"
                  :$v="$v"
                  :readonly="readonly"
                  :step-id="stepId"
                  :steps="steps"
                  :data-state.sync="dataStates[item.index]"
                  :preview-texts.sync="item.item.previewTexts"
                  :editable-event-num.sync="editableEventNum"
                  :saved="item.item.scheduleEventData.saved"
                  @save-copy="/*saveCopy*/"
                  @return-state="/*returnState*/"
                  @apply-changes="applyChanges"
                  @cancel-changes="cancelChanges"
                  @data-state="/*changeDataState*/"
                  @delete-event="deleteEvent"
                ></schedule-event>
                <schedule-event-preview
                  v-if="editableEventNum !== item.index && item.item.scheduleEventData.saved"
                  :color="item.item.scheduleEventData.color"
                  :index="item.index"
                  :event-name="item.item.scheduleEventData.eventName"
                  :preview-texts="item.item.previewTexts"
                  :is-reccuring="item.item.scheduleEventData.isReccuring"
                  :startTimes="item.item.scheduleEventData.times"
                  :end-date="{ noEnd: item.item.scheduleEventData.isEndTime, date: item.item.scheduleEventData.endExpression.date}"
                  :start-date="item.item.scheduleEventData.startExpression.date"
                  :expressions="item.item.scheduleEventData.expressions"
                  :time-zone="item.item.scheduleEventData.timeZone.value"
                  :editable="editable"
                  @do-editable="doEditable"
                  @copy-event="copyEvent"
                  @delete-event="deleteEvent"
                ></schedule-event-preview>
              </template>
            </or-list>
          </div>
        </div>
      </or-modal>
      <or-modal
        :contain-focus="false"
        ref="deleteEvent"
        title="Сonfirmation of delete"
      >Are you sure want delete event?
        <div slot="footer">
          <or-button color="red" @click="deleteСonfirmation()">Delete</or-button>
          <or-button color="primary" type="secondary" @click="closeModal('deleteEvent')">Cancel</or-button>
        </div>
      </or-modal>
      <or-modal
        :contain-focus="false"
        ref="dataNotSave"
        title="Discard unsaved changes"
      >You have unsaved changes. Are you sure you want to discard them?
        <div slot="footer">
          <or-button color="red" @click="discard">Discard</or-button>
          <or-button color="primary" type="secondary" @click="closeModal('dataNotSave')">Cancel</or-button>
        </div>
      </or-modal>
      <or-modal
        :contain-focus="false"
        ref="dataNotSaveEndSwitchToOtherEvent"
        title="Discard unsaved changes"
        @close="cancelDiscard"
      >You have unsaved changes. Are you sure you want to discard them?
        <div slot="footer">
          <or-button color="red" @click="discardSwitchToOtherEvent">Discard</or-button>
          <or-button color="primary" type="secondary" @click="cancelDiscard">Cancel</or-button>
        </div>
      </or-modal>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import uuid from "uuid";
import randomMC from "random-material-color";

/* eslint-disable */
import defaultValues from "../Constants/DefaultValues.js";
import ScheduleEvent from "../ScheduleEvent/ScheduleEvent.vue";
import ScheduleEventPreview from "../ScheduleEventPreview/ScheduleEventPreview.vue";
import Calendar from "../../../../../Ui/Calendar/Calendar.vue";
/* eslint-enable */

const randomColor = _.get(
  randomMC,
  "module.exports.getColor",
  randomMC.getColor
);

export default {
  name: "schedule-events",
  props: [
    "scheduleEvents",
    "$v",
    "template",
    "schema",
    "step",
    "stepId",
    "steps",
    "readonly"
  ],
  components: {
    ScheduleEvent,
    Calendar,
    ScheduleEventPreview
  },

  data() {
    return {
      itemIndexForDelete: null,
      scheduleEventsLocal: _.cloneDeep(this.scheduleEvents),
      editableEventNum: null,
      copyScheduleEventData: null,
      dataStates: [],
      numOfTryEdit: null,
      runAtTime: null,
      calendarTimeZone: ""
    };
  },
  beforeCreate() {
    const div = document.createElement("div");
    div.setAttribute("id", "modal-portal");
    document.body.appendChild(div);
  },
  computed: {
    editable() {
      return !!this.editableEventNum || this.editableEventNum === 0;
    },
    startDays() {
      const dates = this.scheduleEventsLocal
        .map(item => {
          const dateSplice = item.scheduleEventData.startExpression.date.split(
            "-"
          );

          return {
            color: item.scheduleEventData.color,
            expressions: item.scheduleEventData.expressions,
            isReccuring: item.scheduleEventData.isReccuring,
            endExpression: item.scheduleEventData.endExpression,
            startExpression: item.scheduleEventData.startExpression,
            isEndTime: item.scheduleEventData.isEndTime,
            eventName: item.scheduleEventData.eventName,
            times: item.scheduleEventData.times,
            runAtTime: item.scheduleEventData.runAtTime,
            timeZone: item.scheduleEventData.timeZone,
            date: {
              day: parseInt(dateSplice[2], 10),
              month: parseInt(dateSplice[1], 10),
              year: parseInt(dateSplice[0], 10)
            }
          };
        })
        .filter((item, index) => index !== this.editableEventNum);

      if (this.copyScheduleEventData) {
        const copyScheduleEventDataSplice = this.copyScheduleEventData.startExpression.date.split(
          "-"
        );
        dates.push({
          color: this.copyScheduleEventData.color,
          expressions: this.copyScheduleEventData.expressions,
          isReccuring: this.copyScheduleEventData.isReccuring,
          endExpression: this.copyScheduleEventData.endExpression,
          startExpression: this.copyScheduleEventData.startExpression,
          isEndTime: this.copyScheduleEventData.isEndTime,
          eventName: this.copyScheduleEventData.eventName,
          times: this.copyScheduleEventData.times,
          runAtTime: this.copyScheduleEventData.runAtTime,
          timeZone: this.copyScheduleEventData.timeZone,
          date: {
            day: parseInt(copyScheduleEventDataSplice[2], 10),
            month: parseInt(copyScheduleEventDataSplice[1], 10),
            year: parseInt(copyScheduleEventDataSplice[0], 10)
          }
        });
      }
      return dates;
    },
    changedNumber() {
      return this.dataStates.indexOf("changed");
    },
    scheduleEventsLocaSavedLength() {
      return this.scheduleEventsLocal.filter(
        item => item.scheduleEventData.saved
      ).length;
    }
  },

  methods: {
    getChangedCalendarTimeZone(newCalendarTimeZone) {
      this.calendarTimeZone = newCalendarTimeZone;
    },

    addItem: _.debounce(function() {
      this.$refs.eventList.addItem();
    }, 400),

    listNewItemMethod() {
      return {
        scheduleEventData: {
          id: uuid.v4(),
          startExpression: {
            time: "00:00",
            date: ""
          },
          deactivateAfterLastRun: false,
          includeEndTime: false,
          isReccuring: false,
          expressions: [],
          isEndTime: false,
          eventName: "",
          endExpression: {
            time: "23:59:59",
            date: ""
          },
          timeZone: {
            label: Intl.DateTimeFormat().resolvedOptions().timeZone,
            value: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          daily: defaultValues.daily,
          weekly: defaultValues.weekly,
          monthly: defaultValues.monthly,
          yearly: defaultValues.yearly,
          times: [
            {
              start: {
                HH: "00",
                mm: "00"
              },
              end: {
                HH: "00",
                mm: "00"
              },
              every: {
                val: 10,
                units: "mm"
              },
              endTime: false,
              vforkey: uuid.v4()
            }
          ],
          color: randomColor(),
          runAtTime: [
            {
              HH: 0,
              mm: 0
            }
          ],
          savedAccordionSlotName: null
        },
        previewTexts: {
          reccuring: ""
        }
      };
    },
    openModal(ref) {
      this.$refs[ref].open();
    },
    closeModal(ref) {
      this.$refs[ref].close();
    },
    closeModalEvent(ref) {
      if (this.changedNumber !== -1) {
        this.$refs[ref].open();
        this.openModal("dataNotSave");
      } else {
        this.deleteNotSaved();
      }
    },
    changeSelectedDate(day, month, year) {
      this.copyScheduleEventData.startExpression.date = moment(
        `${year}-${month}-${day}`,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD");
    },
    doEditable(index, isNewItem) {
      setTimeout(() => {
        this.numOfTryEdit = index;
        if (this.changedNumber !== -1) {
          this.openModal("dataNotSaveEndSwitchToOtherEvent");
        } else {
          if (!this.$refs.modal.isOpen) {
            this.openModal("modal");
          }
          this.editableEventNum = index;
          this.$set(
            this,
            "copyScheduleEventData",
            _.cloneDeep(
              _.get(this.scheduleEventsLocal, `[${index}].scheduleEventData`)
            )
          );
          this.deleteNotSaved(true, isNewItem);
        }
      }, 0);
    },
    applyChanges() {
      this.scheduleEventsLocal[
        this.editableEventNum
      ].scheduleEventData = _.cloneDeep(this.copyScheduleEventData);
      this.$emit("update:scheduleEvents", this.scheduleEventsLocal);
      this.deleteCopyScheduleEventData();
    },
    cancelChanges() {
      this.copyScheduleEventData = _.cloneDeep(
        this.scheduleEventsLocal[this.editableEventNum].scheduleEventData
      );
      this.deleteCopyScheduleEventData();
    },
    deleteCopyScheduleEventData() {
      _.set(this, "copyScheduleEventData.startExpression.date", "");
      this.copyScheduleEventData.expressions = [];
      this.editableEventNum = null;
    },
    changeDataState(newDataState) {
      this.dataState = newDataState;
    },
    discard() {
      this.$set(this.dataStates, this.changedNumber, "canceled");
      this.closeModal("dataNotSave");
      this.closeModal("modal");
    },
    discardSwitchToOtherEvent() {
      this.$set(this.dataStates, this.changedNumber, "canceled");
      this.closeModal("dataNotSaveEndSwitchToOtherEvent");
      this.doEditable(this.numOfTryEdit);
    },
    copyEvent(index) {
      const copyOfEvent = _.cloneDeep(this.scheduleEventsLocal[index]);
      copyOfEvent.vforkey = uuid.v4();
      copyOfEvent.scheduleEventData.id = uuid.v4();
      copyOfEvent.scheduleEventData.eventName = `Copy of ${
        copyOfEvent.scheduleEventData.eventName
      }`.slice(0, 140);
      copyOfEvent.scheduleEventData.color = randomColor();
      this.scheduleEventsLocal.push(copyOfEvent);
      this.$emit("update:scheduleEvents", this.scheduleEventsLocal);
    },
    deleteEvent(index) {
      this.itemIndexForDelete = index;

      if (
        this.dataStates[this.itemIndexForDelete] === "new" ||
        (this.dataStates[this.itemIndexForDelete] === "canceled" &&
          !this.copyScheduleEventData.saved)
      ) {
        this.deleteСonfirmation();
      } else {
        this.openModal("deleteEvent");
      }
    },
    eventAdded() {
      setTimeout(() => {
        // if (this.dataStates[this.scheduleEventsLocaSavedLength] !== "changed") {
        this.$set(this.dataStates, this.scheduleEventsLocaSavedLength, "new");
        // }
        this.doEditable(this.scheduleEventsLocaSavedLength, true);
        this.numOfTryEdit = this.scheduleEventsLocaSavedLength;
      }, 0);
    },
    deleteNotSaved(isDelCurrEditable = false, isNewItem = false) {
      // this.dataStates[this.itemIndexForDelete] = "canceled";
      this.scheduleEventsLocal = this.scheduleEventsLocal.filter(
        (item, index) => {
          let res;
          if (this.editableEventNum === index && isDelCurrEditable) {
            res = true;
          } else {
            res = _.get(item, "scheduleEventData.saved");
          }
          return res;
        }
      );
      if (!isNewItem) {
        this.$emit(
          "update:scheduleEvents",
          _.cloneDeep(this.scheduleEventsLocal)
        );
      } else {
        this.editableEventNum = this.scheduleEventsLocal.length - 1;
      }
      this.$v.validationCopyScheduleEventData.$reset();
    },
    cancelEvent() {
      this.editableEventNum = null;
      this.deleteNotSaved();
    },
    deleteСonfirmation() {
      _.set(this.copyScheduleEventData, "startExpression.date", "");
      this.editableEventNum = null;
      this.editableEventNum = null;
      this.dataStates[this.itemIndexForDelete] = "canceled";
      this.scheduleEventsLocal.splice(this.itemIndexForDelete, 1);
      this.$emit("update:scheduleEvents", this.scheduleEventsLocal);
      this.closeModal("deleteEvent");
      this.$v.validationCopyScheduleEventData.$reset();
      this.deleteCopyScheduleEventData();
    },
    catchRunAtTime(newValue, index) {
      this.runAtTime = newValue;
    },
    cancelDiscard() {
      if (this.changedNumber !== -1) {
        this.scheduleEventsLocal = this.scheduleEventsLocal.filter(
          (item, index) =>
            item.scheduleEventData.saved === true ||
            this.dataStates[index] == "changed"
        );
      }
      this.closeModal("dataNotSaveEndSwitchToOtherEvent");
    }
  },
  watch: {
    copyScheduleEventData: {
      handler(newValue) {
        this.$emit("new-copy-schedule-event-data", newValue);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.schedule-events-scope {
  .schedule__calendar {
    padding-left: 20px;
    margin-left: -20px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .schedule__events {
    max-width: 510px;
  }

  .schedule__calendar,
  .schedule__events {
    overflow-y: auto;
    max-height: calc(100vh - 100px);
  }

  .schedule-events {
    &__big-modal {
      display: inline-block;
      & > .ui-modal__wrapper > .ui-modal__container {
        width: 100%;
        height: 100vh;
        max-height: none;
        & .ui-modal__body {
          max-height: none;
        }
      }
    }

    .ui-modal > .ui-modal__wrapper,
    .ui-modal > .ui-modal__wrapper > .ui-modal__container > .ui-modal__body {
      overflow: hidden;
    }

    .ui-modal > .ui-modal__wrapper > .ui-modal__container > .ui-modal__body {
      overflow-x: auto;
    }

    .bold-text {
      color: #0f232e;
      font-size: 14px;
      font-weight: bold;
      line-height: 21px;
    }
  }

  .schedule-event-preview {
    margin-bottom: 20px;
  }

  .schedule {
    &__wr-events-calendar {
      display: flex;
    }
    &__calendar {
      min-width: 950px;
      width: calc(100% - 450px);
      padding-right: 60px;
    }
    &__wr-event-preview {
      width: 100%;
    }
    &__events {
      min-width: 410px;
      width: 100%;
    }
  }
  .add-buttom {
    border: none;
  }
}
</style>