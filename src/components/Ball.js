/* Player.js
author: Codie Cottrell
*/
import * as PIXI from "pixi.js";
import ballIMG from './images/ball.png';

let startSpeed = 3;
let ball;
let ballWidth = 16;
let initX, initY;

export default class Player extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        // like PIXI.texture.from to create sprite from texture
        createBall();
        //work with it set values
        super(ball);
        this.loop = false;
        this.y = y;
        initY = y;
        this.x = x;
        initX = x;
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
function createBall() {
    ball = new PIXI.Texture.from(ballIMG);
}