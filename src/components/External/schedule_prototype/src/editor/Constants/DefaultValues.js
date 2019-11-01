export default {
    daily : {
        periodMode      : 'EVERY_DAY',
        period          : '1',
        cronExpressions : ''
    },
    weekly : {
        periodMode      : 'each',
        period          : '1',
        cronExpressions : '',
        weekDays        : [
            {
                label : 'Mon',
                value : '1'
            },
            {
                label : 'Tue',
                value : '2'
            },
            {
                label : 'Wed',
                value : '3'
            },
            {
                label : 'Thu',
                value : '4'
            },
            {
                label : 'Fri',
                value : '5'
            },
            {
                label : 'Sat',
                value : '6'
            },
            {
                label : 'Sun',
                value : '0'
            }
        ]
    },
    monthly : {
        selectedMonths  : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        cronExpressions : ''
    },
    yearly : {
        period          : '1',
        cronExpressions : '',
        startYear       : new Date().getFullYear()
    // onThe: false,
    }
};
