import * as React from 'react';
import PropTypes from 'prop-types';
import PlayerForm from './PlayerForm';
import PlayerPreview from './PlayerPreview';
import {Link} from 'react-router-dom';

function Instructions() {
    return (
        <section className='instructions-container'>
            <h2>Instructions</h2>
            <ol>
                <li>Enter 2 Github users</li>
                <li>Battle</li>
                <li>See the winner</li>
            </ol>
        </section>
    );
}

export default class Battle extends React.Component {
    state = {
        playerOne: null,
        playerTwo: null,
    };

    handleSubmit = (id, player) => {
        this.setState({
            [id]: player
        });
    };

    handleReset = (id) => {
        this.setState({
            [id]: null
        });
    };

    render() {
        const {playerOne, playerTwo} = this.state;
        const disabled = !playerOne || !playerTwo;

        return (
            <main className='stack main-stack animate-in'>
                <div className='split'>
                    <h1>Players</h1>
                    <Link
                        to={{
                            pathname: '/results',
                            search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`
                        }}
                        className={`btn primary ${disabled ? 'disabled' : ''}`}>
                        Battle
                    </Link>
                </div>
                <section className='grid'>
                    {playerOne === null ? (
                        <PlayerForm
                            label='Player One'
                            onSubmit={(player) => this.handleSubmit('playerOne', player)}
                        />
                    ) : (
                        <PlayerPreview
                            label='Player One'
                            username={playerOne}
                            onReset={() => this.handleReset('playerOne')}
                        />
                    )}
                    {playerTwo === null ? (
                        <PlayerForm
                            label='Player Two'
                            onSubmit={(player) => this.handleSubmit('playerTwo', player)}
                        />
                    ) : (
                        <PlayerPreview
                            label='Player Two'
                            username={playerTwo}
                            onReset={() => this.handleReset('playerTwo')}
                        />
                    )}
                </section>
                <Instructions />
            </main>
        );
    }
}
