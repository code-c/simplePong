import React from 'react';
import * as PIXI from "pixi.js";
import Button from "react-bootstrap/Button";
import Physics from "./physics.js";
import CPU from "./Cpu.js";
import Menu from "./Menu";

// Sprite Classes
import Player from './Player.js';
import Ball from './Ball.js';
import ScoreBoard from './ScoreBoard.js';

//style
import '../style.css';

// global parameters for PIXI update loop
let numPlayers; // number of players in the game
let gameStart = false; // whether then game has started
let gameFinish = false; // whether the game has finished
let lastCount = 0; // the last time the start counter was updated
let currentCount; // the current time of the PIXI.Ticker used for the counter
let reset = false; // param to pass state to game logic

// the render component
export default class Render extends React.Component {
    // contructor using the state for the menu component updates
    constructor() {
        super();
        this.state = {
            numPlayers: 0,
            started: false,
            reset: false
        }
    }

    // useless test function
    // checkState = () => {
    //     console.log(this.state.numPlayers)
    //     if(this.state.numPlayers !== 0 ){
    //         this.setState({started: true})
    //     }
    // }
    // reset the game
    reset = (event) => {
        this.setState({reset: event.target.value});
        this.setState({started: false});
        this.setState({numPlayers: 0});
    }
    // call back function for the menu to set number of players
    setPlayers = (playerSelect) => {
        this.setState({numPlayers: playerSelect});
        this.setState({reset: false});
        this.setState({started: true});
    }

