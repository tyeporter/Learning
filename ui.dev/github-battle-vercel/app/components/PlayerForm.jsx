import * as React from 'react';
import PropTypes from 'prop-types';

export default class PlayerForm extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    state = {
        username: ''
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.onSubmit(this.state.username);
    };

    handleChange = (e) => {
        this.setState({
            username: e.target.value
        });
    };

    render() {
        return (
            <form className='card bg-light' onSubmit={this.handleSubmit}>
                <label htmlFor='username' className='player-label'>
                    {this.props.label}
                </label>
                <div className='input-row'>
                    <input
                        type='text'
                        id='username'
                        className='input-light'
                        placeholder='Github Username'
                        autoComplete='off'
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                    <button
                        className='btn link btn-dark'
                        type='submit'
                        disabled={!this.state.username}>
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}
