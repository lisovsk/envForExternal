export default function sortTime(times, timeConvector = item => item) {
  return times.sort(
    (a, b) =>
      new Date(`1970/01/01 ${timeConvector(a)}`) -
      new Date(`1970/01/01 ${timeConvector(b)}`)
  );
}
