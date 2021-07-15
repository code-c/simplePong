let maxWidth, maxHeight;
let minWidth = 0;
let minHeight = 0;

// last coordinates
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
            velocityX = -4;
            velocityY = 0;
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
            playerOne.scored();
            this.inPlay = false;
        } else if ((ball.x + velocityX) < minWidth){
            playerTwo.scored();
            this.inPlay = false;
        }

        //checking ball vs paddle hits
            // front of paddle in x
        if ((ball.x + velocityX) <= (playerOne.x + paddleWidth)){
            // top half of paddle
             if ((playerOne.y < (ball.y + 8)) && ((ball.y + 8) < (playerOne.y + paddleHeight/2))) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY)-2;
             } 
             // middle of the paddle
             else if ((ball.y + 8) === (playerOne.y + paddleHeight/2)) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY);
             }
             // bottm half of paddle
             else if (((playerOne.y + paddleHeight/2) < (ball.y + 8)) && ((ball.y + 8) < (playerOne.y + paddleHeight))) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY)+2;
             }
        }

        // checking ball vs paddle hits CPU/player2
            // front of paddle y
        if ((ball.x + 16 + velocityX) >= playerTwo.x){
            if ((playerTwo.y < (ball.y + 8)) && ((ball.y + 8) < (playerTwo.y + paddleHeight/2))) {
                velocityX = -velocityX;
                velocityY = -velocityY -2;
            }
            // midle of the paddle 
            else if ((ball.y + 8) === (playerTwo.y + paddleHeight/2)) {
                velocityX = - velocityX;
                velocityY = -Math.abs(velocityY);
             }
            // bottom of the paddle
            if (((playerTwo.y + paddleHeight/2) < (ball.y + 8)) && ((ball.y + 8) <= (playerTwo.y + paddleHeight))) {
                velocityX = -velocityX;
                velocityY = -velocityY + 2;
            }

        }

        ball.setVelocity(velocityX, velocityY);
    }

}