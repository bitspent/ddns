tools = require('./helper.js');

/*
 * conway's game of life logic
 */
let conway = {

    FRAME_RATE_MS: 500 // 0.7 second

    , gridWidth: 100 // canvas width 800 / block width

    , gridHeight: 50 // canvas height 400 / block width

    , grid: []

    , colors: []   // hold cell color

    , colorStep: 0 // color cycle index

    , colorSteps: 16 // 16 stepped colors

    , start: function () {

        conway.size = conway.gridWidth * conway.gridHeight;

        console.log('initialization grid size: %s', conway.size);

        for (let i = 0; i < conway.size; i++) {
            conway.grid.push(false);
            conway.colors.push(null);
        }

        conway.nextGeneration();
    },

    /*
     * one step generation
     */
    nextGeneration: function () {
        conway.grid = conway.grid.map(function (item, index) {
            const x = index % conway.gridWidth;
            const y = (index - x) / conway.gridWidth;
            const result = conway.processNeighbours(x, y);
            const neighbours = result[0];
            if (neighbours < 2 || neighbours > 3) {
                conway.colors[index] = null;
                return false;
            }
            else if (neighbours === 2) {
                return item;
            }
            else {
                conway.colors[index] = result[1];
                return true;
            }
        });
        console.log('calculated next generation');
    },

    /**
     * counts the living neighbour cells and calculate the averaging colour
     * @param x
     * @param y
     * @return {[int,color]}
     */
    processNeighbours: function (x, y) {

        let directions = [
            {x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1},
            {x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0}, {x: -1, y: -1}
        ];

        let avg = null;
        let neighbours = 0;

        // 8 neighbours
        for (let i = 0; i < 8; i++) {
            let dir = directions[i];
            let dirX = x + dir.x;
            let dirY = y + dir.y;

            // do the cycle - finite field
            if (dirX === -1) dirX = conway.gridWidth - 1;
            if (dirX === conway.gridWidth) dirX = 0;
            if (dirY === -1) dirY = conway.gridHeight - 1;
            if (dirY === conway.gridHeight) dirY = 0;
            // end cycle checks

            let index = dirX + (dirY * conway.gridWidth);
            neighbours += conway.grid[index] ? 1 : 0;

            // one shot color averaging calculation
            if (conway.grid[index]) {
                if (avg === null) {
                    avg = conway.colors[index];
                } else if (conway.colors[index] !== null) {
                    avg = tools.colorAverage(avg, conway.colors[index]);
                }
            }
        }

        return [neighbours, avg];
    },

    /**
     * seed a cell if the current position is not occupied by a living cell
     * @param index the position
     * @param color cell color
     * @return {number} 1 if seeded, 0 if position is not available
     */
    addCell: function (index, color) {

        // the cell should not be living
        if (conway.grid[index] === true || conway.colors[index] !== null) {
            console.log('cell already living');
            return 0;
        }

        // add the living cell
        conway.grid[index] = true;
        conway.colors[index] = color;

        console.log('created new cell [' + index + '] with color ' + conway.colors[index]);

        // return the cell color
        return 1;
    },

    /**
     * runs the cells life at 1 STEP per SECOND
     */
    loop: function () {
        conway.nextGeneration();
        setTimeout(conway.loop, conway.FRAME_RATE_MS);
    },

    /**
     * return a next random colour to use
     */
    nextColor: function () {
        conway.colorStep = (conway.colorStep + 1) % conway.colorSteps;
        return tools.colorNext(conway.colorSteps, conway.colorStep);
    }
};

module.exports = {
    game: conway
};