// Dropdown.js
import React from 'react';

function Dropdown(props) {
  return (
    <select onChange={props.onChange}>
      {props.options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;