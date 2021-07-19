import React from 'react';
import Button from "react-bootstrap/Button";

// styles
import '../style.css';

export default class Menu extends React.Component {
    constructor() {
        super();
        this.state = {
            playerSelect: true,
            options: false
        }
    }

    // send number of players back to game
    setPlayers = (event) => {
        this.props.setPlayerCallback(event.target.value, false);
        event.preventDefault();
    }

    // reset = (event) => {
    //     this.props.setPlayerCallback(0, event.target.value);
    //     event.preventDefault();
    // }
    // display the rules and controls
    displayRules = () => {
        this.setState({options: true});
        this.setState({playerSelect: false});
    }

    displayPlayerSelect = () => {
        this.setState({options: false});
        this.setState({playerSelect: true});
    }

    render() {
        return (
            <>
            <div className = "menu">
                <div id="playerSelect" className = { this.state.playerSelect ? "" : "hidden" }>
                    <Button value={1} onClick={this.setPlayers}>
                        One Player
                    </Button>
                    <Button value={2} onClick={this.setPlayers}>
                        Two Player
                    </Button>
                    <Button onClick={this.displayRules}>
                        Controls and Rules
                    </Button>
                </div>
            </div>
            <div id="rules" className = { this.state.options ? "rules" : "hidden" }>
            <h3>Rules</h3>
            <p>
                first one to 10 points wins <br></br>
                use keys 'w' and 's' for up and down <br></br>
                movement respectively for left paddle <br></br>
                use arrow keys up and down for right paddle <br></br>
            </p>
            <Button onClick={this.displayPlayerSelect}>
                back
            </Button>
        </div>
        </>
        )
    }
}