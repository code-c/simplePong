import * as PIXI from "pixi.js";

let style;
let score;

export default class ScoreBoard extends PIXI.Text {
    constructor(playerOne, playerTwo) {
        // score style
        setStyle();
        score = generateString(playerOne, playerTwo);

        super(score, style);
        this.x = 300;
        this.y = 30;
        this.anchor.set(.5,.5)
    
    }

    updateScore(playerOne, playerTwo) {
        score = generateString(playerOne, playerTwo);
        this.text = score;
    }
}

function generateString(playerOne, playerTwo) {
    score = playerOne.score + ' - ' + playerTwo.score;
    return score;
}

function setStyle() {
    style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontWeight: 'bold',
        fill: ['#ffffff'], // gradient
        strokeThickness: 5,
    });
}