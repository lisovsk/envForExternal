function createEveryHourIntervals(from, until, every, units = 'Minutes') {
  const untilDate = Date.parse(`01/01/2001  ${until}`);
  const fromDate = Date.parse(`01/01/2001  ${from}`);
  let everyInt = parseInt(every, 10);

  if (units === 'Hours') {
    everyInt *= 60;
  }

  const diffFromUntil = untilDate - fromDate;
  if (diffFromUntil < 0) return [];

  const max = Math.abs(diffFromUntil) / (60 * 60 * 1000) * (60 / everyInt);

  const time = new Date(fromDate);
  const intervals = [];

  for (let i = 0; i <= max; i += 1) {
    intervals.push({
      HH: time.getHours(),
      mm: time.getMinutes()
    });
    time.setMinutes(time.getMinutes() + everyInt);
  }
  return intervals;
}
export default createEveryHourIntervals;
