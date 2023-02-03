import * as React from 'react';
import PropTypes from 'prop-types';
import { close } from '../assets/icons';

export default function PlayerPreview({
    label,
    username,
    onReset
}) {
    return (
        <article className='card'>
            <h3 className='player-label'>{label}</h3>
            <div className='split'>
                <div className='row gap-md'>
                    <img
                        width={32}
                        height={32}
                        className='avatar'
                        src={`https://github.com/${username}.png?size=200`}
                        alt={`Avatar for ${username}`}
                    />
                    <a href={`https://github.com/${username}`} target='_blank' className='link'>
                        {username}
                    </a>
                </div>
                <button onClick={onReset} className='btn secondary icon'>
                    {close}
                </button>
            </div>
        </article>
    );
}

PlayerPreview.propTypes = {
    label: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    onReset: PropTypes.func.isRequired
};
