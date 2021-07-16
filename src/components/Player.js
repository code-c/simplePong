/* Player.js
author: Codie Cottrell
*/
import * as PIXI from "pixi.js";
import paddleIMG from './images/paddle.png';

let speed = 5;
let paddle;
let lowerBound, upperBound;

export default class Player extends PIXI.Sprite {
    constructor(xStart = 0, yStart = 0, lower, upper) {
        // like PIXI.texture.from to create sprite from texture
        createPaddle();
        //work with it set values
        super(paddle);
        this.loop = false;
        this.y = yStart;
        this.x = xStart;
        this.anchor.set(0.5, 0.5);
        this.scale.x = 2;
        this.scale.y = 2;
        lowerBound = lower;
        upperBound = upper;
        this.moving = false;
        this.score = 0;
    }


    moveUp() {
        if ((this.y - speed) >= lowerBound){
            this.y -= speed;
        }
    }

    // using 48 since the image is 24 pixels high and is scaled 2x
    moveDown() {
        if ((this.y + 48 + speed) <= upperBound){ 
            this.y += speed;
        }
    }

    scored() {
        this.score += 1;
    }
    
}

//set the image as the player
function createPaddle() {
    paddle = new PIXI.Texture.from(paddleIMG);
}