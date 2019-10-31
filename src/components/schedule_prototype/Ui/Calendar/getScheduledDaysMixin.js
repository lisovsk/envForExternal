// var later = require('later/later');

import later from 'later';
import moment from 'moment-timezone';
import sortTime from '../../helpers/sortTime.js';
import { getLounchesFomCrons } from './helpers/getLounchesFomCrons.js';

later.date.localTime();

export default {
  created() {
    // console.log('selectedDays', this.selectedDays);
  },
  data() {
    return { startDate: null };
  },
  watch: {
    // highlightedDates(highlightedDates) {
    //   // console.log('highlightedDates', highlightedDates);
    // }
  },
  methods: {
    finalStartDate(startExpressionDate) {
      let startInterval;
      this.startDate = moment(`${startExpressionDate} 00:00:00`).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      if (this.state === 'month') {
        startInterval = moment(
          `${this.interval.start}, ${_.get(this.interval, 'year')}`
        );
        if (
          startInterval.format('MM') === '12' &&
          startInterval.format('DD') !== '01'
        ) {
          startInterval.subtract(1, 'years');
        }

        startInterval = startInterval.format('YYYY-MM-DD');
      } else if (this.state === 'year') {
        startInterval = `${_.get(this.interval, 'year')}-01-01`;
      }

      if (startInterval === 'Invalid date') return null;
      startInterval += ' 00:00:00';

      return !this.startDate ||
        moment(startInterval).isSameOrBefore(moment(this.startDate))
        ? this.startDate
        : startInterval;
    },

    finalEndDate(endExpressionDate, isEndTime) {
      let endInterval;
      let endDate;
      if (this.state === 'month') {
        endDate = !isEndTime
          ? moment(`${endExpressionDate} 23:59:59`).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : undefined;
        endInterval = moment(
          `${this.interval.end}, ${_.get(this.interval, 'year')}`
        );
        if (
          endInterval.format('MM') === '01' &&
          endInterval.format('DD') !== '31'
        ) {
          endInterval.add(1, 'years');
        }
        endInterval = endInterval.format('YYYY-MM-DD');
      } else if (this.state === 'year') {
        endInterval = moment(`${_.get(this.interval, 'year')}-12-31`)
          .add(7, 'days')
          .format('YYYY-MM-DD');
      }
      endInterval += ' 23:59:59';
      return !endDate || moment(endInterval).isSameOrBefore(moment(endDate))
        ? endInterval
        : endDate;
    }
  },
  computed: {
    highlightedDates() {
      const resultArr = {};
      []
        .concat(
          this.selectedDays.map(item => {
            let dateOflaunhces = [];
            let returnValue = [];

            const finalEndDate = this.finalEndDate(
              _.get(item, 'endExpression.date'),
              item.isEndTime
            );
            const finalStartDate = this.finalStartDate(
              item.startExpression.date
            );

            if (this.startDate && finalStartDate) {
              if (item.isReccuring && item.expressions.length > 0) {
                const partOfCron = item.expressions[0].split(' ');
                const cronDayOfMonth = partOfCron[2];
                const cronMonth = partOfCron[3];
                const cronDayOfWeeks = partOfCron[4];
                const cronYear = partOfCron[5];

                const runAtTimeLength = item.runAtTime.length - 1;
                const cronFirstLaunchTime = `${item.runAtTime[0].mm} ${
                  item.runAtTime[0].HH
                } ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeeks} ${cronYear}`;
                const cronLastLaunchTime = `${
                  item.runAtTime[runAtTimeLength].mm
                } ${
                  item.runAtTime[runAtTimeLength].HH
                } ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeeks} ${cronYear}`;

                const expressions =
                  runAtTimeLength > 1
                    ? [cronFirstLaunchTime, cronLastLaunchTime]
                    : [cronFirstLaunchTime];

                dateOflaunhces = getLounchesFomCrons(
                  expressions,
                  finalStartDate,
                  finalEndDate,
                  item.timeZone.value,
                  this.timeZoneCalendar
                );
                // console.log('dateOflaunhces', dateOflaunhces);

                returnValue = {
                  dates: []
                    .concat(
                      ...dateOflaunhces.map(
                        itemExprs =>
                          itemExprs
                            ? itemExprs.map(itemExpr => {
                                const date = moment(itemExpr);
                                return {
                                  date: {
                                    year: parseInt(date.format('YYYY'), 10),
                                    month: parseInt(date.format('MM'), 10),
                                    day: parseInt(date.format('DD'), 10)
                                  },
                                  time: date.format('HH:mm'),
                                  // runAtTime: item.runAtTime
                                  expressions: item.expressions,
                                  timeZone: item.timeZone
                                };
                              })
                            : {
                                year: null,
                                month: null,
                                day: null
                              }
                      )
                    )
                    .reduce((res, cur) => {
                      const index = _.findIndex(
                        res,
                        itemFilter =>
                          _.get(itemFilter, 'date.year') ===
                            _.get(cur, 'date.year') &&
                          _.get(itemFilter, 'date.month') ===
                            _.get(cur, 'date.month') &&
                          _.get(itemFilter, 'date.day') ===
                            _.get(cur, 'date.day')
                      );
                      if (index === -1) {
                        res.push({
                          date: {
                            year: _.get(cur, 'date.year'),
                            month: _.get(cur, 'date.month'),
                            day: _.get(cur, 'date.day')
                          },
                          time: [cur.time]
                        });
                      } else {
                        res[index].time.push(cur.time);
                      }
                      return res;
                    }, []),
                  color: item.color,
                  eventName: item.eventName,
                  startDate: this.startDate,
                  // runAtTime: item.runAtTime
                  expressions: item.expressions,
                  timeZone: item.timeZone
                };
              } else {
                returnValue = null;
              }
            }
            return returnValue;
          }),
          this.selectedDays
            .filter(item => !item.isReccuring)
            .reduce((allItemSelectedDays, itemSelectedDays) => {
              const times = _.get(itemSelectedDays, 'runAtTime', []).map(
                item =>
                  `${moment(`${item.HH}:${item.mm}`, 'HH:mm').format('HH:mm')}`
              );

              const reduceDates = times.reduce((obj, currentTime) => {
                const currentDate = moment
                  .tz(
                    `${itemSelectedDays.startExpression.date} ${currentTime}`,
                    itemSelectedDays.timeZone.value
                  )
                  .tz(this.timeZoneCalendar);

                if (!obj[currentDate.format('YYYY-MM-DD')])
                  obj[currentDate.format('YYYY-MM-DD')] = [];

                obj[currentDate.format('YYYY-MM-DD')].push(
                  currentDate.format('HH:mm')
                );
                return obj;
              }, {});

              _.forOwn(reduceDates, (timesValue, dateKey) => {
                const date = moment(dateKey, 'YYYY-MM-DD');
                allItemSelectedDays.push({
                  dates: [
                    {
                      date: {
                        day: parseInt(date.format('DD'), 10),
                        month: parseInt(date.format('MM'), 10),
                        year: parseInt(date.format('YYYY'), 10)
                      }
                    }
                  ],
                  color: itemSelectedDays.color,
                  times: timesValue,
                  eventName: itemSelectedDays.eventName,
                  // runAtTime: itemSelectedDays.runAtTime,
                  expressions: itemSelectedDays.expressions,
                  timeZone: itemSelectedDays.timeZone,
                  recurring: false,
                  lighter: false,
                  startDate: this.startDate
                });
              });

              return allItemSelectedDays;
            }, [])
        )
        .forEach(item => {
          if (!item || !item.dates) return;
          item.dates.forEach(datesItemFromArr => {
            const datesItem = datesItemFromArr.date;
            if (
              !_.isArray(
                resultArr[
                  `${_.get(datesItem, 'year')}-${datesItem.month}-${
                    datesItem.day
                  }`
                ]
              )
            ) {
              resultArr[
                `${_.get(datesItem, 'year')}-${datesItem.month}-${
                  datesItem.day
                }`
              ] = [];
            }
            const date = `${_.get(datesItem, 'year')}-${datesItem.month}-${
              datesItem.day
            }`;
            const lighter = !_.get(item, 'lighter', true)
              ? false
              : moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD') !==
                moment(item.startDate, 'YYYY-MM-DD HH:mm:ss').format(
                  'YYYY-MM-DD'
                );
            resultArr[date].push({
              color: item.color,
              eventName: item.eventName,
              // runAtTime: item.runAtTime,
              expressions: item.expressions,
              timeZone: item.timeZone,
              times: _.get(item, 'recurring', true)
                ? sortTime(_.get(datesItemFromArr, 'time', []))
                : sortTime(_.get(item, 'times', [])),
              lighter
            });
          });
        });

      Object.keys(resultArr).map(key => {
        resultArr[key] = resultArr[key].sort(
          (a, b) => a.eventName > b.eventName
        );
        return undefined;
      });

      return resultArr;
    }
  }
};
