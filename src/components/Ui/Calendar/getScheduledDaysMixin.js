import _ from 'lodash';
// var later = require('later/later');

import later from 'later';
import moment from 'moment-timezone';

console.log('later', later);
later.date.localTime();

export default {
  data() {
    return { startDate: null };
  },
  // props: {
  //   runAtTime: {
  //     type: Array,
  //     default: () => []
  //   }
  // },
  methods: {
    sortTime(times) {
      return times.sort(
        (a, b) => new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`)
      );
    }
  },
  computed: {
    // runAtTimeComp() {
    //   return this.runAtTime || [];
    // },
    highlightedDates() {
      const resultArr = {};
      []
        .concat(
          this.selectedDays.map(item => {
            console.log('itemitemitem', item);
            // const timeZoneItem = item.timeZone.value;
            let startInterval;
            let endInterval;
            const endDate = !item.isEndTime
              ? moment(`${item.endExpression.date} 23:59:59`)
                  // .tz(`${item.endExpression.date} 23:59:59`, timeZoneItem)
                  // .tz(this.timeZoneCalendar)
                  .format('YYYY-MM-DD HH:mm:ss')
              : undefined;
            console.log('item.endExpression.date', item.endExpression.date);
            console.log('endDateendDate', endDate);
            this.startDate = moment(`${item.startExpression.date} 00:00:00`)
              // .tz(`${item.startExpression.date} 00:00:00`, timeZoneItem)
              // .tz(this.timeZoneCalendar)
              .format('YYYY-MM-DD HH:mm:ss');
            console.log('startDatestartDate', this.startDate);
            console.log('item.startExpression.date', item.startExpression);

            let atDates = [];
            let returnValue = [];
            if (this.state === 'month') {
              startInterval = moment(
                `${this.interval.start}, ${_.get(this.interval, 'year')}`
              );
              endInterval = moment(
                `${this.interval.end}, ${_.get(this.interval, 'year')}`
              );
              console.log('endIntervalendInterval', endInterval);
              if (
                endInterval.format('MM') === '01' &&
                endInterval.format('DD') !== '31'
              ) {
                endInterval.add(1, 'years');
              }
              if (
                startInterval.format('MM') === '12' &&
                startInterval.format('DD') !== '01'
              ) {
                startInterval.subtract(1, 'years');
              }

              startInterval = startInterval.format('YYYY-MM-DD');
              endInterval = endInterval.format('YYYY-MM-DD');
            } else if (this.state === 'year') {
              startInterval = `${_.get(this.interval, 'year')}-01-01`;
              endInterval = moment(`${_.get(this.interval, 'year')}-12-31`)
                .add(7, 'days')
                .format('YYYY-MM-DD');
            }
            // console.log('startIntervalstartInterval', startInterval);
            // console.log('endIntervalendInterval', endInterval);

            if (this.startDate && startInterval !== 'Invalid date') {
              startInterval += ' 00:00:00';
              endInterval += ' 23:59:59';
              console.log('startDate', this.startDate);
              console.log('startInterval', startInterval);
              console.log('endInterval', endInterval);

              const start =
                !this.startDate ||
                moment(startInterval).isSameOrBefore(moment(this.startDate))
                  ? this.startDate
                  : startInterval;
              const end =
                !endDate || moment(endInterval).isSameOrBefore(moment(endDate))
                  ? endInterval
                  : endDate;

              console.log('start', start.replace(' ', 'T'));
              console.log('end', end.replace(' ', 'T'));
              if (item.isReccuring && item.expressions.length > 0) {
                atDates = item.expressions.map(expItem => {
                  const next = later
                    .schedule(later.parse.cron(expItem))
                    // .schedule(
                    //   later.parse.cron(expItem, false, item.timeZone.value)
                    // )
                    .next(
                      Infinity,
                      new Date(start.replace(' ', 'T')),
                      new Date(end.replace(' ', 'T'))
                    );
                  if (!next || !next.length) return [];

                  return next.map(itemConvertTimeZone =>
                    moment
                      .tz(
                        moment(itemConvertTimeZone).format(
                          'YYYY-MM-DD HH:mm:ss'
                        ),
                        item.timeZone.value
                      )
                      .tz(this.timeZoneCalendar)
                  );
                });
                returnValue = {
                  dates: []
                    .concat(
                      ...atDates.map(
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
                                  time: date.format('HH:mm')
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
                  startDate: this.startDate
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

              // if (_.isEmpty(reduceDates))
              //   reduceDates = {
              //     '2018-12-04': ['00:mm']
              //   };

              _.forOwn(reduceDates, (timesValue, dateKey) => {
                console.log('timesValue', timesValue);
                const date = moment(dateKey, 'YYYY-MM-DD');
                // flagLiter = true;
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
            console.log('lighter', item);
            resultArr[date].push({
              color: item.color,
              eventName: item.eventName,
              times: _.get(item, 'recurring', true)
                ? this.sortTime(_.get(datesItemFromArr, 'time', []))
                : this.sortTime(_.get(item, 'times', [])),
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
