import * as React from 'react';
import PropTypes from 'prop-types';
import Hover from './Hover';

const styles = {
    position: 'relative',
    display: 'flex'
};

export default function Tooltip({children, element}) {
    return (
        <Hover>
            {(hovering) => (
                <div style={styles}>
                    {hovering && element}
                    {children}
                </div>
            )}
        </Hover>
    );
}

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    element: PropTypes.node.isRequired
};