    //using componenet did mount for PIXI game loop
    componentDidMount() {

        // set the number of player to the current state of players which
        // should be set to 0 at this time
        numPlayers = this.state.numPlayers;

        // setting the win text parameters
        const win = new PIXI.Text('Player One WINS!',
                    {fontFamily: 'Arial',
                    fontSize: 36,
                    fontWeight: 'bold',
                    fill: ['#ffffff'],
                    strokeThickness: 5,}
                    );
        win.anchor.set(.5,.5);

        // setting the countdown text parameters
        const countDown = new PIXI.Text('3',
                    {fontFamily: 'Arial',
                    fontSize: 50,
                    fontWeight: 'bold',
                    fill: ['#ffffff'],
                    strokeThickness: 5,}
                    );
        countDown.anchor.set(.5,.5);
        // initializing the count to +1 that of the countdown time (3)
        let count = 4;

        // calculate pixel width needed
        const pxWidth = 600;
        const pxHeight = 400;
        // set final win text to center
        win.x = pxWidth/2;
        win.y = pxHeight/2;
        countDown.x = pxWidth/2;
        countDown.y = pxHeight/2;

        // PIXI renderer and settings
        const renderer = PIXI.autoDetectRenderer({
            antialias: true,
            autoDensity: true,
            resolution: window.devicePixelRatio || 1,
            width: pxWidth,
            height: pxHeight,
        });
        
        // declare variables being used regularly
        let stage;
        let keys = {};
        let touches = {
            up: false,
            down: false
        };
        let playerOne;
        let playerTwo;
        let ball;
        let scoreBoard;
        let physics = new Physics(pxWidth, pxHeight);
        let cpu = new CPU();

        // append to the body
        // use this to place to whatever div you want it in
        document.getElementById("Pong").appendChild(renderer.view);

        // listen for keys pressed
        window.addEventListener("keydown", keysDown);
        window.addEventListener("keyup", keysUp);
        window.addEventListener('touchstart', startTouch);
        window.addEventListener('touchmove', touchMove);
        window.addEventListener('touchend', cancelTouch);
        
        //create the PIXI loader
        const loader = new PIXI.Loader();
        
        // add resources to the loader to use later
        //loader.add();


        // on the load of the loader do the following
        loader.load((_, resources) => {
            //set stage
            stage = new PIXI.Container();

            // create and load players to stage
            loadPlayers();

            // load ball to stage
            ball = new Ball((pxWidth/2), (pxHeight/2));
            stage.addChild(ball);

            scoreBoard = new ScoreBoard(playerOne, playerTwo);
            stage.addChild(scoreBoard);
        
            // Setup rendering loop
            PIXI.Ticker.shared.add(() => renderer.render(stage));
            PIXI.Ticker.shared.add(gameLoop);
        });

        // functions for getting input from the keyboard
        function keysDown(keyEvent) {
            keys[keyEvent.keyCode] = true;
            keyEvent.preventDefault();
        }

        function keysUp(keyEvent) {
            keys[keyEvent.keyCode] = false;
            keyEvent.preventDefault();
        }

        function startTouch(touchEvent) {
            // get the coordinates of the game div
            var rect = document.getElementById("Pong").getBoundingClientRect();
            // get the touch location
            const currentTouch = touchEvent.touches[0].screenY;
            // check of touch is in the element on top or bottom and store relavent move
            if ((currentTouch > rect.top) && (currentTouch < (rect.top + pxHeight/2))) {
                touches.down = false;
                touches.up = true;
            } else if ((currentTouch > (rect.top + pxHeight/2)) && (currentTouch < rect.bottom)) {
                touches.down = true;
                touches.up = false;
            }    
        }

        function cancelTouch() {
            touches.up = false;
            touches.down = false;
        }

        function touchMove(touchEvent) {
            touchEvent.preventDefault();
        }


        // store the last ticker update and count down one for the countdown timer
        function countdown(){
            // things to do everytime
            stage.addChild(countDown);
            ball.reset();
            playerOne.reset();
            playerTwo.reset();

            // store last frame updates time
            currentCount = PIXI.Ticker.shared.lastTime;

            // check if time has elapsed enough
            if((currentCount - lastCount) > 800){
                // update the text on screen
                // I cant figure out why I have a +1 error but its a quick fix
                countDown.text = count - 1;

                //decrement the count
                count--;

                // set last count to the current
                lastCount = currentCount;
            }
        }

        function gameLoop() {
            // check if game ended
            if (gameFinish) {
                PIXI.Ticker.shared.stop();
            }
            // check if game was reset
            if(reset) {
                PIXI.Ticker.shared.start();
                console.log("game was reset");
                playerOne.reset();
                playerTwo.reset();
                ball.reset();
                reset = false;
                gameFinish = false;
                count = 4;
                stage.removeChild(win);
            }

            // check if number of players are set and if so start countdown loop
            if((numPlayers > 0) && !gameStart) {
                // start countdown cylce
                countdown()
                // at end we remove child and start game
                if (count === 0) {
                    stage.removeChild(countDown);
                    gameStart = true;
                }
            }

            // move the ball
            ball.move();

            if((numPlayers > 0) && gameStart) {
                //if single player or two player is selected player1 plays
                if(numPlayers >= 1 && numPlayers < 2){
                    // player one UP (W)
                    if(keys["87"] || touches.up) {
                        playerOne.moveUp();
                    }
                    // player one DOWN (S)
                    if(keys["83"] || touches.down) {
                        playerOne.moveDown();
                    }

                    // move the second paddle using the CPU
                    cpu.move(playerTwo, ball);

                }
                // if two player is selected the player2 can play
                if (numPlayers >= 2) {
                    // player one UP (W)
                    if(keys["87"]) {
                        playerOne.moveUp();
                    }
                    // player one DOWN (S)
                    if(keys["83"]) {
                        playerOne.moveDown();
                    }
                    // player two UP
                    if(keys["38"]) {
                        playerTwo.moveUp();
                    }
                    //player two DOWN
                    if(keys["40"]) {
                        playerTwo.moveDown();
                    }
                }
            }
            // check the position of all elements with the physics engine
            physics.checkPositions(playerOne, playerTwo, ball);
            // update the scoreboard
            scoreBoard.updateScore(playerOne, playerTwo);
            // check if score is to max
            checkScore();

        }

        function loadPlayers() {
            //store local variables based on current w/h
            const pxW = renderer.screen.width;
            const pxH = renderer.screen.height;
            // 16 pixels since its the 1/2 the width of the paddles
            playerOne = new Player(16, (pxH/2), 0, pxH);
            playerTwo = new Player((pxW-16), (pxH/2), 0, pxH);

            // add players to the stage
            stage.addChild(playerOne);
            stage.addChild(playerTwo);
        }

        function checkScore() {
            // check if player one wins
            if(playerOne.score === 10){
                stage.addChild(win);
                gameFinish = true;
            } 
            // check if player two wins
            else if(playerTwo.score === 10){
                stage.addChild(win);
                gameFinish = true;
                // change text of win for player 2
                win.text = "Player Two WINS!"
            }
        }
    };

    // update the number of players
    componentDidUpdate() {
        numPlayers = this.state.numPlayers;
        console.log("game component did an update")
        if(this.state.reset) {
            PIXI.Ticker.shared.start();
            gameStart = false;
            reset = true;
            numPlayers = 0;
        }
    }

    render() {
        return (
            <div>
                <div id="menu" className = { this.state.started ? "hidden" : "" }>
                    <Menu setPlayerCallback = {this.setPlayers} />
                </div>
                <div id="reset" className = { this.state.started ? "reset" : "hidden" }>
                    <Button value={true} onClick={this.reset}>
                        reset
                    </Button>
                </div>
            </div>
        )
    }
}