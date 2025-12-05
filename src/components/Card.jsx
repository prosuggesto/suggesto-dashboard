import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}>
            {children}
        </div>
    );
};

export default Card;
