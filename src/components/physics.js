let maxWidth, maxHeight;
let minWidth = 0;
let minHeight = 0;

// last coordinates
let xZero, yZero;
let velocityX = -4;
let velocityY = 4;

let paddleWidth = 16;
let paddleHeight = 48;

export default class Physics {
    constructor(width = 0, height = 0){
        maxWidth = width;
        maxHeight = height;
        this.inPlay = false;
    }

    checkPositions(playerOne, playerTwo, ball) {

        // start the ball
        if (this.inPlay === false){
            this.inPlay = true;
            ball.reset();
            ball.setVelocity(velocityX, velocityY);
        }

        //ball boundary check and set direction
        if((ball.y + 16 + velocityY) >= maxHeight) {
            velocityY = -velocityY; // go the other way
        }
        else if ((ball.y + velocityY) <= minHeight){
            velocityY = Math.abs(velocityY); // make positive again to go back
        } 

        // check if ball went out 
        if((ball.x + velocityX) > maxWidth) {
            this.inPlay = false;
        } else if ((ball.x + velocityX) < minWidth){
            this.inPlay = false;
        }

        //checking ball vs paddle hits
            // front of paddle in x
        if (((ball.x + velocityX) <= (playerOne.x + paddleWidth)) && (playerOne.y < (ball.y + 8)) && ((ball.y + 8) < (playerOne.y + paddleHeight))) {
            velocityX = Math.abs(velocityX);
            velocityY = Math.abs(velocityY);
            console.log("hit player 1")
        }

        // checking ball vs paddle hits CPU
        if (((ball.x + 16 + velocityX) >= playerTwo.x) && (playerTwo.y < (ball.y + 8)) && ((ball.y + 8) < (playerTwo.y + paddleHeight))) {
            velocityX = -velocityX;
            velocityY = -velocityY;
            console.log("hit player 2")
        }

        ball.setVelocity(velocityX, velocityY);
    }

    calculateTrajectory(ball) {
        xZero = ball.x;
        yZero = ball.y;
        
    }

}