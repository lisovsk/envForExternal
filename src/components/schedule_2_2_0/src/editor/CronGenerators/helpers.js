function generateCrons(times, secondPartOfCrone) {
  const hourMinets = {};
  const minetsHours = {};
  _.forEach(times, item => {
    if (!_.isString(hourMinets[item.HH])) {
      hourMinets[item.HH] = '';
      hourMinets[item.HH] += `${item.mm}`;
    } else {
      hourMinets[item.HH] += `,${item.mm}`;
    }
  });
  _.forEach(hourMinets, (item, key) => {
    if (!_.isString(minetsHours[item])) {
      minetsHours[item] = '';
      minetsHours[item] += `${key}`;
    } else {
      minetsHours[item] += `,${key}`;
    }
  });
  return _.reduce(
    minetsHours,
    (result, key, value) => {
      result.push(`${value} ${key} ${secondPartOfCrone}`);
      return result;
    },
    []
  );
}
function getOrdinalFor(intNum, includeNumber) {
  const o = [, 'st', 'nd', 'rd'];
  return (
    (includeNumber ? intNum : '') +
    (o[((intNum = Math.abs(intNum % 100)) - 20) % 10] || o[intNum] || 'th')
  );
}

export { generateCrons, getOrdinalFor };
