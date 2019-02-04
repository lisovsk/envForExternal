import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';
import moment from 'moment';

import OneMonthCalendar from './OneMonthCalendar.vue';
import OneYearCalendar from './OneYearCalendar.vue';
import Calendar from './Calendar.vue';

storiesOf('Calendar', module)
  .add('One month component', () => ({
    data() {
      return {
        value: ''
      };
    },
    methods: {},
    components: {
      OneMonthCalendar
    },
    template: `
    <div>
        <one-month-calendar
            :year="2018"
            :month="1" 
        >
        </one-month-calendar>
    </div>
  `
  }))
  .add('One year component', () => ({
    data() {
      return {
        value: ''
      };
    },
    methods: {},
    components: { OneYearCalendar },
    template: `
    <div>
        <one-year-calendar
        :year="2017"
        >
        </one-year-calendar>
    </div>
  `
  }))
  .add('Calendar with controls', () => ({
    data() {
      return {
        value: ''
      };
    },
    methods: {},
    components: { Calendar },
    template: `
    <div>
        <calendar
          :month="1"
        >
        </calendar>
    </div>
  `
  }))
  .add('Calendar with events', () => ({
    data() {
      return {
        value: '',
        startDays: [
          {
            color: '#FF9800',
            expressions: ['-1,0,1 0 3 11 * 2018'],
            isReccuring: false,
            endExpression: {
              time: '23:59',
              date: ''
            },
            startExpression: {
              time: '00:00',
              date: '2018-11-03'
            },
            isEndTime: false,
            eventName: 'asd',
            times: [
              {
                start: {
                  HH: '00',
                  mm: '00'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false,
                vforkey: '5afe40f5-7e49-4b20-a4e6-0ff20bb9d857'
              },
              {
                vforkey: '32f9055a-1348-4d52-86ab-4585e434349a',
                start: {
                  HH: '00',
                  mm: '01'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false
              }
            ],
            runAtTime: [
              {
                HH: 0,
                mm: 0
              },
              {
                HH: 0,
                mm: 1
              }
            ],
            timeZone: {
              label: 'Europe/Kiev',
              value: 'Europe/Kiev'
            },
            date: {
              day: 3,
              month: 11,
              year: 2018
            }
          },
          {
            color: '#E91E63',
            expressions: ['-1,0,1 1 29 11 * 2018'],
            isReccuring: false,
            endExpression: {
              time: '23:59',
              date: ''
            },
            startExpression: {
              time: '00:00',
              date: '2018-11-29'
            },
            isEndTime: false,
            eventName: 'sd',
            times: [
              {
                start: {
                  HH: '01',
                  mm: '00'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false,
                vforkey: '13ab3f02-de8d-41be-9ae3-ac8f760bc5aa'
              },
              {
                vforkey: '66077125-1917-4e07-b19c-7249a8025683',
                start: {
                  HH: '01',
                  mm: '01'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false
              }
            ],
            runAtTime: [
              {
                HH: 1,
                mm: 0
              },
              {
                HH: 1,
                mm: 1
              }
            ],
            timeZone: {
              label: 'Europe/Kiev',
              value: 'Europe/Kiev'
            },
            date: {
              day: 29,
              month: 11,
              year: 2018
            }
          },
          {
            color: '#CDDC39',
            expressions: ['0 0 1/1 * ? *', '1 0 1/1 * ? *'],
            isReccuring: true,
            endExpression: {
              time: '23:59',
              date: '2018-11-24'
            },
            startExpression: {
              time: '00:00',
              date: '2018-11-02'
            },
            isEndTime: false,
            eventName: 'ыва',
            times: [
              {
                start: {
                  HH: '00',
                  mm: '00'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false,
                vforkey: 'c6fe10c2-0ca1-4988-85ce-b13f14380c9d'
              },
              {
                vforkey: '7a92708e-6cb6-4496-9b16-12e4e6d66242',
                start: {
                  HH: '00',
                  mm: '00'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false
              },
              {
                vforkey: 'b233e49d-de10-47ff-b813-6e58997a7796',
                start: {
                  HH: '00',
                  mm: '01'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false
              }
            ],
            runAtTime: [
              {
                HH: 0,
                mm: 0
              },
              {
                HH: 0,
                mm: 1
              }
            ],
            timeZone: {
              value: 'Europe/Gibraltar',
              label: 'Europe/Gibraltar'
            },
            date: {
              day: 2,
              month: 11,
              year: 2018
            }
          },
          {
            color: '#00BCD4',
            expressions: ['-1,0,1 0 31 10 * 2018'],
            isReccuring: false,
            endExpression: {
              time: '23:59',
              date: ''
            },
            startExpression: {
              time: '00:00',
              date: '2018-10-31'
            },
            isEndTime: false,
            eventName: 'sd',
            times: [
              {
                start: {
                  HH: '00',
                  mm: '00'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false,
                vforkey: '1a9b4dfc-699d-44e9-8a0c-7d40111320ad'
              },
              {
                vforkey: 'dba2f29a-91a5-413e-b2e7-0705ccfadd0f',
                start: {
                  HH: '00',
                  mm: '01'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false
              }
            ],
            runAtTime: [
              {
                HH: 0,
                mm: 0
              },
              {
                HH: 0,
                mm: 1
              }
            ],
            timeZone: {
              label: 'Europe/Kiev',
              value: 'Europe/Kiev'
            },
            date: {
              day: 31,
              month: 10,
              year: 2018
            }
          },
          {
            color: '#FF9800',
            expressions: ['-1,0 0 12 11 * 2018', '-1,0 1 12 11 * 2018'],
            isReccuring: false,
            endExpression: {
              time: '23:59',
              date: ''
            },
            startExpression: {
              time: '00:00',
              date: '2018-11-12'
            },
            isEndTime: false,
            eventName: 'sd',
            times: [
              {
                start: {
                  HH: '00',
                  mm: '00'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false,
                vforkey: '3369d24c-7f57-4fba-ba3f-bc1fa0340ae8'
              },
              {
                vforkey: '3601fcdd-3433-403c-ba8f-56f5eb93766b',
                start: {
                  HH: '01',
                  mm: '00'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false
              }
            ],
            runAtTime: [
              {
                HH: 0,
                mm: 0
              },
              {
                HH: 1,
                mm: 0
              }
            ],
            timeZone: {
              value: 'Europe/Dublin',
              label: 'Europe/Dublin'
            },
            date: {
              day: 12,
              month: 11,
              year: 2018
            }
          },
          {
            color: '#8BC34A',
            expressions: ['-1,35 2 30 11 * 2018'],
            isReccuring: false,
            endExpression: {
              time: '23:59',
              date: ''
            },
            startExpression: {
              time: '00:00',
              date: '2018-11-30'
            },
            isEndTime: false,
            eventName: 'івівфісіфвфвфвфsddsd',
            times: [
              {
                start: {
                  HH: '02',
                  mm: '35'
                },
                end: {
                  HH: '',
                  mm: ''
                },
                every: {
                  val: 10,
                  units: 'mm'
                },
                endTime: false,
                vforkey: '599539b4-9901-4215-87f8-f8ec08574c4d'
              }
            ],
            runAtTime: [
              {
                HH: 2,
                mm: 35
              }
            ],
            timeZone: {
              value: 'Etc/GMT+12',
              label: 'Etc/GMT+12'
            },
            date: {
              day: 30,
              month: 11,
              year: 2018
            }
          }
        ]
      };
    },
    methods: {
      changeSelectedDate(day, month, year) {
        this.copyScheduleEventData.startExpression.date = moment(
          `${year}-${month}-${day}`,
          'YYYY-MM-DD'
        ).format('YYYY-MM-DD');
      }
    },
    components: {
      OneMonthCalendar,
      Calendar
    },
    template: `
  <calendar
    :month="1"
    :editable="false"
    :selected-days="startDays"
    :hide-time-zone="true"
    
  >
  </calendar>
    `
  }));
