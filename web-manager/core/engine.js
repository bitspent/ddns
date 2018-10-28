game = require('./conway.js').game;

/*
 * process raw incoming message
 */
function processMessage(message) {
    if (message === 'nextColor') {
        return getNextColor();
    } else if (message === 'world') {
        return getWorldState();
    } else if (message.startsWith('seed')) {
        let params = message.split(' '); // seed 23 #ccffff
        let index = params[1];
        let color = params[2];
        if (isNaN(index)) {
            return 'seed invalid operation';
        } else {
            let count = game.addCell(index, color);
            return `seed ${count === 0 ? 'cell already alive' : 'seed ok'} `;
        }
    }
}

/*
 * get the next random color
 */
function getNextColor() {
    let nextColor = game.nextColor();
    console.log('next color %s', nextColor);
    return nextColor;
}

/*
 * get the world cells data
 */
function getWorldState() {
    let world = {
        width: game.gridWidth,
        height: game.gridHeight,
        cells: game.grid,
        colors: game.colors
    };
    return JSON.stringify(world);
}

/*
 * keep the world running
 */
function runWorld() {
    game.start();
    game.loop();
}

module.exports = {
    runWorld: runWorld,
    processMessage: processMessage
};