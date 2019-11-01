import later from 'later';
import moment from 'moment-timezone';

later.date.localTime();

function getLounchesFomCrons(
  crons,
  startDate,
  endDate,
  fromTimeZone,
  toTimeZone,
  count = Infinity
) {
  const startDateLocal = moment(startDate);
  const endDateLocal = moment(endDate);

  return crons.map(expItem => {
    const next = later
      .schedule(later.parse.cron(expItem))
      .next(
        count,
        new Date(startDateLocal.format('YYYY-MM-DDTHH:mm:ss')),
        new Date(endDateLocal.format('YYYY-MM-DDTHH:mm:ss'))
      );

    if (!next || !next.length) return [];

    return next.map(itemConvertTimeZone =>
      moment
        .tz(
          moment(itemConvertTimeZone).format('YYYY-MM-DDTHH:mm:ss'),
          fromTimeZone
        )
        .tz(toTimeZone)
    );
  });
}

function getTimeLounchesFomCrons(
  crons,
  startDate,
  endDate,
  fromTimeZone,
  toTimeZone,
  count = Infinity
) {
  const startDateLocal = moment(startDate);
  const endDateLocal = moment(endDate);

  const prevStartDateLocal = moment(startDate)
    .subtract(1, 'days')
    .format('YYYY-MM-DD');
  const nextEndDateLocal = moment(endDate)
    .add(1, 'days')
    .format('YYYY-MM-DD');

  // later.parse shows a maximum of 1000 next launches
  let result = [].concat(
    getLounchesFomCrons(
      crons,
      startDateLocal,
      endDateLocal,
      fromTimeZone,
      toTimeZone,
      count
    ),
    getLounchesFomCrons(
      crons,
      `${prevStartDateLocal} 00:00:00`,
      `${prevStartDateLocal} 23:59:59`,
      fromTimeZone,
      toTimeZone,
      count
    ),
    getLounchesFomCrons(
      crons,
      `${nextEndDateLocal} 00:00:00`,
      `${nextEndDateLocal} 23:59:59`,
      fromTimeZone,
      toTimeZone,
      count
    )
  );

  result = result.map(item =>
    item.filter(
      date =>
        new Date(moment(startDate).format('YYYY-MM-DDTHH:mm:ss')) <=
          new Date(date.format('YYYY-MM-DDTHH:mm:ss')) &&
        new Date(moment(endDate).format('YYYY-MM-DDTHH:mm:ss')) >=
          new Date(date.format('YYYY-MM-DDTHH:mm:ss'))
    )
  );

  return result;
}

export { getLounchesFomCrons, getTimeLounchesFomCrons };
