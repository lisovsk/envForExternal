<template>
  <div
    :class="['schedule-event-preview', {'schedule-event-preview_invalid': invalid, 'schedule-event-preview_will-be--no-start': !this.isWillBeStart}, ]"
    @click="doEditable"
  >
    <template v-if="!invalid">
      <span class="schedule-event-preview__circle" :style="{background: color}"></span>
      <div class="schedule-event-preview__content">
        <div class="schedule-event-preview__title-text">{{eventName || 'No Name'}}</div>
        <div class="schedule-event-preview__dates" v-if="isWillBeStart">
          <span
            :key="index"
            v-for="(date, index) in startsAt || []"
            :class="{
                  'bold-text': !!(index === 0)
                }"
            v-if="conditionalStartsAt(index)"
          >
            {{date}}
            <span
              v-if="startsAt && index !== startsAt.length - 1 && !conditionalEllipsisForDate(index)"
            >,</span>
            <span v-if="conditionalEllipsisForDate(index)">...</span>
          </span>
          
          <span
            class="schedule-event-preview__see-more"
            @click.stop="seeMoreDates"
            v-if="conditionalSeeMoreDates"
          >see more</span>
          <span
            v-if="moreDates && startsAt.length > 3"
            @click.stop="seeLessDates"
            class="schedule-event-preview__see-more"
          >see less</span>
        </div>
        <div v-else class="error-text schedule-event-preview__dates">Here will be no launches</div>
        <span class="bold-text">{{timeZone}}</span>
        <div class="schedule-event-preview__times">
          <span
            :key="time.id"
            v-for="(time, index) in startTimes"
            v-if="conditionalStartTimes(index)"
          >
            <span v-html="`<span class='bold-text'>${time.start.HH}:${time.start.mm}</span>`"></span>
            <span
              v-html="time.endTime ? ` to  <span class='bold-text'>${time.end.HH}:${time.end.mm}</span> every <span class='bold-text'>${parseInt(time.every.val)} ${time.every.units === 'mm' ? 'min' : 'h'}</span>`: ''"
            ></span>
            <span v-if="conditionalTimeСomma(index)">,</span>
          </span>
          <span v-if="conditionalEllipsisForTimes">...</span>
          <span
            class="schedule-event-preview__see-more"
            @click.stop="seeMoreTimes"
            v-if="conditionalSeeMoreTimes"
          >see more</span>
          <span
            class="schedule-event-preview__see-more"
            @click.stop="seeLessTimes"
            v-if="moreTimes && startTimes.length > 3"
          >see less</span>
        </div>
        <div class="schedule-event-preview__end-date" v-html="endDateComp"></div>
        <div v-if="isReccuring" v-html="previewTexts.reccuring"></div>
      </div>
    </template>
    <template v-else>The event was created with an error.</template>
    <div @click.stop="/**/">
      <or-icon-button
        icon="more_vert"
        size="normal"
        :class="{'schedule-event-preview__settings_hide': editable}"
        class="schedule-event-preview__settings"
        @click="doMenuVisible"
        :id="index"
      ></or-icon-button>
      <or-menu
        contain-focus
        has-icons
        :options="menuOptions"
        @select="selectOption"
        class="schedule-event-preview__menu"
        :class="{'schedule-event-preview__is-visible': !isMenuVisible}"
      ></or-menu>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import later from "later";
import _ from "lodash";
import uuid from "uuid";

