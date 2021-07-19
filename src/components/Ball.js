/* Player.js
author: Codie Cottrell
*/
import * as PIXI from "pixi.js";
import ballIMG from './images/ball.png';

let ball;
let initX, initY;

export default class Player extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        // like PIXI.texture.from to create sprite from texture
        loadBall();
        //work with it set values
        super(ball);
        this.loop = false;
        this.y = y;
        initY = y;
        this.x = x;
        initX = x;
        this.anchor.set(0.5, 0.5)
        this.scale.x = 2;
        this.scale.y = 2;

        this.velocityX = 0;
        this.velocityY = 0;
        
    }

    reset() {
        this.x = initX;
        this.y = initY;
    }

    move() {
        this.y += this.velocityY;
        this.x += this.velocityX;
    }

    setVelocity(x,y) {
        this.velocityX = x;
        this.velocityY = y;
    }
}

//set the image as the player
function loadBall() {
    ball = new PIXI.Texture.from(ballIMG);
}