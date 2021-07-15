
let paddleHeight = 48;

export default class Cpu {

    move(player, ball) {
        // if the ball is in the CPU's court it moves to meet the ball
        if (ball.x > 300) {
            // if the ball is below it, move down
            if((player.y + paddleHeight/2) < ball.y + 8) {
                player.moveDown();
            }
            // if the ball is above it, move up
            else if((player.y + paddleHeight/2) > ball.y + 8) {
                player.moveUp();
            }
        }
    }
    
}