export default {
  created() {
    document.body.addEventListener("click", () => {
      this.isMenuVisible = false;
    });
  },
  data() {
    return {
      currentDay: moment().format("YYYY-MM-DD"),
      countAtDates: 16,
      moreDates: false,
      moreTimes: false,
      ref: uuid.v4(),
      menuOptions: [
        {
          label: "Edit",
          icon: "edit",
          id: "edit"
        },
        {
          label: "Copy",
          icon: "description",
          id: "copy"
        },
        {
          label: "Delete",
          icon: "delete_forever",
          id: "delete"
        }
      ],
      isMenuVisible: false
    };
  },
  props: {
    index: {
      type: Number
    },
    color: {
      type: String,
      default: null
    },
    eventName: {
      type: String,
      default: null
    },
    previewTexts: {
      type: Object,
      default: () => ({
        reccuring: ""
      })
    },
    startTimes: {
      type: Array,
      default: () => []
    },
    endDate: {
      type: Object,
      default: null
    },
    startDate: {
      type: String,
      default: ""
    },
    isReccuring: {
      type: Boolean,
      default: false
    },
    expressions: {
      type: Array,
      default: () => []
    },
    invalid: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    timeZone: {
      type: String,
      default: ""
    }
  },
  methods: {
    doEditable() {
      this.$emit("do-editable", this.index);
    },
    seeMoreDates() {
      this.moreDates = true;
    },
    seeLessDates() {
      this.moreDates = false;
    },
    seeMoreTimes() {
      this.moreTimes = true;
    },
    seeLessTimes() {
      this.moreTimes = false;
    },
    selectOption(item) {
      switch (item.id) {
        case "edit":
          this.doEditable();
          break;
        case "copy":
          this.$emit("copy-event", this.index);
          break;
        case "delete":
          this.$emit("delete-event", this.index);
          break;
        default:
          throw new function UserException() {
            this.message = `Unexpected item.id(${item.id}) in selectOption`;
            this.name = "UnexpectedId";
          }();
      }
      document.body.click();
    },
    conditionalStartsAt(index) {
      return !!(index < this.countAtDates && (index < 3 || this.moreDates));
    },
    conditionalEllipsisForDate(index) {
      return (
        index >= this.countAtDates - 1 ||
        (this.startsAt &&
          index === 2 &&
          !this.moreDates &&
          this.startsAt.length > 3)
      );
    },
    conditionalStartTimes(index) {
      return index < 3 || this.moreTimes;
    },
    conditionalTimeСomma(index) {
      return !this.moreTimes
        ? index !== 2 && index !== this.startTimes.length - 1
        : index !== this.startTimes.length - 1;
    },
    getRef() {
      return `menu${this.index}`;
    },
    doMenuVisible() {
      document.body.click();
      this.isMenuVisible = true;
    },
    doMenuUnvisible() {
      this.isMenuVisible = false;
    }
  },
  computed: {
    endDateComp() {
      if (!this.isReccuring) return "";
      return _.get(this, "endDate.noEnd")
        ? 'Recurring <span class="bold-text">no end</span>'
        : `Recurring till <span class="bold-text">${moment(
            _.get(this, "endDate.date")
          ).format("ll")}</span>`;
    },
    startsAt() {
      try {
        const startDate = new Date(
          `${moment(this.startDate).format("YYYY-MM-DD")} 00:00`
        );
        const endDate = this.endDate.noEnd
          ? undefined
          : new Date(`${moment(this.endDate.date).format("YYYY-MM-DD")} 23:59`);
        const result = [].concat // eslint-disable-line
          .apply(
            [],
            this.expressions.map(item =>
              later
                .schedule(later.parse.cron(item))
                .next(this.countAtDates + 1, startDate, endDate)
            )
          )
          .filter(
            item =>
              moment(item, "YYYY-MM-DD", true).isValid() &&
              moment().isBefore(moment.tz(item, this.timeZone), "second")
          )
          .map(item => moment(item).format("L"));

        return _.uniq(result);
      } catch (e) {
        return [];
      }
    },
    conditionalSeeMoreTimes() {
      return !this.moreTimes && this.startTimes.length > 3;
    },
    conditionalSeeMoreDates() {
      return !this.moreDates && this.startsAt.length > 3;
    },
    conditionalEllipsisForTimes() {
      return !this.moreTimes && this.startTimes.length > 3;
    },
    isWillBeStart() {
      // console.log("startsAt", this.startsAt);
      return !!this.startsAt.length;
    }
  }
};
</script>

<style lang="scss">
.schedule-event-preview {
  .ui-icon-button--type-primary.ui-icon-button--color-default {
    &:hover {
      background-color: inherit;
    }
    background-color: inherit;
  }
}
</style>
<style lang="scss" scoped>
.schedule-event-preview {
  background-color: #fafafa;
  width: 100%;
  padding: 32px 60px 32px 16px;
  display: flex;
  font-size: 14px;
  color: #0f232e;
  line-height: 21px;
  cursor: pointer;
  position: relative;

  &_invalid {
    border: 2px solid #f95d5d;
    color: #f95d5d;
    font-size: 16px;

    .schedule-event-preview__settings {
      top: 25px;
    }
  }

  &_will-be--no-start {
    border: 2px solid #f95d5d;
  }

  &__settings {
    position: absolute;
    right: 25px;
    &_hide {
      display: none;
    }
  }

  &__menu {
    position: absolute;
    height: 130px;
    right: 25px;
    top: 70px;
  }

  &__title-text {
    word-break: break-all;
    font-weight: bold;
    padding-bottom: 15px;
  }

  &__circle {
    content: "";
    width: 20px;
    min-width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 50%;
  }

  &__dates {
    padding-bottom: 18px;
  }

  &__end-date {
    padding-bottom: 12px;
    &:empty {
      padding-bottom: 0;
    }
  }

  &__see-more {
    color: #64b2da;
    cursor: pointer;
    white-space: nowrap;
  }

  &__times {
    padding-bottom: 18px;
  }

  &__content {
    padding-left: 16px;
  }

  &__is-visible {
    display: none;
  }
  .error-text {
    color: #f95d5d;
    font-weight: bold;
  }
}
</style>
