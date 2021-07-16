let maxWidth, maxHeight;
let minWidth = 0;
let minHeight = 0;

// last coordinates
let velocityX = -4;
let velocityY = 4;

let paddleWidth = 16;
let halfHeight = 24;

let lastBounce = [];

export default class Physics {
    constructor(width = 0, height = 0){
        maxWidth = width;
        maxHeight = height;
        this.inPlay = false;
        lastBounce = [width/2, height/2, 90]; // initial trajectory vector (x, y, angle)
    }

    checkPositions(playerOne, playerTwo, ball) {

        //console.log(lastBounce);

        // start the ball
        if (this.inPlay === false){
            this.inPlay = true;
            ball.reset();
            velocityX = -4;
            velocityY = 0;
        }

        //ball wall boundary check and set direction
        // upper
        if((ball.y + 8 + velocityY) >= maxHeight) {
            velocityY = -velocityY; // go the other way
            // storeing x, y
            // lastBounce[2] = calculuateAngle(maxHeight, ball.y)
            lastBounce[0] = maxHeight;
            lastBounce[1] = ball.y;
            console.log(lastBounce);
        }
        // lower
        else if ((ball.y - 8 - velocityY) <= minHeight){
            velocityY = Math.abs(velocityY); // make positive again to go back
        } 

        // check if ball went out behind the paddles
        if((ball.x - 8) > maxWidth) {
            playerOne.scored();
            this.inPlay = false;
        } else if ((ball.x + 8) < minWidth){
            playerTwo.scored();
            this.inPlay = false;
        }

        //checking ball vs paddle hits
            // front of paddle in x
        if ((ball.x - 8) <= (playerOne.x + paddleWidth/2)){
            // top half of paddle
             if (((playerOne.y-halfHeight) < ball.y) && (ball.y < playerOne.y)) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY)-2;
             } 
             // middle of the paddle
             else if (ball.y === playerOne.y) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY);
             }
             // bottm half of paddle
             else if ((playerOne.y < ball.y) && (ball.y < (playerOne.y + halfHeight))) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY)+2;
             }
        }

        // checking ball vs paddle hits CPU/player2
            // front of paddle y
        if ((ball.x + 8) >= playerTwo.x - paddleWidth/2){
            if (((playerTwo.y - halfHeight) < ball.y) && (ball.y < playerTwo.y)) {
                velocityX = -velocityX;
                velocityY = -velocityY -2;
            }
            // midle of the paddle 
            else if (ball.y === playerTwo.y) {
                velocityX = - velocityX;
                velocityY = -Math.abs(velocityY);
             }
            // bottom of the paddle
            if ((playerTwo.y < ball.y) && (ball.y < (playerTwo.y + halfHeight))) {
                velocityX = -velocityX;
                velocityY = -velocityY + 2;
            }

        }

        ball.setVelocity(velocityX, velocityY);
    }

    static calculateAngle() {
        
    }

}