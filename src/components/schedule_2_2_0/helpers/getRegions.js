import moment from 'moment-timezone';

export default function getRegions () {
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
        .filter(zone => zone.indexOf('/') >= 0 && zone.indexOf('Etc/GMT') === -1)
        .sort()
        .map(value => ({label : value, value}))
        .value();
}
