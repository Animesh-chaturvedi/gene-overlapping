import React, { useState, useEffect } from 'react';

const SingleSelectCheckbox = ({pattern, changeSelected, selected}) => {

  const options = [
    "demo-image-3-removebg-preview.png",
    "demo-image-2-removebg-preview.png",
    "demo-image-1-removebg-preview.png"
  ];

  const handleChange = (value) => {
    changeSelected(pattern,value)
  };

  return (
    <div className="container mt-4">
      {options.map(option => (
        <div className="form-check" key={option}>
          <input
            className="form-check-input"
            type="checkbox"
            checked={selected[pattern] === option}
            onChange={() => handleChange(option)}
            id={option}
          />
          <label className="form-check-label" htmlFor={option}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default SingleSelectCheckbox;
