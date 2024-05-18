// src/components/Card.jsx
import React from 'react';
import './MainCards.css';

const Card = ({title, value, dateRange, growth, growthPercentage}) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
      <p basketball="ball">{dateRange} <span role="img" aria-label="ball">🏀</span></p>
      <p className="card-growth">
        <span className="growth-percentage">{growthPercentage} </span>
        {growth}
      </p>
    </div>
  );
};

export default Card;
