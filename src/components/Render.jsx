import React from 'react';
import * as PIXI from "pixi.js";
import Physics from "./physics.js";

// Sprite Classes
import Player from './Player.js';
import Ball from './Ball.js';
// score

// a map component
export default class Render extends React.Component {

    //using componenet did mount for PIXI game loop
    componentDidMount() {

        // calculate pixel width needed
        const pxWidth = 600;
        const pxHeight = 400;

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
        let physics = new Physics(pxWidth, pxHeight);
        
        // append to the body
        document.body.appendChild(renderer.view);

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

            // create player
            loadPlayers();

            // load ball
            ball = new Ball((pxWidth/2)-8, (pxHeight/2)-8);
            stage.addChild(ball);
        
            // Setup rendering loop
            PIXI.Ticker.shared.add(() => renderer.render(stage));
            PIXI.Ticker.shared.add(gameLoop);
        });

        // functions for getting input from the keyboard
        function keysDown(keyEvent) {
            keys[keyEvent.keyCode] = true;
        }

        function keysUp(keyEvent) {
            keys[keyEvent.keyCode] = false;
        }

        function gameLoop() {

            ball.move();
            
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

            // // shift (pickUp)
            // if (keys["16"]) {
            //     ball.startTwo();
            // }

            physics.checkPositions(playerOne, playerTwo, ball);
        }

        function loadPlayers() {

            const pxW = renderer.screen.width;
            const pxH = renderer.screen.height;
            playerOne = new Player(0, ((pxH/2)-24), 0, pxH);
            playerTwo = new Player((pxW-24), ((pxH/2)-24), 0, pxH);


            stage.addChild(playerOne);
            stage.addChild(playerTwo);

        }
        
    
    };
    render() {
        return (
            <div></div>
        )
    }
}