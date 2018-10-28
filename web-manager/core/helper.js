// colors averaging
// 2 character hex number for an RGB color value
// e.g. #3f33c6
// Returns the average as a hex number without leading #
const colorAverage = (function () {

    // Keep helper stuff in closures
    const reSegment = /[\da-z]{2}/gi;

    return function (c1, c2) {
        // Split into parts
        const b1 = c1.substring(1).match(reSegment);
        const b2 = c2.substring(1).match(reSegment);
        let t, c = [];
        // Average each set of hex numbers going via dec
        // always rounds down
        for (let i = b1.length; i;) {
            t = ((parseInt(b1[--i], 16) + parseInt(b2[i], 16)) >> 1).toString(16);
            // Add leading zero if only one character
            c[i] = t.length === 2 ? '' + t : '0' + t;
        }
        return '#' + c.join('');
    }
}());

const colorNext = function (numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering).
    // This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from:
    // http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    const h = step / numOfSteps;
    const i = ~~(h * 6);
    const f = h * 6 - i;
    const q = 1 - f;
    switch (i % 6) {
        case 0:
            r = 1;
            g = f;
            b = 0;
            break;
        case 1:
            r = q;
            g = 1;
            b = 0;
            break;
        case 2:
            r = 0;
            g = 1;
            b = f;
            break;
        case 3:
            r = 0;
            g = q;
            b = 1;
            break;
        case 4:
            r = f;
            g = 0;
            b = 1;
            break;
        case 5:
            r = 1;
            g = 0;
            b = q;
            break;
    }
    return "#"
        + ("00" + (~~(r * 255)).toString(16)).slice(-2)
        + ("00" + (~~(g * 255)).toString(16)).slice(-2)
        + ("00" + (~~(b * 255)).toString(16)).slice(-2);
};


const shorten = function (m) {
    m += '';
    if (m.length > 50)
        return m.substring(0, 49) + '...';
    return m;
};


module.exports = {
    colorNext: colorNext,
    colorAverage: colorAverage,
    shorten: shorten
};