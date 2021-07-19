let maxWidth, maxHeight;
let minWidth = 0;
let minHeight = 0;

// last coordinates
let velocityX = -4;
let velocityY = 4;

let paddleWidth = 16;
let halfHeight = 24;

// let lastBounce = [];

export default class Physics {
    constructor(width = 0, height = 0){
        maxWidth = width;
        maxHeight = height;
        this.inPlay = false;
        // lastBounce = [width/2, height/2]; // initial trajectory vector (x, y, angle)
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
        // lower
        if((ball.y + 8) >= maxHeight) {
            velocityY = -velocityY; // go the other way
            // storeing x, y
            // lastBounce[2] = approachAngle(ball.y, maxHeight, time)
            // lastBounce[0] = ball.x;
            // lastBounce[1] = maxHeight;
            // lastBounce[3] = PIXI.Ticker.shared.lastTime;
            // console.log(lastBounce);
        }
        // upper
        else if ((ball.y - 8) <= minHeight){
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
        if ((ball.x - 8) <= (playerOne.x + paddleWidth/2) && (ball.x > (playerOne.x - paddleWidth/2))){
            // top half of paddle
             if (((playerOne.y-halfHeight) <= (ball.y + 8)) && (ball.y < playerOne.y)) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY)-4;
             } 
             // middle of the paddle
             else if (ball.y === playerOne.y) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY);
             }
             // bottm half of paddle
             else if ((playerOne.y < ball.y) && ((ball.y - 8) <= (playerOne.y + halfHeight))) {
                velocityX = Math.abs(velocityX);
                velocityY = Math.abs(velocityY)+4;
             }
        }

        // checking ball vs paddle hits CPU/player2
            // front of paddle y
        if (((ball.x + 8) >= (playerTwo.x - paddleWidth/2)) && (ball.x < (playerTwo.x + paddleWidth/2))){
            if (((playerTwo.y - halfHeight) <= (ball.y + 8)) && (ball.y < playerTwo.y)) {
                velocityX = -velocityX;
                velocityY = -velocityY - 4;
            }
            // midle of the paddle 
            else if (ball.y === playerTwo.y) {
                velocityX = - velocityX;
                velocityY = -velocityY;
             }
            // bottom of the paddle
            else if ((playerTwo.y < ball.y) && ((ball.y - 8) <= (playerTwo.y + halfHeight))) {
                velocityX = -velocityX;
                velocityY = Math.abs(velocityY) + 4;
            }

        }

        ball.setVelocity(velocityX, velocityY);
    }

    // calculate the approach angle here 
    // static approachAngle(x, y, time) {
    //     // triangle genometry, a, b, c are the lengths of base, height and hypotenuse

    //     // find length of a by taking x values and subtracting
    //     const lengthA = Math.abs(lastBounce[1] - x);
    //     // find length of b by taking y values and subtracting
    //     const lengthB = Math.abs(lastBounce[0] - y);
    //     // find the length of the hypotenuse by pythagorean theroem
    //     const lengthC = Math.abs(Math.sqrt(Math.pow(lengthA, 2), Math.pow(lengthB, 2)));

    //     // calculate the angle of approach
    // }

}