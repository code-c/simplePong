import React from 'react';

// styles
import '../style.css';

export default class Menu extends React.Component {

    // send number of players back to game
    setPlayers = (event) => {
        this.props.setPlayerCallback(event.target.value);
        event.preventDefault();
    }

    // display the rules and controls
    displayRules() {
        console.log("these are the rules")
    }


    render() {
        return (
            <div className = "menu">
                <button value={1} onClick={this.setPlayers}>
                    One Player
                </button>

                <button value={2} onClick={this.setPlayers}>
                    Two Player
                </button>

                {/* future button for displaying the rules and controls */}
                {/* <button onClick={this.displayRules}>
                    Controls and Rules
                </button> */}
            </div>
        )
    }
}