import React from 'react';
import * as PIXI from "pixi.js";
import Physics from "./physics.js";
import CPU from "./Cpu.js";
import Menu from "./Menu";

// Sprite Classes
import Player from './Player.js';
import Ball from './Ball.js';
import ScoreBoard from './ScoreBoard.js';

//style
import '../style.css';

let numPlayers;
let gameStart = false;
let gameFinish = false;
let lastCount = 0;
let currentCount;

// the render component
export default class Render extends React.Component {
    constructor() {
        super();
        this.state = {
            numPlayers: 0,
            started: false
        }
    }

    checkState = () => {
        console.log(this.state.numPlayers)
        if(this.state.numPlayers !== 0 ){
            this.setState({started: true})
        }
    }

    setPlayers = (menuData) => {
        this.setState({numPlayers: menuData})
        this.setState({started: true})
    }

    //using componenet did mount for PIXI game loop
    componentDidMount() {

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
                    fontSize: 36,
                    fontWeight: 'bold',
                    fill: ['#ffffff'],
                    strokeThickness: 5,}
                    );
        countDown.anchor.set(.5,.5);

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
        let playerOne;
        let playerTwo;
        let ball;
        let scoreBoard;
        let physics = new Physics(pxWidth, pxHeight);
        let cpu = new CPU();

        // append to the body
        // use this to place to whatever div you want it in
        document.getElementById("App").appendChild(renderer.view);

        // listen for keys pressed
        window.addEventListener("keydown", keysDown);
        window.addEventListener("keyup", keysUp);
        
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

        // function startGame() {
        //     // loops till start of game
        //     if (!gameStart) {
        //         console.log("didnt start")
        //         return true;
        //     }
        //     else if(gameStart){
        //         console.log("did start")
        //         return false;
        //     }
        // }

        // functions for getting input from the keyboard
        function keysDown(keyEvent) {
            keys[keyEvent.keyCode] = true;
        }

        function keysUp(keyEvent) {
            keys[keyEvent.keyCode] = false;
        }


        // store the last ticker update and count down one
        function countdown(){
            // things to do everytime
            stage.addChild(countDown);
            ball.reset();

            // store last frame updates time
            currentCount = PIXI.Ticker.shared.lastTime;
            // console.log("current Time", currentCount);
            // console.log("last time: ", lastCount)
            // console.log("difference:", (currentCount - lastCount))
            if((currentCount - lastCount) > 800){
                // update the text on screen
                countDown.text = count - 1;

                //decrement the count
                count--;

                // set last count to the current
                lastCount = currentCount;

                console.log(count);
            }
        }

        function gameLoop() {
            // check if game ended
            if (gameFinish === true) {
                PIXI.Ticker.shared.stop();
            }

            // check if number of players are set and if so start countdown loop
            if((numPlayers > 0) && !gameStart) {
                countdown()
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
                    if(keys["87"]) {
                        playerOne.moveUp();
                    }
                    // player one DOWN (S)
                    if(keys["83"]) {
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

            const pxW = renderer.screen.width;
            const pxH = renderer.screen.height;
            // 16 pixels since its the 1/2 the width of the paddles
            playerOne = new Player(16, (pxH/2), 0, pxH);
            playerTwo = new Player((pxW-16), (pxH/2), 0, pxH);


            stage.addChild(playerOne);
            stage.addChild(playerTwo);
        }

        function checkScore() {
            // check if player one wins
            if(playerOne.score === 12){
                stage.addChild(win);
                gameFinish = true;
            } 
            // check if player two wins
            else if(playerTwo.score === 12){
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
        console.log("compoenent did an update")
    }

    render() {
        return (
            <div className='gameContainer'>
                <div id="menu" className = { this.state.started ? "hidden" : "" }>
                <Menu setPlayerCallback = {this.setPlayers} />
                </div>
            </div>
        )
    }
}
