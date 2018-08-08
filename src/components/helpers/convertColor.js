const hex2rgb = (c, transparency = 1) => {
    let cSub;
    if (c[0] === '#') cSub = c.substr(1);
    const r = parseInt(cSub.slice(0, 2), 16);
    const g = parseInt(cSub.slice(2, 4), 16);
    const b = parseInt(cSub.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${transparency})`;
}
export default hex2rgb;
