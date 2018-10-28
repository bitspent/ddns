/*
 * generic helper
 */
const helper = {
    /*
     * shorten string
     */
    shorten: (msg, len) => {
        let m = msg + '';
        let l = len || 50;
        return m.length > l ? m.substring(0, l - 1) + '...' : m;
    },

    /*
     * wss url
     */
    wssURL: () => {
        return `${location.protocol.replace('http', 'ws')}//${location.hostname}:${location.port}`;
    }
};